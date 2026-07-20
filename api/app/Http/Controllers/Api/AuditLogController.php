<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AuditLogController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:audit.read', only: ['index', 'show', 'statistics']),
            new Middleware('permission:audit.delete', only: ['destroy', 'clearOld']),
        ];
    }

    /**
     * List logs with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with('causer');

        // Filter by event
        if ($request->filled('event')) {
            $query->where('event', '=', $request->event);
        }



        // Filter by module (log_name)
        if ($request->filled('module')) {
            $query->where('log_name', '=', $request->module);
        }
        //dd($query->get());
        // Filter by user
        if ($request->filled('causer_id')) {
            $query->where('causer_id', $request->causer_id);
        }

        // Filter by date range
        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('created_at', [$request->date_from, $request->date_to]);
        }

        // Search by description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('description', 'LIKE', "%{$search}%");
        }

        $perPage = $request->input('per_page', 5);
        $logs = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $logs->items(),
            'current_page' => $logs->currentPage(),
            'last_page' => $logs->lastPage(),
            'per_page' => $logs->perPage(),
            'total' => $logs->total(),
            'from' => $logs->firstItem(),
            'to' => $logs->lastItem(),
        ]);
    }

    /**
     * Show single log.
     */
    public function show(AuditLog $auditLog): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $auditLog->load('causer', 'subject'),
        ]);
    }

    /**
     * Get statistics.
     */
    public function statistics(Request $request): JsonResponse
    {
        $stats = [
            'total' => AuditLog::count(),
            'by_event' => AuditLog::selectRaw('event, count(*) as count')
                ->groupBy('event')
                ->get(),
            'by_module' => AuditLog::selectRaw('log_name, count(*) as count')
                ->groupBy('log_name')
                ->get(),
            'last_24h' => AuditLog::where('created_at', '>=', now()->subDay())->count(),
            'last_7d' => AuditLog::where('created_at', '>=', now()->subDays(7))->count(),
            'last_30d' => AuditLog::where('created_at', '>=', now()->subDays(30))->count(),
        ];

        // Hourly activity (last 24 hours)
        $hourly = [];
        for ($i = 0; $i < 24; $i++) {
            $hour = now()->subHours($i)->format('H:00');
            $count = AuditLog::whereBetween('created_at', [
                now()->subHours($i + 1),
                now()->subHours($i),
            ])->count();
            $hourly[$hour] = $count;
        }

        $stats['hourly_activity'] = $hourly;

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Clear old logs.
     */
    public function clearOld(Request $request): JsonResponse
    {
        $request->validate([
            'days' => 'required|integer|min:1|max:365',
        ]);

        dd($request->days);
        
        $date = now()->subDays($request->days);
        $deleted = AuditLog::where('created_at', '<', $date)->delete();

        AuditLogService::log(
            description: "Se eliminaron {$deleted} registros de bitácora antiguos",
            event: 'clean',
            logName: 'audit',
            properties: ['days' => $request->days, 'deleted_count' => $deleted]
        );

        return response()->json([
            'success' => true,
            'message' => "Se eliminaron {$deleted} registros antiguos",
            'deleted_count' => $deleted,
        ]);
    }

    /**
     * Delete single log.
     */
    public function destroy(AuditLog $auditLog): JsonResponse
    {
        $auditLog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Registro eliminado correctamente',
        ]);
    }
}
