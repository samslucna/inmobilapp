<?php

namespace App\Imports;


use App\Models\Contract;

use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Validators\Failure;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Throwable;

class ContractImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure, WithChunkReading
{

    use Importable;

    private $successCount = 0;
    private $errorCount = 0;
    private $errors = [];
    private $successRows = [];


    public function model(array $row)
    {
        $this->successCount++;
        $this->successRows[] = $row;

        return new Contract([
            "date" => $row['date'],
            "buyer_id" => $row['cliente_id'],
            "seller_id" => $row['dueño_id'],
            "agent_id" => $row['agente_id'],
            "property_id" => $row['lote_id'],
            "plazo" => $row['plazo'],
            "advance" => $row['advance'],
            "paytype" => $row['paytype'],
            "ref" => $row['ref'],
        ]);
    }

    public function rules(): array
    {
        return [
            'cliente_id' => 'required|numeric|max:255',
            'seller_id' => 'required|numeric|max:255',
            'agent_id' => 'required|numeric|max:255',
            'property_id' => 'required|numeric|max:255',
            'date' => 'required|numeric|max:255',
            'ref' => 'required|string|max:255',
            'advance' => 'required|numeric|min:0',
            'paytype' => 'required|string|max:100',
            'plazo' => 'required|numeric|max:255',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'cliente_id.required' => 'Error referencia cliente',
            'seller_id.required' => 'Error referencia dueño/propietario',
            'agent_id.required' => 'Error referencia agente',
            'property_id.required' => 'Error de referencia lote/propiedad',
            'date.required' => 'Es necesatrio agregar una fecha',
            'ref.required' => 'Error al almacenar referencia',
            'advance.required' => 'Es necesatrio agregar un anticipo',
            'paytype.required' => 'Es nesesario seleccionar una forma de pago',
            'plazo.required' => 'Es nesesario seleccionar un plazo',
        ];
    }


    public function onError(Throwable $error)
    {
        $this->errorCount++;
        $this->errors[] = [
            'error' => $error->getMessage()
        ];
    }


    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $this->errorCount++;
            $this->errors[] = [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
                'values' => $failure->values()
            ];
        }
    }


    public function chunkSize(): int
    {
        return 1000;
    }

    public function getSuccessCount()
    {
        return $this->successCount;
    }

    public function getErrorCount()
    {
        return $this->errorCount;
    }

    public function getErrors()
    {
        return $this->errors;
    }


    public function getSuccessRows()
    {
        return $this->successRows;
    }
}
