<?php

namespace App\Imports;

use App\Models\Block;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithUpserts;
use Maatwebsite\Excel\Validators\Failure;
use Throwable;

class BlocksImport implements
    ToModel,
    WithHeadingRow,
    WithValidation,
    SkipsOnError,
    SkipsOnFailure,
    WithChunkReading,
    WithBatchInserts,
    WithUpserts
{
    use Importable;

    private $successCount = 0;
    private $errorCount = 0;
    private $errors = [];
    private $failedRows = [];
    private $successRows = []; // ✅ Declarada adecuadamente

    /**
     * Crear el objeto del modelo por cada fila.
     * NOTA: NO llamar a $block->save() aquí. Laravel Excel se encarga
     * de guardarlo en lotes (batch) y aplicar el Upsert automáticamente.
     */
    public function model(array $row)
    {
        $this->successCount++;

        $name = $this->sanitizeString((string) ($row['nombre'] ?? null));
        $description = $this->sanitizeString((string) ($row['descripcion'] ?? null));
        $stageId = (int) ($row['etapa'] ?? 0);

        $this->successRows[] = [
            'name'        => $name,
            'description' => $description,
            'stage_id'    => $stageId,
        ];

        // Retornamos la instancia SIN ejecutar ->save()
        return new Block([
            'name'        => $name,
            'description' => $description,
            'stage_id'    => $stageId,
        ]);
    }

    /**
     * Reglas de validación para las columnas del Excel
     */
    public function rules(): array
    {
        return [
          
            'descripcion' => 'nullable|string|max:255',
            'etapa'       => 'required|integer|exists:stages,id',
        ];
    }

    /**
     * Mensajes de validación personalizados
     */
    public function customValidationMessages()
    {
        return [
        
            'etapa.required'    => 'El ID de la etapa es obligatorio.',
            'etapa.integer'     => 'El ID de la etapa debe ser un número entero.',
            'etapa.exists'      => 'La etapa especificada no existe en la base de datos.',
            'descripcion.max'   => 'La descripción no puede exceder 255 caracteres.',
        ];
    }

    /**
     * Manejo de errores fatales o excepciones de base de datos
     */
    public function onError(Throwable $error)
    {
        $this->errorCount++;
        $this->errors[] = [
            'error' => $error->getMessage()
        ];

        Log::error("Error en importación de Manzanas: " . $error->getMessage());
    }

    /**
     * Manejo de fallos de validación
     */
    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $this->errorCount++;
            $this->failedRows[] = [
                'row'       => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors'    => $failure->errors(),
                'values'    => $failure->values()
            ];

            Log::warning("Fallo de validación en fila {$failure->row()}: " . implode(', ', $failure->errors()));
        }
    }

    /**
     * Sanitizado de texto
     */
    private function sanitizeString($string)
    {
        if (empty($string)) return null;
        return trim(strip_tags($string)) ?: null;
    }

    /**
     * Evita duplicar manzanas con el mismo nombre dentro de la misma etapa (Upsert)
     * Requiere que exista un índice compuesto en la migración de la BD:
     * $table->unique(['name', 'stage_id']);
     */
    public function uniqueBy()
    {
        return ['name', 'stage_id'];
    }

    public function chunkSize(): int
    {
        return 200;
    }

    public function batchSize(): int
    {
        return 200;
    }

    // --- Getters para reporte al controlador ---

    public function getSuccessCount(): int
    {
        return $this->successCount;
    }

    public function getErrorCount(): int
    {
        return $this->errorCount;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getFailedRows(): array
    {
        return $this->failedRows;
    }

    public function getSuccessRows(): array
    {
        return $this->successRows;
    }
}