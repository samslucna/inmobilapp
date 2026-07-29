<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Block;
use App\Models\Contract;
use App\Models\Ticket;
use App\Models\Property;
use App\Models\Stage;
use App\Services\AuditLogService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 5);
            $page = $request->input('page', 1);
            $search = $request->input('search', '');
            $agentId = $request->input('agent_id', 0); 
            //$status = $request->input('status', '');
            //$paytype = $request->input('paytype', '');
            //$dateFrom = $request->input('date_from', '');
            //$dateTo = $request->input('date_to', '');

            $query = Contract::query()
                ->with(['agent', 'buyer', 'seller', 'property', 'tickets']);
                
            // Aplicar filtros
            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'LIKE', "%{$search}%")
                        ->orWhereHas('buyer', function ($sub) use ($search) {
                            $sub->where('name', 'LIKE', "%{$search}%")
                                ->orWhere('lastnames', 'LIKE', "%{$search}%")
                                ->orWhere('email', 'LIKE', "%{$search}%");
                        });
                });
            }

            if ($agentId > 0) {
                $query->where('agent_id', $agentId);
            }


            // Paginación
            $contracts = $query->orderBy('id', 'desc')->paginate($perPage, ['*'], 'page', $page);

            // Transformar datos
            $contracts->getCollection()->transform(function ($contract) {
                $totalTickets = $this->calculateTotalTickets($contract->tickets);
                $advance = $contract->advance ?? 0;
                $block = Block::find($contract->property->block_id ?? null);
                $stage= Stage::find($block->stage_id ?? null);
                $contract->etapa = $stage ? $stage->name : null;
                $contract->cliente = trim($contract->buyer->name . ' ' . ($contract->buyer->lastnames ?? ''));
                $contract->pagado = $totalTickets > 0 ? $totalTickets : $advance;
                $contract->saldo = ($contract->property->amount_init ?? 0) - $contract->pagado;
                $contract->total_tickets_count = $contract->tickets->count();

                return $contract;
            });


            return response()->json([
                'success' => true,
                'data' => $contracts->items(),
                'current_page' => $contracts->currentPage(),
                'last_page' => $contracts->lastPage(),
                'per_page' => $contracts->perPage(),
                'total' => $contracts->total(),
                'from' => $contracts->firstItem(),
                'to' => $contracts->lastItem(),
            ]);



        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener contratos', $e);
        }
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            // Validación mejorada
            
            //dd($request->all());
            $validator = Validator::make($request->all(), [
                'buyer_id' => 'required|exists:buyers,id',
                'seller_id' => 'required|exists:sellers,id',
                'agent_id' => 'required|exists:agents,id',
                'property_id' => 'required|exists:properties,id',
                'plazo' => 'required|integer|min:1',
                'advance' => 'required|numeric|min:0',
                'paytype' => 'required|string',
                'ref' => 'nullable|string|max:255',
           
                'date' => 'required|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verificar que la propiedad no esté ya apartada
            $property = Property::find($request->property_id);
            if ($property->status !== 'disponible') {
                return response()->json([
                    'success' => false,
                    'message' => 'La propiedad ya no está disponible'
                ], 400);
            }

            // Crear contrato
            $contract = Contract::create([
                "buyer_id" => $request->buyer_id,
                "seller_id" => $request->seller_id,
                "agent_id" => $request->agent_id,
                "property_id" => $request->property_id,
                "plazo" => $request->plazo,
                "advance" => $request->advance,
                "paytype" => $request->paytype,
                "ref" => $request->ref,
                "status" => $request->status,
                "date" => Carbon::parse($request->date)->format('Y-m-d'),
            ]);

            // Actualizar estado de la propiedad
            Property::where('id', $request->property_id)->update([
                "status" => 'apartado'
            ]);

            // Crear ticket de enganche solo si el advance es mayor a 0
            if ($request->advance > 0) {
                $ticket = Ticket::create([
                    "concept" => "Enganche",
                    "amount" => $request->advance,
                    "date" => Carbon::parse($request->date)->format('Y-m-d'),
                    "paytype" => $request->paytype,
                    "contract_id" => $contract->id,
                ]);
                $contract->ticket = $ticket;
            }

            // Registrar auditoría
            AuditLogService::log(
                description: auth()->user()->name . " creó un nuevo contrato",
                event: 'created',
                logName: 'contratos',
                properties: [
                    'contract_id' => $contract->id,
                    'property_id' => $request->property_id,
                    'buyer_id' => $request->buyer_id,
                    'advance' => $request->advance,
                    'total_amount' => $property->amount_init ?? 0,
                ],
                subject: $contract
            );

            DB::commit();

            // Cargar relaciones para la respuesta
            $contract->load(['agent', 'buyer', 'seller', 'property', 'tickets']);

            return response()->json([
                'success' => true,
                'message' => 'Contrato creado exitosamente',
                'data' => $contract,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Error al crear contrato', $e);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        try {
            $contract = Contract::with(['agent', 'buyer', 'seller', 'property', 'tickets'])
                ->find($id);

            if (!$contract) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contrato no encontrado'
                ], 404);
            }

            $totalTickets = $this->calculateTotalTickets($contract->tickets);

            $contract->cliente = trim($contract->buyer->name . ' ' . ($contract->buyer->lastnames ?? ''));
            $contract->pagado = $totalTickets;
            $contract->saldo = ($contract->property->amount_init ?? 0) - $totalTickets;
            $contract->total_tickets_count = $contract->tickets->count();

            $tickets = Ticket::where('contract_id', $id)->get();

            // Registrar visualización
            AuditLogService::log(
                description: auth()->user()->name . " visualizó detalles del contrato",
                event: 'view',
                logName: 'contratos',
                properties: [
                    'contract_id' => $id,
                    'contract_ref' => $contract->ref,
                ],
                subject: $contract
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'contract' => $contract,
                    'tickets' => $tickets,
                ],
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener contrato', $e);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        DB::beginTransaction();

        try {
            $contract = Contract::find($id);

            if (!$contract) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contrato no encontrado'
                ], 404);
            }

            // Guardar valores antiguos para auditoría
            $oldValues = $contract->getAttributes();

            // Validación
            $validator = Validator::make($request->all(), [
                'buyer_id' => 'sometimes|exists:buyers,id',
                'seller_id' => 'sometimes|exists:sellers,id',
                'agent_id' => 'sometimes|exists:agents,id',
                'property_id' => 'sometimes|exists:properties,id',
                'plazo' => 'sometimes|integer|min:1',
                'advance' => 'sometimes|numeric|min:0',
                'paytype' => 'sometimes|string',
                'ref' => 'nullable|string|max:255',
                'date' => 'sometimes|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Actualizar datos
            $updateData = [];
            $fields = ['buyer_id', 'seller_id', 'agent_id', 'property_id', 'plazo', 'advance', 'paytype', 'ref', 'status'];

            foreach ($fields as $field) {
                if ($request->has($field)) {
                    $updateData[$field] = $request->$field;
                }
            }

            if ($request->has('date')) {
                $updateData['date'] = Carbon::parse($request->date)->format('Y-m-d');
            }

            dd($updateData);
            $contract->update($updateData);

            // Registrar cambios en auditoría
            $changes = array_intersect_key($contract->getChanges(), array_flip($fields));
            if (!empty($changes)) {
                AuditLogService::log(
                    description: auth()->user()->name . " actualizó un contrato",
                    event: 'updated',
                    logName: 'contratos',
                    properties: [
                        'contract_id' => $contract->id,
                        'old_values' => $oldValues,
                        'new_values' => $changes,
                    ],
                    subject: $contract,
                    severity: 'warning'
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Contrato actualizado exitosamente',
                'data' => $contract->fresh(['agent', 'buyer', 'seller', 'property', 'tickets']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Error al actualizar contrato', $e);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();

        try {
            $contract = Contract::with(['property', 'tickets'])->find($id);

            if (!$contract) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contrato no encontrado'
                ], 404);
            }

            // Guardar información para auditoría
            $contractData = $contract->toArray();

            // Liberar propiedad
            Property::where('id', $contract->property_id)->update([
                "status" => 'disponible'
            ]);

            // Eliminar tickets asociados
            $ticketsCount = Ticket::where('contract_id', $id)->count();
            Ticket::where('contract_id', $id)->delete();

            // Eliminar contrato
            $contract->delete();

            // Registrar auditoría
            AuditLogService::log(
                description: auth()->user()->name . " eliminó un contrato",
                event: 'deleted',
                logName: 'contratos',
                properties: [
                    'contract_id' => $id,
                    'property_id' => $contract->property_id,
                    'tickets_deleted' => $ticketsCount,
                    'contract_data' => $contractData,
                ],
                subject: $contract,
                severity: 'warning'
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Contrato eliminado exitosamente',
                'data' => [
                    'deleted_id' => $id,
                    'tickets_deleted' => $ticketsCount,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Error al eliminar contrato', $e);
        }
    }

    /**
     * Search contracts.
     */
    public function search(Request $request): JsonResponse
    {
        //dd($request->all());
        try {
            $q = $request->input('q', '');

            if (empty($q)) {
                return $this->index($request);
            }

            
            $contracts = Contract::with(['buyer', 'seller', 'agent', 'property', 'tickets'])
                ->whereHas('buyer', function ($subQuery) use ($q) {
                    $subQuery->where('name', 'LIKE', "%{$q}%")
                        ->orWhere('lastnames', 'LIKE', "%{$q}%")
                        ->orWhere('email', 'LIKE', "%{$q}%");
                })
                ->whereHas('agent', function ($subQuery) use ($q) {
                    $subQuery->where('name', 'LIKE', "%{$q}%")
                        ->orWhere('lastnames', 'LIKE', "%{$q}%")
                        ->orWhere('email', 'LIKE', "%{$q}%");
                })
                ->orWhereHas('property', function ($subQuery) use ($q) {
                    $subQuery->where('name', 'LIKE', "%{$q}%")
                        ->orWhere('status', 'LIKE', "%{$q}%");
                })
                ->orWhere('id', 'LIKE', "%{$q}%")
                ->orWhere('ref', 'LIKE', "%{$q}%")
                ->limit(50)
                ->get();

            //dd($contracts);
            foreach ($contracts as $contract) {
                $totalTickets = $this->calculateTotalTickets($contract->tickets);
                $advance = $contract->advance ?? 0;

                $contract->cliente = trim($contract->buyer->name . ' ' . ($contract->buyer->lastnames ?? ''));
                $contract->pagado = $totalTickets > 0 ? $totalTickets : $advance;
                $contract->saldo = ($contract->property->amount_init ?? 0) - $contract->pagado;
            }

            // Registrar búsqueda
            AuditLogService::log(
                description: auth()->user()->name . " realizó búsqueda de contratos",
                event: 'search',
                logName: 'contratos',
                properties: [
                    'search_term' => $q,
                    'results_count' => $contracts->count(),
                ]
            );

            return response()->json([
                'success' => true,
                'data' => $contracts,
                'total' => $contracts->count(),
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al buscar contratos', $e);
        }
    }

    /**
     * Get contracts by status.
     */
    public function getByStatus($status): JsonResponse
    {
        try {
            $contracts = Contract::with(['buyer', 'seller', 'agent', 'property'])
                ->where('status', $status)
                ->orderBy('id', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $contracts,
                'total' => $contracts->count(),
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener contratos por estado', $e);
        }
    }

    /**
     * Get contract statistics.
     */
    public function statistics(Request $request): JsonResponse
    {
        try {
            $stats = [
                'total' => Contract::count(),
                'pendiente' => Contract::where('status', 'pendiente')->count(),
                'activo' => Contract::where('status', 'activo')->count(),
                'completado' => Contract::where('status', 'completado')->count(),
                'cancelado' => Contract::where('status', 'cancelado')->count(),
                'total_amount' => Contract::with('property')->get()->sum(function ($c) {
                    return $c->property->amount_init ?? 0;
                }),
                'monthly_contracts' => Contract::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, count(*) as count, SUM(advance) as total_advance')
                    ->groupBy('month')
                    ->orderBy('month', 'desc')
                    ->limit(12)
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener estadísticas', $e);
        }
    }

    /**
     * Export contracts.
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $contracts = Contract::with(['buyer', 'seller', 'agent', 'property'])
                ->get()
                ->map(function ($contract) {
                    return [
                        'ID' => $contract->id,
                        'Fecha' => $contract->date,
                        'Comprador' => $contract->buyer->name . ' ' . $contract->buyer->lastnames,
                        'Vendedor' => $contract->seller->name . ' ' . $contract->seller->lastnames,
                        'Agente' => $contract->agent->name . ' ' . $contract->agent->lastnames,
                        'Propiedad' => $contract->property->title,
                        'Valor' => $contract->property->amount_init,
                        'Enganche' => $contract->advance,
                        'Plazo' => $contract->plazo . ' meses',
                        'Tipo Pago' => $contract->paytype,
                        'Estado' => $contract->status,
                        'Referencia' => $contract->ref,
                    ];
                });

            // Registrar exportación
            AuditLogService::logExport('contratos', $contracts->count(), $request->all());

            return response()->json([
                'success' => true,
                'data' => $contracts,
                'exported_at' => now(),
                'total_records' => $contracts->count(),
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al exportar contratos', $e);
        }
    }

    // ========== MÉTODOS PRIVADOS ==========

    /**
     * Calculate total amount from tickets.
     */
    private function calculateTotalTickets($tickets): float
    {
        if (!$tickets || $tickets->isEmpty()) {
            return 0;
        }

        return $tickets->sum('amount');
    }

    /**
     * Calculate total discount from tickets.
     */
    private function calculateTotalDiscount($tickets): float
    {
        if (!$tickets || $tickets->isEmpty()) {
            return 0;
        }

        return $tickets->sum('discount');
    }

    /**
     * Return error response.
     */
    private function errorResponse(string $message, \Exception $e = null): JsonResponse
    {
        // Registrar error en bitácora
        if ($e) {
            AuditLogService::logError(
                $e->getMessage(),
                'contratos',
                ['method' => debug_backtrace()[1]['function'] ?? 'unknown']
            );
        }

        return response()->json([
            'success' => false,
            'message' => $message,
            'error' => config('app.debug') ? $e?->getMessage() : null,
        ], 500);
    }
}
