<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Boundary;
use App\Models\Property;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class PropertyController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $property = Property::with('boundaries')->paginate(5);

        return new JsonResponse($property);
    }


    public function boundariesByProperty($id)
    {
        //dd($id);
        $boundaries = Boundary::where('property_id', $id)->get();

        return response()->json($boundaries);
    }

    /**  
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {

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


        if ($property->id != null) {

            if (count($request->boundaries) != 0) {
                foreach ($request->boundaries as $item) {
                    Boundary::create([
                        "name" => $item['name'],
                        "description" => $item['description'],
                        "m2" => $item['m2'],
                        "property_id" => $property->id,
                    ]);
                }
            }
        }

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
        $query = $request->q;
        //dd($query);
        $items = Property::with('boundaries')->where('id', '=', $query)
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
    public function destroy($q)
    {
        // Eliminar
        Property::where('id', $q)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
