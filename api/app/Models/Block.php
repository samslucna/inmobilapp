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

class Block extends Model
{
    //
    use HasFactory, Notifiable ,HasApiTokens,Searchable;
 
    protected $fillable = [
        "name",
        "description",
        "stage_id"
    ];

  
   public function stage(){

        return $this->belongsTo(Stage::class);
    }
 
}
