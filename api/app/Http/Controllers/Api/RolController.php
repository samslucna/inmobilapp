<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Resources\RolResource;
use App\Models\Rol;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RolController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $Rol = Rol::paginate(10);

        return new JsonResponse($Rol);
    }



    /**  
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {

        //var_dump($request);
        $Rol = Rol::create(
            [
                "name" => $request->name,
                "description" => $request->description,
        
            ]
        );

        return response()->json(['data' => $Rol]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Rol $Rol)
    {
        //

        return new RolResource($Rol);
    }



    public function search(Request $request)
    {
        $query = $request->name;
        //dd($query);
        $items = Rol::where('name', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // inserta los datos
        Rol::where('id', $request->id)->update([
            "name" => $request->name,
            "description" => $request->description,
       
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
        Rol::where('id', $request->id)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
