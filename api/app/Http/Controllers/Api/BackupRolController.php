<?php

namespace App\Http\Controllers\Api;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RolController extends Controller implements HasMiddleware
{

 public static function middleware(): array
    {
        return [
            new Middleware(
                'permission:usuarios.read',
                only: ['index', 'show']
            ),

            new Middleware(
                'permission:usuarios.create',
                only: ['store']
            ),

            new Middleware(
                'permission:usuarios.update',
                only: ['update']
            ),

            new Middleware(
                'permission:usuarios.delete',
                only: ['destroy']
            ),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $Rol = Role::paginate(10);
        dd($Rol);
        return new JsonResponse($Rol);
    }



    /**  
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {

        //var_dump($request);
        $Rol = Role::create(
            [
                "name" => $request->name,
                "guard_name" => $request->guard_name,
            ]
        );

        return response()->json(['data' => $Rol]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $Role)
    {
        //

        return new RoleResource($Role);
    }



    public function search(Request $request)
    {
        $query = $request->name;
        //dd($query);
        $items = Role::where('name', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // inserta los datos
        Role::where('id', $request->id)->update([
            "name" => $request->name,
            "guard_name" => $request->guard_name,
       
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
        Role::where('id', $request->id)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
