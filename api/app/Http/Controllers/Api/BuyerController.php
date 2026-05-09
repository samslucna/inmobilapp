<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BuyerResource;
use App\Models\Buyer;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class BuyerController extends Controller
{
    

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $perPage = $request->input('per_page', 5);
        $buyers = Buyer::paginate($perPage);


        return response()->json($buyers);
    }



    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {

       
        $buyer = Buyer::create(
            [
                "name" => $request->name,
                "lastnames" => $request->lastnames,
                "address" => $request->address,
                "phone" => $request->phone,
                "dni" => $request->dni,
                "email" => $request->email,
            ]
        );

        return response()->json(['data' => $buyer]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Buyer $buyer)
    {
        //


        return new BuyerResource($buyer);
    }

 

    public function search(Request $request)
    {
        $query = $request->q;
        //dd($query);
        $items = Buyer::where('name', 'LIKE', "%$query%")
            ->paginate(3);
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // inserta los datos
        Buyer::where('id', $request->id)->update([
                "name" => $request->name,
                "lastnames" => $request->lastnames,
                "address" => $request->address,
                "phone" => $request->phone,
                "dni" => $request->dni,
                "email" => $request->email,
            ]);

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
        Buyer::where('id', $id)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
