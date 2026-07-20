<?php

namespace App\Models;

use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'status',
    ];


    protected $hidden = [
        'password',
        'remember_token',
    ];

  
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

 
    /**
     * Configurar el logging para el modelo User.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'role_id', 'status'])
            ->logOnlyDirty() // Solo registrar cuando hay cambios
            ->dontSubmitEmptyLogs() // No crear logs vacíos
            ->useLogName('users') // Nombre del log para filtrar por módulo
            ->setDescriptionForEvent(function(string $eventName) {
                $descriptions = [
                    'created' => 'Se creó un nuevo usuario',
                    'updated' => 'Se actualizó un usuario',
                    'deleted' => 'Se eliminó un usuario',
                ];
                
                return $descriptions[$eventName] ?? "Usuario {$eventName}";
            });
    }

    public function role()
    {
        return $this->belongsTo(Role::class,'role_id');
    }


}
