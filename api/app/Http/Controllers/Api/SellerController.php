<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SellerResource;
use App\Models\Seller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $seller = Seller::paginate(10);

        return new JsonResponse($seller);
    }



    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {

        //var_dump($request);
        $seller = Seller::create(
            [
                "name" => $request->name,
                "lastnames" => $request->lastnames,
                "address" => $request->address,
                "phone" => $request->phone,
                "dni" => $request->dni,
                "email" => $request->email,
            ]
        );

        return response()->json(['data' => $seller]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Seller $seller)
    {
        //

        return new SellerResource($seller);
    }



    public function search(Request $request)
    {
        $query = $request->q;
        
        $items = Seller::where('name', 'LIKE', "%$query%")
            ->get();
        
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        //dd($request);
        // inserta los datos
        $data = Seller::where('id', $request->id)->update([
            "name" => $request->name,
            "lastnames" => $request->lastnames,
            "address" => $request->address,
            "phone" => $request->phone,
            "dni" => $request->dni,
            "email" => $request->email,
        ]);

        // respesta de JSON
        $response['data'] = $data;
        $response['message'] = "Actualizo exitosamente";
        $response['success'] = true;

        return $response;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //dd($id);
         $deleted = Seller::where('id',$id)->delete();

        // respesta de JSON
        $response['eliminado'] = $deleted;
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
