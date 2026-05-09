<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $ticket = Ticket::orderBy('id', 'desc')->paginate(10);

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
        $query = $request->name;
        //dd($query);
        $items = Ticket::where('id', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
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

        // respesta de JSON
        $response['message'] = "Actualizo exitosamente";
        $response['success'] = true;

        return $response;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        // Eliminar
        Ticket::where('id', $request->id)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
