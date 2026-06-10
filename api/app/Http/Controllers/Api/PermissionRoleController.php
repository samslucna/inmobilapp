<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Resources\PermissionResource;
use App\Models\PermissionRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionRoleController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $Permission = PermissionRole::paginate(5);

        return new JsonResponse($Permission);
    }



    /**  
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {

        //var_dump($request);
        $Permission = PermissionRole::create(
            [
                "permision_id" => $request->permision_id,
                "role_id" => $request->rol_id,
            ]
        );

        return response()->json(['data' => $Permission]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PermissionRole $Permission)
    {
        //

        return new PermissionResource($Permission);
    }



    public function search(Request $request)
    {
        $query = $request->name;
        //dd($query);
        $items = PermissionRole::where('name', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // inserta los datos
        PermissionRole::where('id', $request->id)->update([
            "permision_id" => $request->permision_id,
            "role_id" => $request->rol_id,
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
        PermissionRole::where('id', $q)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
