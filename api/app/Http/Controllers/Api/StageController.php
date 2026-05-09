<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\StageResource;
use App\Http\Controllers\Controller;
use App\Models\Stage;
use Validator;
use Illuminate\Http\Request;

class StageController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 5);
        $Stage = Stage::paginate($perPage);
        //dd($Stage);
        return response()->json($Stage);
    }


    public function stagesByProject($id)
    {
        //dd($id);
        $Stages = Stage::where('project_id', $id)->get();
        //dd($Stages);
        return response()->json($Stages);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
             "project_id" => "required|integer",
            "name" => "required|string|max:255",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "errors" => $validator->errors(),
            ], 422);
        }
        $Stage= Stage::create([
            "project_id" => $request->project_id,
            "name" => $request->name,   
        ]);

        return response()->json([
            "data" => $Stage
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Stage $Stage)
    {
        //
        return new StageResource($Stage);
    }

    public function search(Request $request)
    {


        $query = $request->q;
        //dd($query);
        $items = Stage::where('name', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {

        Validator::make($request->all(), [
            "project_id" => "required|integer",
            "name" => "required|string|max:255",
        ]);

        Stage::where('id', $request->id)->update([
            "project_id" => $request->project_id,
            "name" => $request->name,
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

        $deleted = Stage::where('id', $id)->delete();

        // respesta de JSON
        $response['eliminado'] = $deleted;
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
