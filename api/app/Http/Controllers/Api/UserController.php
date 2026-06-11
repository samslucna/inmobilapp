<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Resources\UserResource;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UserController extends Controller implements HasMiddleware
{
    /**
     * Define los middlewares con permisos de Spatie
     */
    public static function middleware(): array
    {
        return [
            new Middleware(
                'permission:usuarios.read',
                only: ['index', 'show', 'search']
            ),
            new Middleware(
                'permission:usuarios.create',
                only: ['store']
            ),
            new Middleware(
                'permission:usuarios.update',
                only: ['update']
            ),
            new Middleware(
                'permission:usuarios.delete',
                only: ['destroy']
            ),
        ];
    }

    /**
     * Display a listing of the resource with pagination and filters.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 10);
            $search = $request->input('search', '');
            
            $query = User::with('role');
            
            // Aplicar búsqueda si existe
            if (!empty($search)) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%");
                });
            }
            
            $users = $query->paginate($perPage);
            
            // Transformar los datos para el frontend
            $users->getCollection()->transform(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? '',
                    'rol_id' => $user->role_id,
                    'rol_name' => $user->role->name ?? 'Sin rol',
                    'status' => $user->status,
                    'active' => $user->status == 1,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $users->items(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar usuarios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        //dd($request->all());
        DB::beginTransaction();
        
        try {
            // Validación mejorada
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
                'role_id' => 'required|exists:roles,id',
                'active' => 'boolean',
                'phone' => 'nullable|string|max:20',
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
                'phone' => $request->phone ?? null,
                'role_id' => $request->role_id,
                'status' => $request->active ? 1 : 0,
                'password' => Hash::make($request->password)
            ]);
            
            // Asignar rol usando Spatie
            if ($request->has('role_id')) {
                $role = \Spatie\Permission\Models\Role::find($request->role_id);
                if ($role) {
                    $user->assignRole($role->name);
                }
            }
            
            DB::commit();
            
            // Cargar relación del rol
            $user->load('role');
            
            return response()->json([
                'success' => true,
                'message' => 'Usuario creado exitosamente',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role_id' => $user->role_id,
                    'role_name' => $user->role->name ?? null,
                    'active' => $user->status == 1,
                    'created_at' => $user->created_at,
                ]
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al crear usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        try {
            $user = User::with('role')->find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role_id' => $user->role_id,
                    'role_name' => $user->role->name ?? null,
                    'active' => $user->status == 1,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        //dd($request);
        DB::beginTransaction();
        
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }
            
            // Validación mejorada para actualización
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email')->ignore($id)
                ],
                'password' => 'nullable|string|min:8',
                'role_id' => 'required|exists:roles,id',
                'active' => 'boolean',
                'phone' => 'nullable|string|max:20',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Preparar datos para actualizar
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone ?? $user->phone,
                'role_id' => $request->role_id,
                'status' => $request->active ? 1 : 0,
            ];
            
            // Solo actualizar contraseña si se proporcionó
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }
            
            // Actualizar usuario
            $user->update($updateData);
            
            // Actualizar rol usando Spatie
            $role = \Spatie\Permission\Models\Role::find($request->role_id);
            if ($role) {
                $user->syncRoles([$role->name]);
            }
            
            DB::commit();
            
            // Cargar relación actualizada
            $user->load('role');
            
            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role_id' => $user->role_id,
                    'role_name' => $user->role->name ?? null,
                    'active' => $user->status == 1,
                    'updated_at' => $user->updated_at,
                ]
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();
        
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }
            
            // Evitar eliminar el propio usuario
            if (auth()->id() == $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes eliminar tu propio usuario'
                ], 403);
            }
            
            // Eliminar tokens del usuario
            $user->tokens()->delete();
            
            // Eliminar usuario
            $user->delete();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente',
                'data' => ['id' => $id]
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search users by term.
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->input('q', '');
            
            if (empty($query)) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }
            
            $users = User::with('role')
                ->where('name', 'LIKE', "%{$query}%")
                ->orWhere('email', 'LIKE', "%{$query}%")
                ->limit(20)
                ->get();
            
            $transformedUsers = $users->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                    'role_name' => $user->role->name ?? null,
                    'active' => $user->status == 1,
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $transformedUsers
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la búsqueda: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle user active status.
     */
    public function toggleStatus(Request $request, $id): JsonResponse
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 404);
            }
            
            $newStatus = $user->status == 1 ? 0 : 1;
            $user->status = $newStatus;
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => $newStatus ? 'Usuario activado' : 'Usuario desactivado',
                'data' => [
                    'id' => $user->id,
                    'active' => $newStatus == 1
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar estado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get users by role.
     */
    public function getByRole(Request $request, $roleId): JsonResponse
    {
        try {
            $users = User::with('role')
                ->where('role_id', $roleId)
                ->where('status', 1)
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $users
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios por rol: ' . $e->getMessage()
            ], 500);
        }
    }
}