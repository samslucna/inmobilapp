<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgentResource;
use App\Models\Agent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AgentController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $search = $request->input('search');
        $perPage = $request->input('per_page', 5);
        $buyers = Agent::when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        })->paginate($perPage);


        return response()->json($buyers);
    }



    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {

        //var_dump($request);
        $seller = Agent::create(
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
    public function show(Agent $agent)
    {
        //

        return new AgentResource($agent);
    }



    public function search(Request $request)
    {
        $query = $request->q;
        //dd($query);
        $items = Agent::where('name', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // inserta los datos
        Agent::where('id', $request->id)->update([
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
        Agent::where('id', $id)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
