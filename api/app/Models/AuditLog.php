<?php

namespace App\Models;

use Spatie\Activitylog\Models\Activity;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Activity
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'log_name',
        'description',
        'subject_id',
        'subject_type',
        'causer_id',
        'causer_type',
        'properties',
        'event',
        'batch_uuid',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'properties' => 'collection',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that caused the activity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'causer_id');
    }

    /**
     * Get formatted changes as array (método con nombre diferente).
     */
    public function getFormattedChangesAttribute(): array
    {
        $properties = $this->properties ?? collect();
        
        return [
            'old' => $properties->get('old', []),
            'new' => $properties->get('attributes', []),
        ];
    }

    /**
     * Get human readable event name.
     */
    public function getEventNameAttribute(): string
    {
        return match($this->event) {
            'created' => 'Creación',
            'updated' => 'Actualización',
            'deleted' => 'Eliminación',
            'restored' => 'Restauración',
            'login' => 'Inicio de sesión',
            'logout' => 'Cierre de sesión',
            default => ucfirst($this->event),
        };
    }

    /**
     * Get badge color for event.
     */
    public function getEventBadgeColorAttribute(): string
    {
        return match($this->event) {
            'created' => 'success',
            'updated' => 'info',
            'deleted' => 'error',
            'restored' => 'warning',
            'login' => 'primary',
            'logout' => 'secondary',
            default => 'default',
        };
    }

    /**
     * Get readable subject type.
     */
    public function getSubjectTypeNameAttribute(): string
    {
        if (!$this->subject_type) {
            return 'N/A';
        }

        $parts = explode('\\', $this->subject_type);
        return end($parts);
    }

    /**
     * Get record identifier (name, title, email, or id).
     */
    public function getRecordIdentifierAttribute(): string
    {
        if (!$this->subject) {
            return (string) $this->subject_id;
        }

        // Intentar obtener un nombre legible
        if (isset($this->subject->name)) {
            return $this->subject->name;
        }
        
        if (isset($this->subject->title)) {
            return $this->subject->title;
        }
        
        if (isset($this->subject->email)) {
            return $this->subject->email;
        }

        return (string) $this->subject_id;
    }

    /**
     * Scope for date range.
     */
    public function scopeOfDateRange($query, $start, $end)
    {
        return $query->whereBetween('created_at', [$start, $end]);
    }

    /**
     * Scope for event type.
     */
    public function scopeOfEvent($query, $event)
    {
        return $query->where('event', $event);
    }

    /**
     * Scope for module (log_name).
     */
    public function scopeOfModule($query, $module)
    {
        return $query->where('log_name', $module);
    }

    /**
     * Scope for subject type.
     */
    public function scopeOfSubjectType($query, string $subjectType)
    {
        return $query->where('subject_type', $subjectType);
    }

    /**
     * Scope for user (causer).
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('causer_id', $userId);
    }
}