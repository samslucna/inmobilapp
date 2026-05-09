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

class Property extends Model
{
    //
    use HasFactory, Notifiable, HasApiTokens, Searchable;

    protected $fillable = [
        "name",
        "description",
        "m2",
        "address",
        "block_id",
        "amount_init",
        "amount_end",
        "status",
        "boundaries",
    ];

    public function block()
    {

        return $this->belongsTo(Block::class);
    }


      public function boundaries()
    {

        return $this->hasMany(Boundary::class);
    }
}
