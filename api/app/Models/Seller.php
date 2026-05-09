<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class Seller extends Model
{
    use HasFactory, Notifiable ,HasApiTokens;
 
    protected $fillable = [
        "name",
        "lastnames",
        "address",
        "phone",
          "dni",
        "email"
        
    ];
}
