<?php

namespace App\Imports;

use App\Models\Buyer;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Validators\Failure;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Throwable;

class BuyersImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure, WithChunkReading
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

        return new Buyer([
            'name' => $row['nombre'],
            'lastnames' => $row['apellidos'],
            'address' => $row['direccion'],
            'phone' => $row['telefono'],
            'email' => $row['email'],
            'dni' => $row['dni']
        ]);
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'direccion' => 'required',
            'telefono' => 'required',
            'email' => 'required|email|max:255',
            'dni' => 'required|string'
        ];
    }

    public function customValidationMessages()
    {
        return [
            'nombre.required' => 'El nombre del cliente es requerido',
            'apellidos.required' => 'Los apellidos del cliente son requerido',
            'direccion.required' => 'La direccion del cliente es requerido',
            'telefono.required' => 'El telefono debe ser válido',
            'email.email' => 'El correo del cliente debe sere valido',
            'dni.required' => 'El precio de venta es requerido',
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
