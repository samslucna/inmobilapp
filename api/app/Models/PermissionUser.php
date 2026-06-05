<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Scout\Searchable;

class PermissionUser extends Model
{
    //
    use HasFactory, Notifiable ,HasApiTokens,Searchable;
 
    protected $fillable = [    
        "module",
        "create",
        "read", 
        "update",
        "delete"
    ];

 
}

   