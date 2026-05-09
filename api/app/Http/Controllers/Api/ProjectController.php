<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ProjectResource;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Validator;
use Illuminate\Http\Request;

class ProjectController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 5);
        $Projects = Project::with("stages")->paginate($perPage);
        //dd($Projects);
        return response()->json($Projects);
    }



    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {



        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "errors" => $validator->errors(),
            ], 422);
        }
        $Project = Project::create([
            "name" => $request->name,
        ]);

        return response()->json([
            "data" => $Project,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //

        return new ProjectResource($project);
    }



    public function search(Request $request)
    {


        $query = $request->q;
        //dd($query);
        $items = Project::where('name', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {

        Validator::make($request->all(), [
            "name" => "required|string|max:255",
        ]);

        Project::where('id', $request->id)->update([
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

        $deleted = Project::where('id', $id)->delete();

        // respesta de JSON
        $response['eliminado'] = $deleted;
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
