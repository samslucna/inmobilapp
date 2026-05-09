<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Scout\Searchable;

class Contract extends Model
{

    use HasFactory, Notifiable, HasApiTokens, Searchable;
    protected $table = 'contracts';
    protected $primaryKey = 'id';
    public $incrementing = true;
    //
    protected $fillable = [
        "buyer_id",
        "seller_id",
        "agent_id",
        "property_id",
        "plazo",
        "paytype",
        "ref",
        "advance",
        "date",
    ];


    public function tickets()
    {

        return $this->hasMany(Ticket::class);
    }
    public function buyer()
    {

        return $this->belongsTo(Buyer::class, 'buyer_id');
    }

    public function seller()
    {

        return $this->belongsTo(Seller::class);
    }


    public function property()
    {

        return $this->belongsTo(Property::class);
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }
}
