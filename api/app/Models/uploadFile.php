<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class uploadFile extends Model
{
    protected $fillable = [
        "name",
        "fileurl",
        "datas",
    ];
}
