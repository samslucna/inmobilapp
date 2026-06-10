<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controllers\Middleware;
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

        $property = Property::with('block')->with('boundaries')->paginate(5);

        return new JsonResponse($property);
    }

    public function propertiesContracts(Request $request)
    {
        // Construir consulta base
        $query = DB::table('properties as p')
            ->join('blocks as b', 'p.block_id', '=', 'b.id')
            ->leftJoin('contracts as c', 'p.id', '=', 'c.property_id')
            ->leftJoin('tickets as t', 'c.id', '=', 't.contract_id')
            ->select(
                'p.id',
                'p.name',
                'b.name as manzana',
                'b.stage_id',
                'p.amount_init',
                'p.status',

                // Subconsulta 1: Trae la suma total de los montos de los tickets
                DB::raw("COALESCE(
                (SELECT SUM(tk.amount) FROM tickets tk WHERE tk.contract_id = c.id), 0) as total_pagado"),

                // Subconsulta 2: Calcula el saldo (amount_init - total_tickets)
                DB::raw("p.amount_init - COALESCE(
                (SELECT SUM(tk.amount) FROM tickets tk WHERE tk.contract_id = c.id), 
                0
            ) as saldo"),
                'c.date as fecha_contrato' // asumiendo que existe esta columna
            );


        //dd($query->get());
        // 2. FILTRO POR ESTADO (disponible, vendido, apartado)
        // Recibe el parámetro 'status' desde el request
        $query->when($request->filled('status'), function ($q) use ($request) {
            $status = $request->input('status');
            //dd($status['disponible']);

            if ($status) {
                // Solo disponibles
                //dd($status);

                $seleccionados = array_filter($status);
                $conteo = count($seleccionados);

                if ($conteo === 1) {
                    // Un solo estado seleccionado
                    $estadoUnico = key($seleccionados);
                    $q->where('p.status', $estadoUnico);
                } elseif ($conteo === 2) {
                    // Dos estados seleccionados
                    $estados = array_keys($seleccionados);
                    $q->whereIn('p.status', $estados);
                } elseif ($conteo === 3 || $conteo === 0) {
                    // Todos o ninguno seleccionado
                    $q->whereIn('p.status', ['disponible', 'apartado', 'vendido']);
                }
            }
        });



        // Filtro 3: Por etapa específica
        if ($request->has('Etapa') && $request->stage_id) {
            $query->where('b.stage_id', $request->stage_id);
        }




        // Filtro 5: Rango de fechas del contrato (solo para lotes vendidos)
        $query->when($request->input('dates')['date_init'] && $request->input('dates')['date_end'], function ($q) use ($request) {
            //dd($request->input('dates')['date_init']);
            $q->whereBetween('c.date', [
                $request->input('dates')['date_init'],
                $request->input('dates')['date_end']

            ]);
        });

        // Filtro 6: Por manzana específica
        if ($request->has('block_id') && $request->block_id) {
            $query->where('b.id', $request->block_id);
        }

        //dd($query->get());
        //// Filtro 7: Por rango de precio
        //if ($request->has('precio_min') && $request->precio_min) {
        //    $query->where('l.coste_lote', '>=', $request->precio_min);
        //}
        //if ($request->has('precio_max') && $request->precio_max) {
        //    $query->where('l.coste_lote', '<=', $request->precio_max);
        //}

        // Filtro 8: Búsqueda por nombre de lote
        if ($request->has('search') && $request->search) {
            $query->where('l.name', 'like', '%' . $request->search . '%');
        }

        // Ordenamiento
        $ordenCampo = $request->get('ordenar_por', 'p.id'); // campo por defecto
        $ordenDireccion = $request->get('orden', 'asc');
        $query->orderBy($ordenCampo, $ordenDireccion);




        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'reports' => $query->get(),
                'data' => $query->paginate(5),
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
