<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Log;

class AuditLogService
{
    /**
     * Log a manual activity.
     */
    public static function log(
        string $description,
        string $event,
        string $logName = 'default',
        array $properties = [],
        $subject = null,
        string $severity = 'info'
    ): ?Activity {
        try {
            // Método universal: pasar el log name como parámetro a activity()
            $activity = activity($logName);
            
            // Agregar el causante (usuario autenticado)
            if (Auth::check()) {
                $activity->causedBy(Auth::user());
            }
            
            // Agregar propiedades
            $activity->withProperties(array_merge($properties, [
                'severity' => $severity,
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]));
            
            // Agregar evento
            $activity->event($event);
            
            // Agregar sujeto (modelo afectado)
            if ($subject) {
                $activity->performedOn($subject);
            }
            
            // Finalmente, registrar el log
            return $activity->log($description);
            
        } catch (\Exception $e) {
            // No permitir que un error en el log detenga la aplicación
            Log::error('Failed to log activity: ' . $e->getMessage(), [
                'description' => $description,
                'event' => $event,
                'logName' => $logName,
            ]);
            return null;
        }
    }

    /**
     * Log user login.
     */
    public static function logLogin($user): void
    {
        self::log(
            description: "Usuario {$user->name} inició sesión",
            event: 'login',
            logName: 'auth',
            properties: [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ],
            subject: $user
        );
    }

    /**
     * Log user logout.
     */
    public static function logLogout($user): void
    {
        if (!$user) return;
        
        self::log(
            description: "Usuario {$user->name} cerró sesión",
            event: 'logout',
            logName: 'auth',
            properties: [
                'user_id' => $user->id,
                'user_email' => $user->email,
            ],
            subject: $user
        );
    }

    /**
     * Log access denied.
     */
    public static function logAccessDenied($user, string $permission): void
    {
        self::log(
            description: "Acceso denegado - Permiso: {$permission}",
            event: 'access_denied',
            logName: 'security',
            properties: [
                'user_id' => $user?->id,
                'user_email' => $user?->email,
                'permission' => $permission,
                'url' => request()->fullUrl(),
                'ip' => request()->ip(),
            ],
            subject: $user,
            severity: 'warning'
        );
    }

    /**
     * Log export action.
     */
    public static function logExport(string $module, int $count, array $filters = []): void
    {
        self::log(
            description: "Exportación de {$module}: {$count} registros",
            event: 'export',
            logName: 'exports',
            properties: [
                'module' => $module,
                'count' => $count,
                'filters' => $filters,
                'ip' => request()->ip(),
            ],
            severity: 'info'
        );
    }

    /**
     * Log error.
     * 🔧 MÉTODO AGREGADO - Registra errores del sistema
     */
    public static function logError(string $error, string $module, array $context = []): void
    {
        self::log(
            description: $error,
            event: 'error',
            logName: 'errors',
            properties: [
                'module' => $module,
                'context' => $context,
                'ip' => request()->ip(),
                'user_id' => Auth::id(),
            ],
            severity: 'error'
        );
    }

    /**
     * Log warning.
     */
    public static function logWarning(string $warning, string $module, array $context = []): void
    {
        self::log(
            description: $warning,
            event: 'warning',
            logName: 'warnings',
            properties: [
                'module' => $module,
                'context' => $context,
                'ip' => request()->ip(),
            ],
            severity: 'warning'
        );
    }

    /**
     * Log info message.
     */
    public static function logInfo(string $message, string $module, array $context = []): void
    {
        self::log(
            description: $message,
            event: 'info',
            logName: 'info',
            properties: [
                'module' => $module,
                'context' => $context,
            ],
            severity: 'info'
        );
    }

    /**
     * Log create action for a model.
     */
    public static function logCreate($model, string $module, ?string $description = null): void
    {
        self::log(
            description: $description ?? "Se creó un nuevo registro en {$module}",
            event: 'created',
            logName: $module,
            properties: [
                'model_id' => $model->id,
                'model_data' => $model->toArray(),
            ],
            subject: $model
        );
    }

    /**
     * Log update action for a model.
     */
    public static function logUpdate($model, string $module, ?array $oldValues = null, ?string $description = null): void
    {
        $changes = $oldValues ?? $model->getOriginal();
        $newValues = $model->getChanges();
        
        if (empty($newValues)) {
            return;
        }
        
        self::log(
            description: $description ?? "Se actualizó un registro en {$module}",
            event: 'updated',
            logName: $module,
            properties: [
                'model_id' => $model->id,
                'old_values' => $changes,
                'new_values' => $newValues,
            ],
            subject: $model,
            severity: 'warning'
        );
    }

    /**
     * Log delete action for a model.
     */
    public static function logDelete($model, string $module, ?string $description = null): void
    {
        self::log(
            description: $description ?? "Se eliminó un registro en {$module}",
            event: 'deleted',
            logName: $module,
            properties: [
                'model_id' => $model->id,
                'model_data' => $model->toArray(),
            ],
            subject: $model,
            severity: 'warning'
        );
    }

    /**
     * Log custom action with severity.
     */
    public static function logCustom(
        string $description,
        string $event,
        string $module,
        array $properties = [],
        $subject = null,
        string $severity = 'info'
    ): ?Activity {
        return self::log(
            description: $description,
            event: $event,
            logName: $module,
            properties: $properties,
            subject: $subject,
            severity: $severity
        );
    }
}