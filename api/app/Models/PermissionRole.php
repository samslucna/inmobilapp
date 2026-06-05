<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Scout\Searchable;
use Spatie\Permission\Models\Role;

class PermissionRole extends Model
{
    //
    use HasFactory, Notifiable, HasApiTokens, Searchable;

    protected $fillable = [
        'permision_id',
        "role_id",
    ];


    public function permisionuser()
    {

        return $this->belongsTo(PermissionUser::class, 'permision_id');
    }


     public function role()
    {

        return $this->belongsTo(Role::class, 'id');
    }
}
