<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class PermissionController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $property = Property::paginate(10);

        return new JsonResponse($property);
    }



    /**  
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {

        //var_dump($request);
        $property = Property::create(
            [
                "name" => $request->name,
                "description" => $request->description,
                "m2" => $request->m2,
                "address" => $request->address,
                "block_id" => $request->block_id,
                "amount_init" => $request->amount_init,
                "amount_end" => $request->amount_end,
                "status" => $request->status,
            ]
        );

        return response()->json(['data' => $property]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Property $property)
    {
        //

        return new PropertyResource($property);
    }



    public function search(Request $request)
    {
        $query = $request->name;
        //dd($query);
        $items = Property::where('name', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // inserta los datos
        Property::where('id', $request->id)->update([
            "name" => $request->name,
            "description" => $request->description,
            "m2" => $request->m2,
            "address" => $request->address,
            "block_id" => $request->block_id,
            "amount_init" => $request->amount_init,
            "amount_end" => $request->amount_end,
            "status" => $request->status,
        ]);

        // respesta de JSON
        $response['message'] = "Actuacion exitosa";
        $response['success'] = true;

        return $response;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        // Eliminar
        Property::where('id', $request->id)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
