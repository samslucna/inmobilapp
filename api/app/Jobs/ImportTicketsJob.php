<?php

namespace App\Jobs;

use App\Imports\TicketsImport;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class ImportTicketsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Tiempo máximo de ejecución (1 hora)
     */
    public $timeout = 3600;

    /**
     * Número de intentos máximos
     */
    public $tries = 3;

    /**
     * Tiempo entre reintentos (10 minutos)
     */
    public $backoff = 600;

    /**
     * Ruta del archivo a importar
     */
    protected $filePath;

    /**
     * ID del usuario que inició la importación
     */
    protected $userId;

    /**
     * ID único del job para seguimiento
     */
    protected $jobId;

    /**
     * Estado de la importación
     */
    protected $status;

    /**
     * Create a new job instance.
     */
    public function __construct(string $filePath, ?int $userId = null)
    {
        $this->filePath = $filePath;
        $this->userId = $userId ?? auth()->id();
        $this->jobId = uniqid('import_tickets_');
        $this->status = 'pending';
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Actualizar estado inicial
        $this->updateStatus([
            'status' => 'processing',
            'progress' => 0,
            'message' => 'Iniciando importación de tickets...',
            'started_at' => now()->toDateTimeString(),
        ]);

        try {
            // Configurar límites para el proceso
            $this->setServerLimits();

            // Verificar que el archivo existe
            if (!Storage::exists($this->filePath)) {
                throw new \Exception("El archivo no existe en la ruta: {$this->filePath}");
            }

            // Obtener información del archivo
            $fileInfo = $this->getFileInfo();

            // Actualizar progreso
            $this->updateStatus([
                'progress' => 5,
                'message' => 'Archivo validado correctamente',
                'file_info' => $fileInfo
            ]);

            // Crear instancia de importación
            $import = new TicketsImport();

            // Importar el archivo con configuración optimizada
            Excel::import(
                $import,
                Storage::path($this->filePath),
                null,
                \Maatwebsite\Excel\Excel::XLSX
            );

            // Obtener resultados
            $summary = $import->getSummary();

            // Marcar como completado
            $this->updateStatus([
                'status' => 'completed',
                'progress' => 100,
                'message' => 'Importación completada exitosamente',
                'completed_at' => now()->toDateTimeString(),
                'results' => [
                    'success_count' => $import->getSuccessCount(),
                    'error_count' => $import->getErrorCount(),
                    'processed_rows' => $import->getProcessedRows(),
                    'success_rows' => $import->getSuccessRows(),
                    'failed_rows' => $import->getFailedRows(),
                    'errors' => $import->getErrors(),
                ]
            ]);

            // Limpiar archivo temporal
            $this->cleanupFile();

            // Notificar al usuario (opcional)
            $this->notifyUser($import);

            Log::info("Job de importación completado: {$this->jobId}", [
                'success_count' => $import->getSuccessCount(),
                'error_count' => $import->getErrorCount(),
            ]);

        } catch (\Exception $e) {
            // Manejar error
            $this->handleError($e);
        }
    }

    /**
     * Configurar límites del servidor
     */
    private function setServerLimits(): void
    {
        set_time_limit(3600);
        ini_set('memory_limit', '2G');
        ini_set('max_execution_time', 3600);
        ini_set('max_input_time', 3600);
        ini_set('upload_max_filesize', '2G');
        ini_set('post_max_size', '2G');
    }

    /**
     * Obtener información del archivo
     */
    private function getFileInfo(): array
    {
        $path = Storage::path($this->filePath);
        
        return [
            'name' => basename($this->filePath),
            'size' => Storage::size($this->filePath),
            'size_human' => $this->formatSizeUnits(Storage::size($this->filePath)),
            'extension' => pathinfo($this->filePath, PATHINFO_EXTENSION),
            'modified' => Storage::lastModified($this->filePath),
        ];
    }

    /**
     * Formatear tamaño de archivo
     */
    private function formatSizeUnits($bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } elseif ($bytes > 1) {
            return $bytes . ' bytes';
        } elseif ($bytes == 1) {
            return '1 byte';
        } else {
            return '0 bytes';
        }
    }

    /**
     * Actualizar estado del job en caché
     */
    private function updateStatus(array $data): void
    {
        $current = Cache::get("import_tickets_status_{$this->jobId}", []);
        
        Cache::put(
            "import_tickets_status_{$this->jobId}",
            array_merge($current, $data, ['updated_at' => now()->toDateTimeString()]),
            now()->addHours(24)
        );
    }

    /**
     * Manejar errores
     */
    private function handleError(\Exception $e): void
    {
        $errorMessage = $e->getMessage();
        $errorTrace = config('app.debug') ? $e->getTraceAsString() : null;

        Log::error("Error en importación {$this->jobId}: " . $errorMessage, [
            'trace' => $errorTrace,
            'file' => $this->filePath,
        ]);

        $this->updateStatus([
            'status' => 'failed',
            'message' => 'Error: ' . $errorMessage,
            'error' => $errorMessage,
            'error_trace' => $errorTrace,
            'failed_at' => now()->toDateTimeString(),
        ]);

        // Limpiar archivo aunque haya error
        $this->cleanupFile();

        // Re-lanzar excepción para que el job se marque como fallido
        throw $e;
    }

    /**
     * Limpiar archivo temporal
     */
    private function cleanupFile(): void
    {
        try {
            if (Storage::exists($this->filePath)) {
                Storage::delete($this->filePath);
                Log::info("Archivo temporal eliminado: {$this->filePath}");
            }
        } catch (\Exception $e) {
            Log::warning("Error al eliminar archivo temporal: " . $e->getMessage());
        }
    }

    /**
     * Notificar al usuario (opcional)
     */
    private function notifyUser($import): void
    {
        try {
            $user = User::find($this->userId);
            if ($user) {
                // Aquí puedes enviar notificación por email, SMS, etc.
                // Ejemplo con notificación de Laravel:
                // $user->notify(new ImportCompleted($import->getSummary()));
                
                Log::info("Notificación enviada al usuario: {$user->email}");
            }
        } catch (\Exception $e) {
            Log::warning("Error al notificar usuario: " . $e->getMessage());
        }
    }

    /**
     * Middleware para evitar ejecuciones simultáneas del mismo archivo
     */
    public function middleware(): array
    {
        return [
            (new WithoutOverlapping($this->filePath))
                ->expireAfter(3600) // 1 hora
                ->releaseAfter(60)   // 1 minuto
        ];
    }

    /**
     * Manejar fallo del job
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Job de importación falló: {$this->jobId}", [
            'exception' => $exception->getMessage(),
            'file' => $this->filePath,
        ]);

        $this->updateStatus([
            'status' => 'failed',
            'message' => 'El job falló: ' . $exception->getMessage(),
            'failed_at' => now()->toDateTimeString(),
        ]);

        $this->cleanupFile();
    }

    /**
     * Obtener el ID del job
     */
    public function getJobId(): string
    {
        return $this->jobId;
    }

    /**
     * Obtener el estado actual
     */
    public function getStatus(): ?array
    {
        return Cache::get("import_tickets_status_{$this->jobId}");
    }
}