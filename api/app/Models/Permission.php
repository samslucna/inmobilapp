<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Scout\Searchable;

class Permission extends Model
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

       
      public function project(){

        return $this->belongsTo(Project::class);
    }

 
}

   