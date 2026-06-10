<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\PermissionRole;
use App\Models\Role;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission as ModelsPermission;
use Spatie\Permission\Models\Role as ModelsRole;

class UserPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // Resetear caché de permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        // Permisos completos para admin en todos los módulos
        $modules = [
            'usuarios',
            'propietarios',
            'recibos',
            'lotes',
            'reportes',
            'contratos',
            'clientes',
            'agentes',
            'etapas',
            'manzanas',
            'proyectos'
        ];
        $actions = ['create', 'read', 'update', 'delete'];


        // Crear permisos para cada módulo y acción
        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $permissionName = "{$module}.{$action}";
                // Crear permiso si no existe
                ModelsPermission::firstOrCreate(
                    [
                        'name' => $permissionName,
                        'guard_name' => 'web',
                    ]
                );
            }
        }

        // Crear Rol Administrador (todos los permisos)
        $adminRole = ModelsRole::firstOrCreate(
            [
                'name' => 'Administrador',
                'guard_name' => 'web',
            ]
        );

        // Asignar todos los permisos al rol Administrador
        $allPermissions = ModelsPermission::all();
        
        
        $adminRole->syncPermissions($allPermissions);

        // Crear usuario Administrador
        $adminUser = User::firstOrCreate(
           
            [
                'name' => 'Samuel',
                'email' => 'sam@gmail.com',
                'password' => bcrypt('s19'),
                'role_id' => $adminRole->id,
            ]
        );


    

        // Asignar rol al usuario
        $adminUser->assignRole($adminRole);

        // ========== ROL CAPTURISTA ==========
        $capturistaRole = ModelsRole::firstOrCreate(
          
            [
                'name' => 'Capturista',
                'guard_name' => 'web',
            ]
        );


        // Asignar permisos específicos para Capturista
        $capturistaPermissions = [
            'reportes.read',      // Solo lectura en reportes
            'clientes.read',      // Lectura en clientes
        ];

        $capturistaRole->syncPermissions($capturistaPermissions);

        // Crear usuario Capturista
        $capturistaUser = User::firstOrCreate(
           
            [
                'name' => 'Joaquin',
                'email' => 'joaquin@gmail.com',
                'password' => bcrypt('motsakki2026'),
                'role_id' => $capturistaRole->id,
            ]
        );

        $capturistaUser->assignRole($capturistaRole);

        // ========== ROL CONSULTOR (Solo lectura) ==========
        $consultorRole = ModelsRole::firstOrCreate(
            [
                'name' => 'Consultor',
                'guard_name' => 'web',
            ]
        );

        // Asignar permisos de solo lectura
        $consultorPermissions = [];
        foreach ($modules as $module) {
            $consultorPermissions[] = "{$module}.read";
        }

        $consultorRole->syncPermissions($consultorPermissions);

        // ========== ROL CONTADOR (Recibos completos) ==========
        $contadorRole = ModelsRole::firstOrCreate(
            [
                'name' => 'Contador',
                'guard_name' => 'web',
            ]
        );

        $contadorPermissions = [
            'recibos.read',
            'recibos.create',
            'recibos.update',
            'recibos.delete',
            'reportes.read',
        ];

        $contadorRole->syncPermissions($contadorPermissions);


        // Mostrar resumen en consola
        $this->command->info('Roles y permisos creados exitosamente:');
        $this->command->info('Permisos totales: ' . ModelsPermission::count());
        $this->command->info('Roles totales: ' . ModelsRole::count());
        $this->command->info('Usuarios creados:');
        $this->command->info('- Admin: sam@gmail.com / s19');
        $this->command->info('- Capturista: joaquin@gmail.com / motsakki2026');
    }

    
}
