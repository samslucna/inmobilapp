<?php

namespace App\Http\Controllers\Api;

use App\Services\AuditLogService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Registrar un nuevo usuario.
     */
    public function register(Request $request): JsonResponse
    {
        try {
            // Validación mejorada
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Crear usuario
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'status' => 1, // Usuario activo por defecto
            ]);

            // Asignar rol por defecto (ej: 'viewer')
            if (class_exists('Spatie\Permission\Models\Role')) {
                $defaultRole = \Spatie\Permission\Models\Role::where('name', 'viewer')->first();
                if ($defaultRole) {
                    $user->assignRole($defaultRole);
                }
            }

            // Registrar el registro del usuario en bitácora
            AuditLogService::log(
                description: "Nuevo usuario registrado: {$user->name}",
                event: 'registered',
                logName: 'auth',
                properties: [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ],
                subject: $user
            );

            // Crear token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado exitosamente',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'access_token' => $token,
                'token_type' => 'Bearer',
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Iniciar sesión de usuario.
     */
    public function login(Request $request): JsonResponse
    {
        try {
            // Validar credenciales
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Intentar autenticar
            if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
                // Registrar intento fallido en bitácora
                AuditLogService::log(
                    description: "Intento de inicio de sesión fallido",
                    event: 'login_failed',
                    logName: 'auth',
                    properties: [
                        'email' => $request->email,
                        'ip' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                    ],
                    severity: 'warning'
                );

                return response()->json([
                    'success' => false,
                    'message' => 'Credenciales inválidas'
                ], 401);
            }

            $user = Auth::user();

            // Verificar si el usuario está activo
            if ($user->status != 1) {
                Auth::logout();
                
                AuditLogService::log(
                    description: "Intento de acceso de usuario inactivo",
                    event: 'login_inactive',
                    logName: 'auth',
                    properties: [
                        'user_id' => $user->id,
                        'user_email' => $user->email,
                        'ip' => $request->ip(),
                    ],
                    subject: $user,
                    severity: 'warning'
                );

                return response()->json([
                    'success' => false,
                    'message' => 'Usuario inactivo. Contacte al administrador.'
                ], 403);
            }

            // Revocar tokens anteriores (opcional, mejora seguridad)
            // $user->tokens()->delete();

            // Crear nuevo token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Registrar inicio de sesión exitoso en bitácora
            AuditLogService::log(
                description: "Usuario {$user->name} inició sesión",
                event: 'login',
                logName: 'auth',
                properties: [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ],
                subject: $user
            );

            return response()->json([
                'success' => true,
                'message' => 'Inicio de sesión exitoso',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'access_token' => $token,
                'token_type' => 'Bearer',
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al iniciar sesión: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cerrar sesión de usuario.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Registrar cierre de sesión en bitácora
            AuditLogService::log(
                description: "Usuario {$user->name} cerró sesión",
                event: 'logout',
                logName: 'auth',
                properties: [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'ip' => $request->ip(),
                ],
                subject: $user
            );

            // Revocar el token actual
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sesión cerrada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cerrar sesión: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener usuario autenticado.
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'status' => $user->status,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refrescar token (opcional).
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Revocar token actual
            $request->user()->currentAccessToken()->delete();
            
            // Crear nuevo token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Registrar refresh de token
            AuditLogService::log(
                description: "Token refrescado para usuario {$user->name}",
                event: 'token_refresh',
                logName: 'auth',
                properties: [
                    'user_id' => $user->id,
                    'ip' => $request->ip(),
                ],
                subject: $user
            );

            return response()->json([
                'success' => true,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al refrescar token: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cambiar contraseña.
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();

            // Verificar contraseña actual
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contraseña actual incorrecta'
                ], 401);
            }

            // Actualizar contraseña
            $user->password = Hash::make($request->new_password);
            $user->save();

            // Registrar cambio de contraseña
            AuditLogService::log(
                description: "Usuario {$user->name} cambió su contraseña",
                event: 'password_change',
                logName: 'auth',
                properties: [
                    'user_id' => $user->id,
                    'ip' => $request->ip(),
                ],
                subject: $user,
                severity: 'warning'
            );

            // Opcional: Revocar todos los tokens excepto el actual
            // $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contraseña actualizada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar contraseña: ' . $e->getMessage()
            ], 500);
        }
    }
}