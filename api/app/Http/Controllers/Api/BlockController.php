<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\BlockResource;
use App\Http\Controllers\Controller;
use App\Models\Block;
use Validator;
use Illuminate\Http\Request;

class BlockController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 5);
        $Block = Block::with('stage')->paginate($perPage);
        //dd($Block);
        //dd($Block);
        return response()->json($Block);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "stage_id" => "required|integer",
            "name" => "required|string|max:255",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "errors" => $validator->errors(),
            ], 422);
        }
        $Block = Block::create([
            "stage_id" => $request->stage_id,
            "name" => $request->name,
        ]);

        return response()->json([
            "data" => $Block
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Block $Block)
    {
        //
        return new BlockResource($Block);
    }


    public function blockByStage($id)
    {
        //dd($id);
        $blocks = Block::where('stage_id', $id)->get();
        //dd($blocks);
        return response()->json($blocks);
    }

    public function search(Request $request)
    {


        $query = $request->q;

        $items = Block::where('name', 'LIKE', "%$query%")
            ->get();
        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {

        Validator::make($request->all(), [
            "stage_id" => "required|integer",
            "name" => "required|string|max:255",
        ]);

        Block::where('id', $request->id)->update([
            "stage_id" => $request->stage_id,
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

        $deleted = Block::where('id', $id)->delete();

        // respesta de JSON
        $response['eliminado'] = $deleted;
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
