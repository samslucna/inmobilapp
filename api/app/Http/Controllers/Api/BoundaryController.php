<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Boundary;
use App\Models\Contract;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BoundaryController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $boundary = Boundary::orderBy('id', 'desc')->paginate(10);

        return new JsonResponse($boundary);
    }



    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {

        $boundary = Boundary::create(
            [
                "property_id" => $request->property_id,
                "name" => $request->name,
                "description" => $request->description,
                "m2" => $request->m2,
            ]
        );

        return response()->json(['data' => $boundary]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $req)
    {
        //
        $boundary = Boundary::with('property')->with('buyer')->find($req->id);
        $tickets = Ticket::where('contract_id', $req->id)->get();
        //var_dump($tickets);

        $totalTickets = $this->total($tickets, 'contract_id');

        return response()->json([
            'contract' => $boundary,
            'tickets' => $tickets,
            'totalTickets' => $totalTickets + $boundary['partamount'],
        ]);
    }



    public function search(Request $request)
    {
        $query = $request->name;
        //dd($query);
        $items = Boundary::with('buyer')->with('property')->with('tickets')->where('id', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // inserta los datos
try {
        //dd($request->property_id);
        Boundary::where('id', $request->id)->update([
            "property_id" => $request->property_id,
            "name" => $request->name,
            "description" => $request->description,
            "m2" => $request->m2,
        ]);

        // respesta de JSON
        $response['message'] = "Actualizo exitosamente";
        $response['success'] = true;

        return $response;
} catch (\Throwable $th) {
    return $response['message']='Algo salio mal';
}
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Eliminar
        Boundary::where('id', $id)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }




    public function total($listData)
    {


        $total = 0;
        foreach ($listData as $nameKey) {
            $total += $nameKey->amount;
        }
        //var_dump($total);
        return $total;
    }
}
