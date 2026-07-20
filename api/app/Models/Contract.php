<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Contract extends Model
{
    use HasFactory, LogsActivity;

    /**
     * The table associated with the model.
     */
    protected $table = 'contracts';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'buyer_id',
        'seller_id',
        'agent_id',
        'property_id',
        'plazo',
        'advance',
        'paytype',
        'ref',
        'status',
        'date',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'date' => 'date',
        'advance' => 'decimal:2',
        'plazo' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    /**
     * Get the buyer associated with the contract.
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(Buyer::class, 'buyer_id');
    }

    /**
     * Get the seller associated with the contract.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    /**
     * Get the agent associated with the contract.
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    /**
     * Get the property associated with the contract.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class, 'property_id');
    }

    /**
     * Get the tickets associated with the contract.
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'contract_id');
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeDateBetween($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Scope a query to filter by paytype.
     */
    public function scopeByPaytype($query, $paytype)
    {
        return $query->where('paytype', $paytype);
    }

    /**
     * Get the total paid amount from tickets.
     */
    public function getTotalPaidAttribute(): float
    {
        return $this->tickets->sum('amount');
    }

    /**
     * Get the remaining balance.
     */
    public function getBalanceAttribute(): float
    {
        $propertyValue = $this->property->amount_init ?? 0;
        $totalPaid = $this->total_paid;
        return $propertyValue - $totalPaid;
    }

    /**
     * Get the client full name.
     */
    public function getClientNameAttribute(): string
    {
        $buyer = $this->buyer;
        if (!$buyer) return 'N/A';
        return trim($buyer->name . ' ' . ($buyer->lastnames ?? ''));
    }

    /**
     * Get the property title.
     */
    public function getPropertyTitleAttribute(): string
    {
        return $this->property->title ?? 'N/A';
    }

    /**
     * Get the property value.
     */
    public function getPropertyValueAttribute(): float
    {
        return $this->property->amount_init ?? 0;
    }

    /**
     * Get formatted date.
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->date ? $this->date->format('d/m/Y') : 'N/A';
    }

    /**
     * Get human readable status.
     */
    public function getStatusTextAttribute(): string
    {
        $statuses = [
            'pendiente' => 'Pendiente',
            'activo' => 'Activo',
            'completado' => 'Completado',
            'cancelado' => 'Cancelado',
        ];
        
        return $statuses[$this->status] ?? ucfirst($this->status);
    }

    /**
     * Get badge color for status.
     */
    public function getStatusColorAttribute(): string
    {
        $colors = [
            'pendiente' => 'warning',
            'activo' => 'success',
            'completado' => 'info',
            'cancelado' => 'error',
        ];
        
        return $colors[$this->status] ?? 'default';
    }

    /**
     * Get human readable paytype.
     */
    public function getPaytypeTextAttribute(): string
    {
        $paytypes = [
            'Contado' => 'Contado',
            'Crédito' => 'Crédito',
            'Financiamiento' => 'Financiamiento',
        ];
        
        return $paytypes[$this->paytype] ?? $this->paytype;
    }

    /**
     * Configure Activity Log options.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['buyer_id', 'seller_id', 'agent_id', 'property_id', 'plazo', 'advance', 'paytype', 'ref', 'status', 'date'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('contratos')
            ->setDescriptionForEvent(function(string $eventName) {
                $descriptions = [
                    'created' => 'Se creó un nuevo contrato',
                    'updated' => 'Se actualizó un contrato',
                    'deleted' => 'Se eliminó un contrato',
                ];
                
                return $descriptions[$eventName] ?? "Contrato {$eventName}";
            });
    }
}