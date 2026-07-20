<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Models\Contract;
use App\Services\AuditLogService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {

        try {
            $perPage = $request->input('per_page', 5);
            $page = $request->input('page',1);
            $search = $request->input('search', '');
 
            $query = Ticket::orderBy('id', 'desc')
                ->with('contract');

            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'LIKE', "%{$search}%");
                });
            }




            $tickets = $query->orderBy('id', 'desc')->paginate($perPage, ['*'], 'page', $page);


            // Registrar acción de visualización
            AuditLogService::log(
                description: auth()->user()->name . " visualizó lista de Recibos",
                event: 'view',
                logName: 'Recibos',
                properties: [
                    'page' => $request->input('page', 1),
                    'per_page' => $perPage,
                    'total' => $tickets->total(),
                ]
            );
            

            //dd($tickets->lastPage());
            return response()->json([
                'success' => true,
                'data' => $tickets->items(),
                'current_page' => $tickets->currentPage(),
                'last_page' => $tickets->lastPage(),
                'per_page' => $tickets->perPage(),
                'total' => $tickets->total(),
                'from' => $tickets->firstItem(),
                'to' => $tickets->lastItem(),
            ]);


        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener recibos', $e);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {

            //dd($request->all());
            // Validación mejorada
            $validator = Validator::make($request->all(), [
                'concept' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'date' => 'required|date',
                'contract_id' => 'required|exists:contracts,id',
                'ref' => 'nullable|string|max:255',
                //'status' => 'nullable|string|in:pendiente,cobrado,cancelado',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verificar que el contrato existe
            $contract = Contract::find($request->contract_id);
            if (!$contract) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contrato no encontrado'
                ], 404);
            }

            // Calcular saldo actual para verificar
            $currentBalance = $this->calculateCurrentBalance($request->contract_id);
            $newTotal = $currentBalance + $request->amount;

            // Crear ticket
            $ticket = Ticket::create([
                "concept" => $request->concept,
                "amount" => $request->amount,
                "date" => Carbon::parse($request->date)->format('Y-m-d'),
                "paytype" => $request->paytype,
                "contract_id" => $request->contract_id,
                "ref" => $request->ref ?? null,
                "status" => $request->status ?? 'cobrado',
            ]);

            // Verificar y actualizar el status del contrato
            $statusChanged = $this->verificUpdateStatus($request->contract_id);

            // Obtener información del contrato para auditoría
            $propertyInfo = $this->getContractPropertyInfo($request->contract_id);

            // Registrar auditoría
            AuditLogService::log(
                description: auth()->user()->name . " creó un nuevo recibo de pago",
                event: 'created',
                logName: 'tickets',
                properties: [
                    'ticket_id' => $ticket->id,
                    'contract_id' => $request->contract_id,
                    'concept' => $request->concept,
                    'amount' => $request->amount,
                    'paytype' => $request->paytype,
                    'previous_balance' => $currentBalance,
                    'new_balance' => $propertyInfo['balance'] ?? null,
                    'contract_updated' => $statusChanged,
                ],
                subject: $ticket
            );

            DB::commit();

            // Cargar relaciones
            $ticket->load('contract');

            return response()->json([
                'success' => true,
                'message' => 'Recibo creado exitosamente',
                'data' => $ticket,
                'balance_info' => [
                    'previous_balance' => $currentBalance,
                    'new_balance' => $propertyInfo['balance'] ?? null,
                    'property_status' => $propertyInfo['property_status'] ?? null,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Error al crear ticket', $e);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        try {
            $ticket = Ticket::with('contract')->find($id);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Recibo no encontrado'
                ], 404);
            }

            // Registrar visualización
            AuditLogService::log(
                description: auth()->user()->name . " visualizó detalles del recibo",
                event: 'view',
                logName: 'tickets',
                properties: [
                    'ticket_id' => $id,
                    'contract_id' => $ticket->contract_id,
                    'amount' => $ticket->amount,
                ],
                subject: $ticket
            );

            return response()->json([
                'success' => true,
                'data' => new TicketResource($ticket),
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener recibo', $e);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        DB::beginTransaction();

        try {
            $ticket = Ticket::find($id);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'recibo no encontrado'
                ], 404);
            }

            // Guardar valores antiguos para auditoría
            $oldValues = $ticket->getAttributes();

            // Validación
            $validator = Validator::make($request->all(), [
                'concept' => 'sometimes|string|max:255',
                'amount' => 'sometimes|numeric|min:0',
                'date' => 'sometimes|date',
                'contract_id' => 'sometimes|exists:contracts,id',

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
            $fields = ['concept', 'amount', 'paytype', 'contract_id', 'ref', 'status'];

            foreach ($fields as $field) {
                if ($request->has($field)) {
                    $updateData[$field] = $request->$field;
                }
            }

            if ($request->has('date')) {
                $updateData['date'] = Carbon::parse($request->date)->format('Y-m-d');
            }

            $ticket->update($updateData);

            // Verificar y actualizar el status del contrato
            $statusChanged = $this->verificUpdateStatus($ticket->contract_id);

            // Registrar cambios en auditoría
            $changes = array_intersect_key($ticket->getChanges(), array_flip($fields));
            if (!empty($changes)) {
                AuditLogService::log(
                    description: auth()->user()->name . " actualizó un recibo",
                    event: 'updated',
                    logName: 'Recibos',
                    properties: [
                        'ticket_id' => $id,
                        'old_values' => $oldValues,
                        'new_values' => $changes,
                        'contract_updated' => $statusChanged,
                    ],
                    subject: $ticket,
                    severity: 'warning'
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Recibo actualizado exitosamente',
                'data' => $ticket->fresh(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Error al actualizar recibo', $e);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();

        try {
            $ticket = Ticket::find($id);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Recibo no encontrado'
                ], 404);
            }

            // Guardar información para auditoría
            $ticketData = $ticket->toArray();
            $contractId = $ticket->contract_id;
            $balanceBefore = $this->calculateCurrentBalance($contractId);

            // Eliminar ticket
            $ticket->delete();

            // Verificar y actualizar el status del contrato después de eliminar
            $statusChanged = $this->verificUpdateStatus($contractId);
            $balanceAfter = $this->calculateCurrentBalance($contractId);

            // Registrar auditoría
            AuditLogService::log(
                description: auth()->user()->name . " eliminó un recibo",
                event: 'deleted',
                logName: 'Recibos',
                properties: [
                    'ticket_id' => $id,
                    'contract_id' => $contractId,
                    'amount' => $ticketData['amount'],
                    'concept' => $ticketData['concept'],
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'contract_updated' => $statusChanged,
                ],
                subject: $ticket,
                severity: 'warning'
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Recibo eliminado exitosamente',
                'data' => [
                    'deleted_id' => $id,
                    'contract_id' => $contractId,
                    'balance_info' => [
                        'previous_balance' => $balanceBefore,
                        'current_balance' => $balanceAfter,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Error al eliminar recibo', $e);
        }
    }

    /**
     * Search tickets.
     */
    public function search(Request $request): JsonResponse
    {
        try {
            //dd($request->all());
            $query = $request->input('q', '');

            if (empty($query)) {
                return $this->index($request);
            }

            $tickets = Ticket::with('contract')
                ->where('id', '=', $query) 
                //->orWhere('ref', 'LIKE', "%{$query}%")
                //->orWhereHas('contract', function($q) use ($query) {
                //    $q->where('ref', 'LIKE', "%{$query}%");
                //})
                //->limit(50)
                ->paginate(5);

            // Registrar búsqueda
            //AuditLogService::log(
            //    description: auth()->user()->name . " realizó búsqueda de recibos",
            //    event: 'search',
            //    logName: 'recibos',
            //    properties: [
            //        'search_term' => $query,
            //        'results_count' => $tickets->total(),
            //    ]
            //);

            return response()->json([
                'success' => true,
                'data' => $tickets->items(),
                'current_page' => $tickets->currentPage(),
                'last_page' => $tickets->lastPage(),
                'per_page' => $tickets->perPage(),
                'total' => $tickets->total(),
                'from' => $tickets->firstItem(),
                'to' => $tickets->lastItem(),
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al buscar recibos', $e);
        }
    }

    /**
     * Get tickets by contract.
     */
    public function getByContract($contractId): JsonResponse
    {
        try {
            $contract = Contract::find($contractId);

            if (!$contract) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contrato no encontrado'
                ], 404);
            }

            $tickets = Ticket::where('contract_id', $contractId)
                ->orderBy('date', 'desc')
                ->get();

            $totalAmount = $tickets->sum('amount');
            $balance = $this->calculateCurrentBalance($contractId);

            return response()->json([
                'success' => true,
                'data' => [
                    'contract' => [
                        'id' => $contract->id,
                        'ref' => $contract->ref,
                        'buyer_name' => $contract->buyer->name ?? null,
                    ],
                    'tickets' => $tickets,
                    'summary' => [
                        'total_tickets' => $tickets->count(),
                        'total_amount' => $totalAmount,
                        'remaining_balance' => $balance,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al obtener recibos del contrato', $e);
        }
    }

    /**
     * Get ticket statistics.
     */
    public function statistics(Request $request): JsonResponse
    {
        try {
            $stats = [
                'total_tickets' => Ticket::count(),
                'total_amount' => Ticket::sum('amount'),
                'by_paytype' => Ticket::selectRaw('paytype, count(*) as count, sum(amount) as total')
                    ->groupBy('paytype')
                    ->get(),
                'by_month' => Ticket::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, count(*) as count, sum(amount) as total')
                    ->groupBy('month')
                    ->orderBy('month', 'desc')
                    ->limit(12)
                    ->get(),
                'last_30_days' => Ticket::where('date', '>=', Carbon::now()->subDays(30))->sum('amount'),
                'average_per_ticket' => Ticket::avg('amount'),
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
     * Export tickets.
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $tickets = Ticket::with('contract')->get();

            // Registrar exportación
            AuditLogService::logExport('tickets', $tickets->count(), $request->all());

            return response()->json([
                'success' => true,
                'data' => $tickets,
                'exported_at' => now(),
                'total_records' => $tickets->count(),
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al exportar recibos', $e);
        }
    }

    // ========== MÉTODOS PRIVADOS ==========

    /**
     * Verificar y actualizar el status del contrato basado en los pagos.
     */
    protected function verificUpdateStatus($contractId): bool
    {
        try {
            // Obtener el costo inicial y la suma de los tickets
            $datos = DB::table('contracts as c')
                ->join('properties as p', 'c.property_id', '=', 'p.id')
                ->leftJoin('tickets as t', 'c.id', '=', 't.contract_id')
                ->where('c.id', $contractId)
                ->select(
                    'p.id as property_id',
                    'p.amount_init',
                    DB::raw('COALESCE(SUM(t.amount), 0) as total_tickets')
                )
                ->groupBy('p.id', 'p.amount_init')
                ->first();

            if (!$datos) {
                return false;
            }

            $balance = $datos->amount_init - $datos->total_tickets;
            $oldStatus = DB::table('properties')->where('id', $datos->property_id)->value('status');
            $newStatus = $balance <= 0 ? 'vendido' : 'apartado';

            $statusChanged = $oldStatus !== $newStatus;

            // Actualizar el estado de la propiedad
            DB::table('properties')
                ->where('id', $datos->property_id)
                ->update(['status' => $newStatus]);

            // Registrar cambio de estado en auditoría si ocurrió
            if ($statusChanged) {
                AuditLogService::log(
                    description: "Cambio de estado de propiedad por actualización de pagos",
                    event: 'status_change',
                    logName: 'properties',
                    properties: [
                        'property_id' => $datos->property_id,
                        'old_status' => $oldStatus,
                        'new_status' => $newStatus,
                        'contract_id' => $contractId,
                        'balance' => $balance,
                    ],
                    severity: 'info'
                );
            }

            return $statusChanged;
        } catch (\Exception $e) {
            \Log::error('Error al verificar estado del contrato: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Calcular el balance actual de un contrato.
     */
    protected function calculateCurrentBalance($contractId): float
    {
        $datos = DB::table('contracts as c')
            ->join('properties as p', 'c.property_id', '=', 'p.id')
            ->leftJoin('tickets as t', 'c.id', '=', 't.contract_id')
            ->where('c.id', $contractId)
            ->select(
                'p.amount_init',
                DB::raw('COALESCE(SUM(t.amount), 0) as total_tickets')
            )
            ->groupBy('p.amount_init')
            ->first();

        if (!$datos) {
            return 0;
        }

        return $datos->amount_init - $datos->total_tickets;
    }

    /**
     * Obtener información del contrato y propiedad.
     */
    protected function getContractPropertyInfo($contractId): array
    {
        $info = DB::table('contracts as c')
            ->join('properties as p', 'c.property_id', '=', 'p.id')
            ->leftJoin('tickets as t', 'c.id', '=', 't.contract_id')
            ->where('c.id', $contractId)
            ->select(
                'p.id as property_id',
                'p.amount_init',
                'p.status as property_status',
                DB::raw('COALESCE(SUM(t.amount), 0) as total_paid')
            )
            ->groupBy('p.id', 'p.amount_init', 'p.status')
            ->first();

        if (!$info) {
            return [
                'property_id' => null,
                'property_status' => null,
                'amount_init' => 0,
                'total_paid' => 0,
                'balance' => 0,
            ];
        }

        return [
            'property_id' => $info->property_id,
            'property_status' => $info->property_status,
            'amount_init' => $info->amount_init,
            'total_paid' => $info->total_paid,
            'balance' => $info->amount_init - $info->total_paid,
        ];
    }

    /**
     * Obtener el balance de un contrato (método público para compatibilidad).
     */
    public function getBalance($contractId): JsonResponse
    {
        try {
            $balance = $this->calculateCurrentBalance($contractId);
            $info = $this->getContractPropertyInfo($contractId);

            return response()->json([
                'success' => true,
                'data' => [
                    'contract_id' => $contractId,
                    'balance' => $balance,
                    'property_status' => $info['property_status'],
                    'total_paid' => $info['total_paid'],
                    'total_amount' => $info['amount_init'],
                ],
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al calcular balance', $e);
        }
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
                'recibos',
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
