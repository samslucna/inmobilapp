<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = [
            'usuarios',
            'recibos',
            'lotes',
            'limites',
            'reportes',
            'contratos',
            'clientes',
            'agentes',
            'etapas',
            'manzanas',
            'proyectos'
        ];

        $actions = [
            'create',
            'read',
            'update',
            'delete',
            'export'
        ];

        foreach ($modules as $module) {
            foreach ($actions as $action) {

                Permission::firstOrCreate([
                    'name' => "{$module}.{$action}",
                    'guard_name' => 'web'
                ]);
            }
        }

        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web'
        ]);

        $userRole = Role::firstOrCreate([
            'name' => 'user',
            'guard_name' => 'web'
        ]);

        // Admin tendrá todos los permisos
        $adminRole->syncPermissions(Permission::all());

        // Usuario solo lectura
        $readPermissions = Permission::where('name', 'like', '%.read')
            ->get();

        $userRole->syncPermissions($readPermissions);
    }
}
