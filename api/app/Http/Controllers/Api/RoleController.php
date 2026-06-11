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

    // En RoleController.php - Agregar endpoint para obtener módulos
    public function getAvailableModules()
    {
        // Puedes obtener los módulos desde una configuración o desde la BD
        $modules = [
            ['id' => 1, 'name' => 'usuarios', 'description' => 'Gestión de usuarios'],
            ['id' => 2, 'name' => 'recibos', 'description' => 'Gestión de recibos'],
            ['id' => 3, 'name' => 'lotes', 'description' => 'Administración de lotes'],
            ['id' => 4, 'name' => 'limites', 'description' => 'Configuración de límites'],
            ['id' => 5, 'name' => 'reportes', 'description' => 'Generación de reportes'],
            ['id' => 6, 'name' => 'contratos', 'description' => 'Gestión de contratos'],
            ['id' => 7, 'name' => 'clientes', 'description' => 'Administración de clientes'],
            ['id' => 8, 'name' => 'agentes', 'description' => 'Gestión de agentes'],
            ['id' => 9, 'name' => 'etapas', 'description' => 'Configuración de etapas'],
            ['id' => 10, 'name' => 'manzanas', 'description' => 'Administración de manzanas'],
            ['id' => 11, 'name' => 'proyectos', 'description' => 'Gestión de proyectos'],
            ['id' => 12, 'name' => 'propietarios', 'description' => 'Gestión de propietarios'],
        ];

        return response()->json([
            'success' => true,
            'data' => $modules
        ]);
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
