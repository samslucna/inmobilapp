<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContractResource;
use App\Models\Contract;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\CalcController;
use App\Models\Property;
use Illuminate\Support\Facades\DB;

class ContractController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $contract = Contract::orderBy('id', 'desc')->with('agent')->with('buyer')->with('seller')
            ->with('property')->with('tickets')->paginate(5);

        //contract_client_view



        foreach ($contract as $o) {
            $o['cliente'] = $o['buyer']['name'] . " " . $o['buyer']['lastnames'];
            $o['pagado'] = $this->total($o['tickets']);
            $o['saldo'] = $o['property']['amount_init'] - $o['pagado'];;
        }


        return new JsonResponse($contract);
    }

    public function total($listData)
    {

        $total = 0;
        foreach ($listData as $nameKey) {
            $total += $nameKey->amount;
        }
        return $total;
    }

    public function totalDiscount($listData)
    {

        $total = 0;
        foreach ($listData as $nameKey) {
            $total += $nameKey->discount;
        }
        return $total;
    }



    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {


        //dd($request->all());

        $contract = Contract::create(
            [
                "buyer_id" => $request->buyer_id,
                "seller_id" => $request->seller_id,
                "agent_id" => $request->agent_id,
                "property_id" => $request->property_id,
                "plazo" => $request->plazo,
                "paytype" => $request->paytype,
                "ref" => $request->ref,
                "advance" => $request->advance,
                "date" => Carbon::parse($request->date)->format('Y-m-d'),
            ]
        );

        Property::where('id', $request->property_id)->update([
            "status" => 'apartado'
        ]);

        $ticket  = Ticket::create([
            "concept" => "Enganche",
            "amount" => $request->advance,
            "date" => Carbon::parse($request->date)->format('Y-m-d'),
            "paytype" => $request->paytype,
            "contract_id" => $contract['id'],
        ]);
        $contract['ticket'] = $ticket;


        return response()->json(['data' => $contract]);
    }

    /**
     * Display the specified resource.
     */
    public function show($req)
    {
        //dd($req);
        $req = number_format($req);
        $contract = Contract::with('agent')->with('buyer')->with('seller')
            ->with('property')->with('tickets')->find($req);

        $contract['cliente'] = $contract['buyer']['name'] . " " . $contract['buyer']['lastnames'];
        $contract['pagado'] = $this->total($contract['tickets']);
        $contract['saldo'] = $contract['property']['amount_init'] - $contract['pagado'];


        $tickets = Ticket::where('contract_id', $req)->get();
        //var_dump($tickets);

        return response()->json([
            'contract' => $contract,
            'tickets' => $tickets,
        ]);
    }



    public function search(Request $request)
    {
        $q = $request->q;

        $items = Contract::with(['buyer', 'seller', 'agent', 'property', 'tickets'])
            ->whereHas('buyer', function ($subQuery) use ($q) {
                $subQuery->where(function ($b) use ($q) {
                    // El comodín % al final simula la RegExp `${value}.*`
                    $b->where('name', 'LIKE', "{$q}%")
                        ->orWhere('lastnames', 'LIKE', "{$q}%");
                });
            })->get();

        foreach ($items as $o) {
            $o['cliente'] = $o['buyer']['name'] . " " . $o['buyer']['lastnames'];
            $o['pagado'] = $this->total($o['tickets']);
            $o['saldo'] = $o['property']['amount_init'] - $o['pagado'];
        }

        return response()->json($items);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // inserta los datos
        Contract::where('id', $request->id)->update([
            "buyer_id" => $request->buyer_id,
            "seller_id" => $request->seller_id,
            "agent_id" => $request->agent_id,
            "property_id" => $request->property_id,
            "plazo" => $request->plazo,
            "paytype" => $request->paytype,
            "ref" => $request->ref,
            "advance" => $request->advance,
            "date" => Carbon::parse($request->date)->format('Y-m-d'),
        ]);

        // respesta de JSON
        $response['message'] = "Actualizo exitosamente";
        $response['success'] = true;

        return $response;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($q)
    {
        // Eliminar
        $contract = Contract::where('id', $q)->get();

        Property::where('id', $contract[0]->property_id)->update([
            "status" => 'disponible'
        ]);

        Ticket::where('contract_id', $q)->delete();
        Contract::where('id', $q)->delete();
        // respesta de JSON
        $response['message'] = "Elimino exitosamente";
        $response['success'] = true;

        return $response;
    }
}
