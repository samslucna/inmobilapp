<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $ticket = Ticket::orderBy('id', 'desc')->paginate(5);

        //dd($ticket);
        return new JsonResponse($ticket);
    }



    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {

        //var_dump($request);
        $contract = Ticket::create(
            [
                "concept" => $request->concept,
                "amount" => $request->amount,
                "date" => Carbon::parse($request->date)->format('Y-m-d'),
                "paytype" => $request->paytype,
                // "status" => $request->status,
                // "ref" => $request->ref,
                "contract_id" => $request->contract_id,
            ]
        );

        // Verificar y actualizar el status del contrato después de crear el ticket
        $this->verificUpdateStatus($request->contract_id);


        return response()->json(['data' => $contract]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        //

        return new TicketResource($ticket);
    }



    public function search(Request $request)
    {
        $query = $request->q;
        //dd($query);
        $items = Ticket::find($query);

        return response()->json([$items]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // inserta los datos
        Ticket::where('id', $request->id)->update([

            "concept" => $request->concept,
            "amount" => $request->amount,
            "date" => Carbon::parse($request->date)->format('Y-m-d'),
            "paytype" => $request->paytype,
            //"status" => $request->status,
            // "ref" => $request->ref,
            "contract_id" => $request->contract_id,

        ]);
        // Verificar y actualizar el status del contrato después de actualizar el ticket
        $this->verificUpdateStatus($request->contract_id);
        // respesta de JSON
        $response['message'] = "Actualizo exitosamente";
        $response['success'] = true;

        return $response;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Eliminar
        Ticket::where('id', $id)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }


    protected function verificUpdateStatus($contractId)
    {
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

    protected function verificBalance($contractId)
    {
        // 1. Obtenemos el costo inicial y la suma de los tickets
        $datos = DB::table('contracts as c')
            ->join('properties as p', 'c.property_id', '=', 'p.id')
            ->leftJoin('tickets as t', 'c.id', '=', 't.contract_id')
            ->where('c.id', $contractId)
            ->select(
                'p.amount_init',
                DB::raw('COALESCE(SUM(t.amount), 0) as total_tickets')
            )
            ->groupBy('p.amount_init')
            ->first();

        if ($datos) {
            $saldo = $datos->amount_init - $datos->total_tickets;
            return $saldo;
        }

        return null; // En caso de que no se encuentren datos
    }
}
