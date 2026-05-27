<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Boundary;
use App\Models\Property;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function propertiesContracts(Request $request)
    {
    
      // Construir consulta base
        $query = DB::table('properties as p')
            ->join('blocks as b', 'p.block_id', '=', 'b.id')
            ->leftJoin('contracts as c', 'p.id', '=', 'c.property_id')
            ->select(
                'p.id',
                'p.name',
                'p.description',
                'b.name as manzana',
                'b.stage_id',
                'p.amount_init',
                DB::raw("CASE WHEN c.property_id IS NOT NULL THEN 'VENDIDO' ELSE 'DISPONIBLE' END as status"),
                'c.date as fecha_contrato' // asumiendo que existe esta columna
            );
            dd($query->get());

                    // Aplicar filtros según parámetros recibidos

        // Filtro 1: Lotes disponibles (sin contrato)
        if ($request->has('disponibles') && filter_var($request->disponibles, FILTER_VALIDATE_BOOLEAN)) {
            $query->whereNull('c.idlote');
        }

        // Filtro 2: Lotes vendidos (con contrato)
        if ($request->has('vendidos') && filter_var($request->vendidos, FILTER_VALIDATE_BOOLEAN)) {
            $query->whereNotNull('c.idlote');
        }

        // Filtro 3: Por etapa específica
        if ($request->has('etapa') && $request->etapa) {
            $query->where('m.etapa', $request->etapa);
        }

        // Filtro 4: Múltiples etapas (array)
        if ($request->has('etapas') && is_array($request->etapas)) {
            $query->whereIn('m.etapa', $request->etapas);
        }


                // Filtro 5: Rango de fechas del contrato (solo para lotes vendidos)
        if ($request->has('fecha_desde') && $request->has('fecha_hasta')) {
            $query->whereBetween('c.fecha_contrato', [$request->fecha_desde, $request->fecha_hasta]);
        } elseif ($request->has('fecha_desde')) {
            $query->whereDate('c.fecha_contrato', '>=', $request->fecha_desde);
        } elseif ($request->has('fecha_hasta')) {
            $query->whereDate('c.fecha_contrato', '<=', $request->fecha_hasta);
        }

        // Filtro 6: Por manzana específica
        if ($request->has('manzana') && $request->manzana) {
            $query->where('m.nombre', 'like', '%' . $request->manzana . '%');
        }

        // Filtro 7: Por rango de precio
        if ($request->has('precio_min') && $request->precio_min) {
            $query->where('l.coste_lote', '>=', $request->precio_min);
        }
        if ($request->has('precio_max') && $request->precio_max) {
            $query->where('l.coste_lote', '<=', $request->precio_max);
        }
    
        // Filtro 8: Búsqueda por nombre de lote
        if ($request->has('search') && $request->search) {
            $query->where('l.name_lote', 'like', '%' . $request->search . '%');
        }

        // Ordenamiento
        $ordenCampo = $request->get('ordenar_por', 'm.etapa');
        $ordenDireccion = $request->get('orden', 'asc');
        $query->orderBy($ordenCampo, $ordenDireccion);

        // Paginación (opcional)
        $porPagina = $request->get('por_pagina', 15);
        $lotes = $query->paginate($porPagina);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'data' => $lotes,
                'filtros_aplicados' => $request->all()
            ]);
        }
    //properties = Property::with('contracts')->get();

        //return response()->json($properties);
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
