<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Ticket extends Model
{
    use HasFactory, Notifiable, HasApiTokens, LogsActivity;
    protected $fillable = [
        "concept",
        "amount",
        "date",
        "paytype",
        "status",
        "ref",
        "contract_id",
    ];


        /**
     * Relación con el contrato.
     * 🔧 RELACIÓN AGREGADA
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    /**
     * Relación con el contrato (alias opcional).
     */
    public function contractInfo()    
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

        /**
     * Configurar opciones de Activity Log.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['concept', 'amount', 'date', 'paytype', 'contract_id', 'ref', 'status'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('Recibos');
    }
}
