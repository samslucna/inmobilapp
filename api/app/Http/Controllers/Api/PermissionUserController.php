<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Resources\PermissionUserResource;
use App\Models\PermissionUser; 
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class PermissionUserController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $PermissionUser = PermissionUser::paginate(5);

        return new JsonResponse($PermissionUser);
    }



    /**  
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {

        //var_dump($request);
        $PermissionUser = PermissionUser::create(
            [              
                "module" => $request->module,
                "create" => $request->create,
                "read" => $request->read,
                "update" => $request->update,
                "delete" => $request->delete,
            ]
        );

        return response()->json(['data' => $PermissionUser]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PermissionUser $PermissionUser)
    {
        //

        return new PermissionUserResource($PermissionUser);
    }



    public function search(Request $request)
    {
        $query = $request->name;
        //dd($query);
        $items = PermissionUser::where('name', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // inserta los datos
        PermissionUser::where('id', $request->id)->update([
          
            "module" => $request->module,
            "create" => $request->create,
            "read" => $request->read,
            "update" => $request->update,
            "delete" => $request->delete,
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
        PermissionUser::where('id', $q)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
