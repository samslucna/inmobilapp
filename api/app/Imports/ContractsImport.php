<?php

namespace App\Imports;


use App\Models\Contract;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Validators\Failure;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Throwable;

class ContractsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure, WithChunkReading
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

        $row['fechacontrato'] = Carbon::instance(Date::excelToDateTimeObject($row['fechacontrato']));

      
        return new Contract([
            
            "buyer_id" => $row['cliente'],
            "seller_id" => $row['propietario'],
            "agent_id" => $row['agente'],
            "property_id" => $row['lote'],
            "plazo" => $row['plazo'],
            "advance" => $row['enganche'],
            "paytype" => $row['tipo_pago'],
            "ref" => $row['ref'],
            "status" => $row['status'],
            "date" => $row['fechacontrato'],
            
        ]);
    }

    public function rules(): array
    {
        return [
            'cliente' => 'required|numeric|max:255',
            'propietario' => 'required|numeric|max:255',
            'agente' => 'required|numeric|max:255',
            'lote' => 'required|numeric|max:255',
            //'fechacontrato' => 'required|numeric|max:255',
            'ref' => 'required|string|max:255',
            'enganche' => 'required|numeric|min:0',
            'tipo_pago' => 'required|string|max:100',
            'plazo' => 'required|numeric|max:255',
            'status' => 'required|string|max:100'
        ];
    }

    public function customValidationMessages()
    {
        return [
            'cliente.required' => 'Error referencia cliente',
            'propietario.required' => 'Error referencia dueño/propietario',
            'agente.required' => 'Error referencia agente',
            'lote.required' => 'Error de referencia lote/propiedad',
            //'fechacontrato.required' => 'Es necesatrio agregar una fecha',
            'ref.required' => 'Error al almacenar referencia',
            'enganche.required' => 'Es necesatrio agregar un anticipo',
            'tipo_pago.required' => 'Es nesesario seleccionar una forma de pago',
            'plazo.required' => 'Es nesesario seleccionar un plazo',
            'status.required' => 'Es nesesario seleccionar un estado',
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
