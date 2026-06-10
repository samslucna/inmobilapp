<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;

class RoleController extends Controller implements hasMiddleware
{
    /**
     * Define los middlewares con permisos de Spatie (Laravel 11).
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:usuarios.read', only: ['index', 'show', 'search']),
            new Middleware('permission:usuarios.create', only: ['store']),
            new Middleware('permission:usuarios.update', only: ['update']),
            new Middleware('permission:usuarios.delete', only: ['destroy']),
        ];
    }

    /**
     * Listar roles paginados precargando sus permisos.
     */
    public function index()
    {
        // Usamos with('permissions') para evitar consultas duplicadas (Problema N+1)
        $roles = Role::with('permissions')->paginate(10);
        //dd($roles);
        return RoleResource::collection($roles);
    }

    /**  
     * Crear un rol y asignarle permisos simultáneamente.
     */

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {

            $role = Role::create([
                'name' => $request->name,
                'guard_name' => 'web'
            ]);

            $permissions = $this->buildPermissions(
                $request->permissions
            );

            $role->syncPermissions(
                $permissions
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'role' => $role
            ]);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function buildPermissionsvone(array $modules)
    {
        $permissions = [];

        foreach ($modules as $module) {

            $name = $module['module'];

            if ($module['create']) {
                $permissions[] =
                    "{$name}.create";
            }

            if ($module['read']) {
                $permissions[] =
                    "{$name}.read";
            }

            if ($module['update']) {
                $permissions[] =
                    "{$name}.update";
            }

            if ($module['delete']) {
                $permissions[] =
                    "{$name}.delete";
            }
        }

        return $permissions;
    }




    private function permissionsToModules($role)
    {
        $modules = [];

        foreach ($role->permissions as $permission) {

            [$module, $action] =
                explode('.', $permission->name);

            if (!isset($modules[$module])) {

                $modules[$module] = [
                    'module' => $module,
                    'create' => false,
                    'read' => false,
                    'update' => false,
                    'delete' => false,
                ];
            }

            $modules[$module][$action] = true;
        }

        return array_values($modules);
    }

    public function debugPermissions(Request $request)
    {
        return response()->json([
            'received' => $request->all(),
            'permissions_array' => $request->permissions,
            'build_permissions' => $this->buildPermissions($request->permissions ?? [])
        ]);
    }

    private function buildPermissions(array $modules): array
    {
        $permissions = [];

        foreach ($modules as $module) {
            // Asegurar que el módulo tiene todas las keys necesarias
            $name = $module['module'] ?? null;

            if (!$name) {
                continue; // Saltar si no hay nombre de módulo
            }

            // Usar ?? false para valores no definidos explícitamente
            $canCreate = $module['create'] ?? false;
            $canRead = $module['read'] ?? false;
            $canUpdate = $module['update'] ?? false;
            $canDelete = $module['delete'] ?? false;

            // Convertir a boolean explícitamente (por si viene como string "true"/"false")
            if ($canCreate) {
                $permissions[] = "{$name}.create";
            }

            if ($canRead) {
                $permissions[] = "{$name}.read";
            }

            if ($canUpdate) {
                $permissions[] = "{$name}.update";
            }

            if ($canDelete) {
                $permissions[] = "{$name}.delete";
            }
        }

        return $permissions;
    }




    public function updateRoles(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:roles,id',
            'name' => 'required|string|unique:roles,name,' . $request->id,
            'permissions' => 'nullable|array'
        ]);

        \Log::info('=== INICIO ACTUALIZACIÓN ROL ===');
        \Log::info('Datos recibidos:', [
            'role_id' => $request->id,
            'role_name' => $request->name,
            'permissions_count' => count($request->permissions ?? []),
            'permissions_structure' => $request->permissions
        ]);

        DB::beginTransaction();

        try {
            $role = Role::findOrFail($request->id);

            // Actualizar nombre del rol
            $role->update([
                'name' => $request->name,
                'guard_name' => 'web'
            ]);

            \Log::info('Rol actualizado:', ['role' => $role->toArray()]);

            // Construir array de nombres de permisos
            $permissionNames = [];

            // Verificar si vienen permisos en el request
            if ($request->has('permissions') && is_array($request->permissions)) {
                foreach ($request->permissions as $module) {
                    // Verificar que el módulo tenga la estructura esperada
                    if (!isset($module['module'])) {
                        \Log::warning('Módulo sin nombre:', $module);
                        continue;
                    }

                    $moduleName = $module['module'];

                    // Verificar cada acción
                    if (isset($module['create']) && filter_var($module['create'], FILTER_VALIDATE_BOOLEAN)) {
                        $permissionNames[] = "{$moduleName}.create";
                    }

                    if (isset($module['read']) && filter_var($module['read'], FILTER_VALIDATE_BOOLEAN)) {
                        $permissionNames[] = "{$moduleName}.read";
                    }

                    if (isset($module['update']) && filter_var($module['update'], FILTER_VALIDATE_BOOLEAN)) {
                        $permissionNames[] = "{$moduleName}.update";
                    }

                    if (isset($module['delete']) && filter_var($module['delete'], FILTER_VALIDATE_BOOLEAN)) {
                        $permissionNames[] = "{$moduleName}.delete";
                    }
                }
            }

            \Log::info('Permisos a sincronizar:', $permissionNames);

            // Primero, asegurar que los permisos existen en la base de datos
            foreach ($permissionNames as $permName) {
                \Spatie\Permission\Models\Permission::firstOrCreate([
                    'name' => $permName,
                    'guard_name' => 'web'
                ]);
            }

            // Sincronizar permisos
            $role->syncPermissions($permissionNames);

            // Verificar que se guardaron
            $finalPermissions = $role->permissions->pluck('name')->toArray();
            \Log::info('Permisos finales después de sync:', $finalPermissions);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Rol y permisos actualizados correctamente.',
                'data' => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'permissions' => $finalPermissions,
                    'permissions_by_module' => $this->permissionsToModules($role)
                ]
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            \Log::error('Error al actualizar rol:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el rol: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateRole(Request $request)
{
    try {
        $role = Role::findOrFail($request->id);
        
        // Actualizar nombre
        $role->name = $request->name;
        $role->save();
        
        // Si no hay permisos, limpiar todos
        if (empty($request->permissions)) {
            $role->syncPermissions([]);
            return response()->json([
                'success' => true,
                'message' => 'Permisos limpiados',
                'data' => ['id' => $role->id, 'name' => $role->name, 'permissions' => []]
            ]);
        }
        
        // Construir lista de permisos
        $permissionList = [];
        foreach ($request->permissions as $module) {
            $moduleName = $module['module'];
            
            if (!empty($module['create'])) $permissionList[] = "{$moduleName}.create";
            if (!empty($module['read'])) $permissionList[] = "{$moduleName}.read";
            if (!empty($module['update'])) $permissionList[] = "{$moduleName}.update";
            if (!empty($module['delete'])) $permissionList[] = "{$moduleName}.delete";
        }
        
        // Crear permisos si no existen
        foreach ($permissionList as $permName) {
            \Spatie\Permission\Models\Permission::firstOrCreate([
                'name' => $permName,
                'guard_name' => 'web'
            ]);
        }
        
        // Asignar permisos
        $role->syncPermissions($permissionList);
        
        return response()->json([
            'success' => true,
            'message' => 'Rol actualizado',
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->getPermissionNames()
            ]
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
}
