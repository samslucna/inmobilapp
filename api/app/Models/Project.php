<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Scout\Searchable;

class Project extends Model
{
    //
    use HasFactory, Notifiable ,HasApiTokens,Searchable;
 
    protected $fillable = [
        
        "name",
    ];

  public function stages()
    {

        return $this->hasMany(Stage::class);
    }

 
}
