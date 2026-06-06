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
            'proyectos',
            'propietarios'
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

          // ========== ROL CAPTURISTA ==========
        $capturistaRole = Role::firstOrCreate(
            ['name' => 'Capturista', 'guard_name' => 'web'],
            [
                'name' => 'Capturista',
                'guard_name' => 'web',
            ]
        );



        // Admin tendrá todos los permisos
        $adminRole->syncPermissions(Permission::all());

        // Usuario solo lectura 
        $readPermissions = Permission::where('name', 'like', '%.read')
            ->get();

        $userRole->syncPermissions($readPermissions);

        // Asignar permisos específicos para Capturista
        $capturistaPermissions = [
            'reportes.read',
            'reportes.export',     
            'clientes.read',
            'clientes.create',
            'clientes.export',
            "contratos.read",
            "contratos.create",
            "recibos.read",
            "recibos.create",
            "manzanas.read",
            "manzanas.create",
            "etapas.read",
            "etapas.create",
            "proyectos.read",
            "proyectos.create",
            "propietarios.read",
            "propietarios.create",
            "agentes.read",
            "agentes.create",
            "lotes.read",
            "lotes.create",
            "clientes.read",
            "clientes.create",
        ];
        $capturistaRole->syncPermissions($capturistaPermissions);

    }
}
