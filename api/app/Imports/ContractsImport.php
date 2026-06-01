<?php

namespace App\Imports;


use App\Models\Contract;
use App\Models\Property;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
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

        $property = Property::where('id', $row['lote'])->first();
        $row['fechacontrato'] = Carbon::instance(Date::excelToDateTimeObject($row['fechacontrato']));

        $contract =  new Contract([
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

        // Guardar el contrato para obtener su ID
        $contract->save();

        // Crear el recibo (Ticket) por el monto del enganche
        $this->crearReciboEnganche($contract, $row);

        // Actualizar etapa
        //if (isset($row['status']) && !empty($row['status'])) {
        //    if ($property && $property->status === 'disponible') {
        //        $property->update(['status' => 'apartado']);
        //    } else {
        //        $property->update(['status' => 'disponible']);
        //    }
        //}
        // Registrar éxito
        $this->successCount++;
        $this->successRows[] = array_merge($row, ['contract_id' => $contract->id]);

        return $contract;
    }



    /**
     * Crear el recibo asociado al enganche del contrato
     */
    protected function crearReciboEnganche($contract, array $row)
    {


        // Generar número de recibo único (puedes personalizarlo)
        $numeroRecibo = $this->generarNumeroRecibo();

        // Crear el ticket/recibo
        $ticket = new Ticket([
            'receipt_number' => $numeroRecibo, // Número de recibo
            'concept' => 'Enganche - Contrato #: ' . ($contract['id'] ?? 'N/A'),
            'amount' => $row['enganche'],
            'date' => $row['fechacontrato'],
            'paytype' => $contract['paytype'],
            'contract_id' => $contract['id'],
            //'status' => 'pagado',
            'description' => 'Enganche inicial para el contrato con referencia ' . ($row['ref'] ?? '')
        ]);

        $ticket->save();

        $this->verificUpdateStatus($contract['id']);

         // Registrar éxito
         $this->successCount++;
         $this->successRows[] = array_merge($row, ['contract_id' => $contract->id, 'ticket_id' => $ticket->id]);

        return $ticket;
    }

     protected function verificUpdateStatus($contractId)
    {
        //dd($contractId);
        // 1. Obtenemos el costo inicial y la suma de los tickets
        $datos = DB::table('contracts as c')
            ->join('properties as p', 'c.property_id', '=', 'p.id')
            ->leftJoin('tickets as t', 'c.id', '=', 't.contract_id')
            ->where('c.id', $contractId)
            ->select(
                'p.id as property_id',
                'p.amount_init',
                DB::raw('COALESCE(SUM(t.amount), 0) as total_tickets')
            )
            ->groupBy('p.id', 'p.amount_init')
            ->first();

        if ($datos) {
            $saldo = $datos->amount_init - $datos->total_tickets;

            // 2. Si el saldo es menor o igual a 0, actualizamos el status físico
            if ($saldo <= 0) {
                DB::table('properties')
                    ->where('id', $datos->property_id)
                    ->update(['status' => 'vendido']);
            } else {
                // Si eliminaron tickets y el saldo volvió a ser positivo, regresa a vendido
                DB::table('properties')
                    ->where('id', $datos->property_id)
                    ->update(['status' => 'apartado']);
            }
        }
    }


    /**
     * Generar número de recibo único
     */
    protected function generarNumeroRecibo()
    {
        $ultimoTicket = Ticket::orderBy('id', 'desc')->first();
        $numero = $ultimoTicket ? intval(substr($ultimoTicket->receipt_number, -6)) + 1 : 1;

        return 'REC-' . date('Ymd') . '-' . str_pad($numero, 6, '0', STR_PAD_LEFT);
    }

    public function rules(): array
    {
        return [
            'cliente' => 'required|numeric|max:255',
            'propietario' => 'required|numeric|max:255',
            'agente' => 'required|numeric|max:255',
            'lote' => 'required|numeric|max:255',
            'fechacontrato' => 'required',
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
            'fechacontrato.required' => 'Es necesatrio agregar una fecha',
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
