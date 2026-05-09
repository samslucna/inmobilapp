<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ticket extends Model
{
     use HasFactory, Notifiable ,HasApiTokens;
    protected $fillable = [
        "concept",
        "amount",
        "date",
        "paytype",
        "status",
        "ref",
        "contract_id",
    ];
}
