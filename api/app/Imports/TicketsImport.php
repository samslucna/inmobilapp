<?php

namespace App\Imports;

use App\Models\Ticket;
use App\Models\Contract;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
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
use Maatwebsite\Excel\Concerns\WithProgressBar;
use Maatwebsite\Excel\Validators\Failure;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Throwable;

class TicketsImport implements 
    ToModel, 
    WithHeadingRow, 
    WithValidation, 
    SkipsOnError, 
    SkipsOnFailure, 
    WithChunkReading,
    WithBatchInserts,
    WithUpserts,
    WithProgressBar
{
    use Importable;

    private $successCount = 0;
    private $errorCount = 0;
    private $errors = [];
    private $successRows = [];
    private $failedRows = [];
    private $contractCache = [];
    private $paytypeCache = [];
    private $processedRows = 0;
    private $totalRows = 0;
    private $receiptNumbers = [];

    public function __construct()
    {
        // Configurar límites para manejar grandes volúmenes
        set_time_limit(3600);
        ini_set('memory_limit', '2G');
        ini_set('max_execution_time', 3600);
        ini_set('max_input_time', 3600);
        
        // Pre-cargar cachés
        $this->loadCache();
        
        // Pre-cargar números de recibo existentes
        $this->loadExistingReceiptNumbers();
    }

    /**
     * Pre-cargar datos en caché
     */
    private function loadCache()
    {
        try {
            // Cargar contratos por ID
            $this->contractCache = Contract::select('id', 'ref')
                ->get()
                ->keyBy('id')
                ->toArray();
            
         
                
            Log::info("Caché cargada:  tipos de pago");
        } catch (\Exception $e) {
            Log::error("Error cargando caché: " . $e->getMessage());
        }
    }

    /**
     * Pre-cargar números de recibo existentes
     */
    private function loadExistingReceiptNumbers()
    {
        try {
            $this->receiptNumbers = Ticket::pluck('receipt_number')
                ->filter()
                ->toArray();
        } catch (\Exception $e) {
            $this->receiptNumbers = [];
        }
    }

    /**
     * Procesar cada fila
     */
    public function model(array $row)
    {
        $this->processedRows++;
        
        try {
            // Validar que el contrato existe
            if (!isset($row['contrato']) || !isset($this->contractCache[$row['contrato']])) {
                throw new \Exception("Contrato con ID '{$row['contrato']}' no encontrado");
            }

            // Validar y convertir fecha
            $fecha = $this->parseDate($row['fecha'] ?? now());
            
            // Obtener o crear tipo de pago
            $paytypeName = $row['pagoen'] ?? 'Efectivo';
            //$paytypeId = $this->getOrCreatePaytype($paytypeName);
            
            // Generar número de recibo único
            $receiptNumber = $this->generateUniqueReceiptNumber();
            
            // Preparar datos del ticket
            $ticketData = [
                //'receipt_number' => $receiptNumber,
                'nticket' => $row['nrecibo'] ?? null,
                'concept' => $this->sanitizeString($row['concepto'] ?? 'Pago de recibo'),
                'amount' => $this->parseAmount($row['cantidad'] ?? 0),
                'date' => $fecha,
                'paytype' => $paytypeName,
                'contract_id' => $row['contrato'],
                'status' => $row['estado'] ?? 'pagado',
                'ref' => $row['ref'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Validar datos antes de insertar
            $this->validateTicketData($ticketData);

            // Crear el ticket
            $ticket = new Ticket($ticketData);
            
            // Guardar el ticket
            $ticket->save();
            
            // Actualizar contadores
            $this->successCount++;
            $this->successRows[] = array_merge($row, [
                'ticket_id' => $ticket->id,
                'receipt_number' => $receiptNumber
            ]);
            
            // Actualizar caché de números de recibo
            $this->receiptNumbers[] = $receiptNumber;

            return $ticket;
            
        } catch (\Exception $e) {
            // Registrar error y lanzar para que sea capturado por onError o onFailure
            $this->errorCount++;
            $this->failedRows[] = [
                'row' => $this->processedRows + 1, // +1 por el encabezado
                'errors' => [$e->getMessage()],
                'values' => $row
            ];
            
            throw $e;
        }
    }

    /**
     * Validar datos del ticket antes de insertar
     */
    private function validateTicketData($data)
    {
        $validator = validator($data, [
            //'receipt_number' => 'required|unique:tickets,receipt_number',
            'concept' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            //'paytype_id' => 'required|exists:paytypes,id',
            'contract_id' => 'required|exists:contracts,id',
            //'status' => 'required|in:pagado,pendiente,cancelado,parcial,vencido',
        ]);

        if ($validator->fails()) {
            throw new \Exception("Datos inválidos: " . $validator->errors()->first());
        }
    }

    /**
     * Obtener o crear tipo de pago
     */
    private function getOrCreatePaytype($name)
    {
        $name = trim($name);
        
        if (isset($this->paytypeCache[$name])) {
            return $this->paytypeCache[$name]['id'];
        }
        
        // Crear nuevo tipo de pago
       // $paytype = Paytype::create([
       //     'name' => $name,
       //     'description' => 'Creado automáticamente durante importación',
       // ]);
        
        //$this->paytypeCache[$name] = $paytype->toArray();
        //
        //return $paytype->id;
    }

    /**
     * Generar número de recibo único
     */
    private function generateUniqueReceiptNumber()
    {
        $prefix = 'REC';
        $date = date('Ymd');
        $maxAttempts = 50;
        $attempts = 0;
        
        do {
            $random = str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT);
            $number = "{$prefix}-{$date}-{$random}";
            $attempts++;
        } while (in_array($number, $this->receiptNumbers) && $attempts < $maxAttempts);
        
        if ($attempts >= $maxAttempts) {
            // Si no se encuentra un número único, usar timestamp
            $number = "{$prefix}-{$date}-" . time() . '-' . rand(100, 999);
        }
        
        return $number;
    }

    /**
     * Parsear fecha desde Excel o string
     */
    private function parseDate($date)
    {
        if (is_numeric($date)) {
            // Fecha de Excel
            try {
                return Carbon::instance(Date::excelToDateTimeObject($date));
            } catch (\Exception $e) {
                Log::warning("Error parseando fecha Excel: " . $e->getMessage());
                return now();
            }
        }
        
        if (is_string($date)) {
            try {
                return Carbon::parse($date);
            } catch (\Exception $e) {
                Log::warning("Error parseando fecha string: " . $e->getMessage());
                return now();
            }
        }
        
        return now();
    }

    /**
     * Parsear monto
     */
    private function parseAmount($amount)
    {
        if (is_string($amount)) {
            // Remover símbolos de moneda y espacios
            $amount = preg_replace('/[^0-9.,]/', '', $amount);
            $amount = str_replace(',', '.', $amount);
        }
        
        return floatval($amount) ?: 0;
    }

    /**
     * Sanitizar string
     */
    private function sanitizeString($string)
    {
        if (empty($string)) return null;
        
        $string = strip_tags($string);
        $string = htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
        $string = trim($string);
        
        return $string ?: null;
    }

    /**
     * Obtener estado válido
     */
    private function getStatus($status)
    {
        $validStatus = ['pagado', 'pendiente', 'cancelado', 'parcial', 'vencido'];
        $status = strtolower(trim($status));
        
        return in_array($status, $validStatus) ? $status : 'pagado';
    }

    /**
     * Reglas de validación
     */
    public function rules(): array
    {
        return [
            'contrato' => 'required|integer|exists:contracts,id',
            'concepto' => 'required|string|max:255',
            'cantidad' => 'required|numeric|min:0|max:999999999.99',
            'fecha' => 'nullable',
            //'pagoen' => 'nullable|string|max:100',
            //'estado' => 'nullable|in:pagado,pendiente,cancelado,parcial,vencido',
            'ref' => 'nullable|string|max:255',
        ];
    }

    /**
     * Mensajes de validación personalizados
     */
    public function customValidationMessages()
    {
        return [
            'contrato.required' => 'El ID del contrato es obligatorio',
            'contrato.exists' => 'El contrato especificado no existe en el sistema',
            'concepto.required' => 'El concepto es obligatorio',
            'concepto.max' => 'El concepto no puede exceder 255 caracteres',
            'cantidad.required' => 'La cantidad es obligatoria',
            'cantidad.numeric' => 'La cantidad debe ser un valor numérico',
            'cantidad.min' => 'La cantidad no puede ser negativa',
            'cantidad.max' => 'La cantidad excede el límite permitido',
            //'estado.in' => 'El estado debe ser: pagado, pendiente, cancelado, parcial o vencido',
            //'pagoen.max' => 'El tipo de pago no puede exceder 100 caracteres',
            'ref.max' => 'La referencia no puede exceder 255 caracteres',
        ];
    }

    /**
     * Manejar errores generales
     */
    public function onError(Throwable $error)
    {
        $this->errorCount++;
        $this->errors[] = [
            'error' => $error->getMessage(),
            'trace' => config('app.debug') ? $error->getTraceAsString() : null
        ];
        
        Log::error("Error general en importación: " . $error->getMessage());
    }

    /**
     * Manejar fallos de validación
     */
    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $this->errorCount++;
            $this->failedRows[] = [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
                'values' => $failure->values()
            ];
            
            Log::warning("Fallo de validación en fila {$failure->row()}: " . implode(', ', $failure->errors()));
        }
    }

    /**
     * Tamaño del chunk para procesamiento
     */
    public function chunkSize(): int
    {
        return 100; // Reducido de 1000 para mejor rendimiento
    }

    /**
     * Tamaño del batch para inserción
     */
    public function batchSize(): int
    {
        return 50; // Tamaño óptimo para inserción masiva
    }

    /**
     * Campos únicos para upsert
     */
    public function uniqueBy()
    {
        return 'receipt_number';
    }

    /**
     * Getters para resultados
     */
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

    public function getProcessedRows(): int
    {
        return $this->processedRows;
    }

    /**
     * Obtener resumen de la importación
     */
    public function getSummary(): array
    {
        return [
            'success_count' => $this->successCount,
            'error_count' => $this->errorCount,
            'processed_rows' => $this->processedRows,
            'errors' => $this->errors,
            'failed_rows' => $this->failedRows
        ];
    }
}