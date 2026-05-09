<?php

namespace App\Imports;

use App\Models\Buyer;
use App\Models\Property;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Validators\Failure;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Throwable;

class PropertyImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure, WithChunkReading
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

        return new Property([
            'name'    => $row['nombre'],
            'description' => $row['descripcion'],
            'm2' => $row['m2'],
            'address' => $row['direccion'],
            'block_id' => $row['manzana'],
            'amount_init' => $row['precio_inicial'],
            'amount_end' => $row['precio_final'],
            'status' => $row['status'],
        ]);
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string|max:255',
            'm2' => 'required|numeric|min:0',
            'direccion' => 'required',
            'manzana' => 'required|numeric|max:255',
            'precio_inicial' => 'required|numeric|min:0',
            'precio_final' => 'required|numeric|min:0',
            'status' => 'required|string|max:100',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'nombre.required' => 'El nombre del cliente es requerido',
            'descripcion.required' => 'La descripcion del cliente es requerido',
            'm2.required' => 'El m2 del cliente es requerido',
            'direccion.required' => 'La direccion del cliente es requerido',
            'manzana.required' => 'La manzana del cliente es requerido',
            'precio_inicial.required' => 'El precio inicial del cliente es requerido',
            'precio_final.required' => 'El precio final del cliente es requerido',
            'status.required' => 'El status del cliente es requerido',
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
