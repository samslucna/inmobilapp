<?php

// routes/api.php

use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlockController;
use App\Http\Controllers\Api\BoundaryController;
use App\Http\Controllers\Api\BuyerController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PdfController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\StageController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UploadFileController;
use App\Http\Controllers\Api\XlsController;
use App\Http\Controllers\Api\AuditLogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ========== RUTAS PÚBLICAS ==========
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// CSRF Token (para aplicaciones SPA)
Route::get('/csrf-token', function (Request $request) {
    return response()->json([
        'csrf_token' => csrf_token()
    ]);
});

// ========== RUTAS PROTEGIDAS (Requieren autenticación) ==========
Route::middleware(['auth:sanctum'])->group(function () {

    // ------------------------------------------------------------------------
    // AUTENTICACIÓN Y USUARIO ACTUAL
    // ------------------------------------------------------------------------
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // ------------------------------------------------------------------------
    // USUARIOS
    // ------------------------------------------------------------------------
    Route::prefix('users')->group(function () {
        Route::get('/search', [UserController::class, 'search']);
        Route::get('/by-role/{roleId}', [UserController::class, 'getByRole']);
        Route::put('/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    });
    Route::apiResource('/users', UserController::class);

    // ------------------------------------------------------------------------
    // ROLES Y PERMISOS
    // ------------------------------------------------------------------------
    Route::prefix('roles')->group(function () {
        Route::get('/search', [RoleController::class, 'search']);
        Route::get('/', [RoleController::class, 'index']);
        Route::put('/update', [RoleController::class, 'updateRole']);
    });
    Route::apiResource('/roles', RoleController::class);

    // Permisos (si tienes controlador)
    // Route::apiResource('/permissions', PermissionController::class);

    // ------------------------------------------------------------------------
    // PROPIEDADES
    // ------------------------------------------------------------------------
    Route::prefix('properties')->group(function () {
        Route::get('/search', [PropertyController::class, 'search']);
        Route::get('/filterProperties', [PropertyController::class, 'propertiesContracts']);
        Route::post('/reportPropertiesPdf', [PdfController::class, 'reportPropertiesPdf']);
        Route::post('/reportAgents', [PdfController::class, 'reportAgents']);
        Route::get('/reportPropertiesXls', [XlsController::class, 'reportPropertiesXls']);
        Route::get('/{id}/boundaries', [PropertyController::class, 'boundariesByProperty']);
        Route::get('/export/xls', [XlsController::class, 'export']);
        Route::post('/import', [XlsController::class, 'importProperty']);
    });
    Route::apiResource('/properties', PropertyController::class);

    // ------------------------------------------------------------------------
    // LINDEROS (BOUNDARIES)
    // ------------------------------------------------------------------------
    Route::prefix('boundaries')->group(function () {
        Route::get('/search', [BoundaryController::class, 'search']);
    });
    Route::apiResource('/boundaries', BoundaryController::class);

    // ------------------------------------------------------------------------
    // PROYECTOS
    // ------------------------------------------------------------------------
    Route::prefix('projects')->group(function () {
        Route::get('/search', [ProjectController::class, 'search']);
        Route::get('/{id}/stages', [StageController::class, 'stagesByProject']);
    });
    Route::apiResource('/projects', ProjectController::class);

    // ------------------------------------------------------------------------
    // ETAPAS
    // ------------------------------------------------------------------------
    Route::prefix('stages')->group(function () {
        Route::get('/search', [StageController::class, 'search']);
        Route::get('/{id}/blocks', [BlockController::class, 'blockByStage']);
    });
    Route::apiResource('/stages', StageController::class);

    // ------------------------------------------------------------------------
    // MANZANAS (BLOCKS)
    // ------------------------------------------------------------------------
    Route::prefix('blocks')->group(function () {
        Route::get('/search', [BlockController::class, 'search']);
    });
    Route::apiResource('/blocks', BlockController::class);

    // ------------------------------------------------------------------------
    // COMPRADORES (BUYERS)
    // ------------------------------------------------------------------------
    Route::prefix('buyers')->group(function () {
        Route::get('/search', [BuyerController::class, 'search']);
        Route::get('/export/xls', [XlsController::class, 'exportBuyers']);
        Route::post('/import', [XlsController::class, 'importBuyers']);
    });
    Route::apiResource('/buyers', BuyerController::class);

    // ------------------------------------------------------------------------
    // VENDEDORES (SELLERS)
    // ------------------------------------------------------------------------
    Route::prefix('sellers')->group(function () {
        Route::get('/search', [SellerController::class, 'search']);
        Route::get('/export/xls', [XlsController::class, 'exportSellers']);
        Route::post('/import', [XlsController::class, 'importSellers']);
    });
    Route::apiResource('/sellers', SellerController::class);

    // ------------------------------------------------------------------------
    // AGENTES
    // ------------------------------------------------------------------------
    Route::prefix('agents')->group(function () {
        Route::get('/search', [AgentController::class, 'search']);
        Route::get('/export/xls', [XlsController::class, 'exportAgents']);
        Route::post('/import', [XlsController::class, 'importAgents']);
    });
    Route::apiResource('/agents', AgentController::class);

    // ------------------------------------------------------------------------
    // TICKETS
    // ------------------------------------------------------------------------
    Route::prefix('tickets')->group(function () {
        Route::post('/search', [TicketController::class, 'search']);
        Route::post('/uploadfile', [UploadFileController::class, 'uploadFile']);
        Route::get('/export/xls/acountclient', [XlsController::class, 'exportAcountClient']);
        Route::get('/export/xls/date', [XlsController::class, 'exportTicketsByDate']);
        Route::get('/export/xls', [XlsController::class, 'exportTickets']);
        Route::post('/import', [XlsController::class, 'importTickets']);
        Route::post('/export/pdf/ticket', [PdfController::class, 'exportTicketPDF']);
    });
    Route::apiResource('/tickets', TicketController::class);

    // ------------------------------------------------------------------------
    // CONTRATOS
    // ------------------------------------------------------------------------
    //Route::prefix('contracts')->group(function () {
    //    Route::get('/search', [ContractController::class, 'search']);
    //    Route::get('/export/pdf/contractExportPDF', [PdfController::class, 'contractExportPDF']);
    //    Route::get('/export/pdf/ticketsPDF', [PdfController::class, 'ticketsPDF']);
    //    Route::get('/export/xls', [XlsController::class, 'exportContracts']);
    //    Route::post('/import', [XlsController::class, 'importContracts']);
    //});
    // Rutas de contratos
    Route::prefix('contracts')->group(function () {
        Route::get('/', [ContractController::class, 'index']);
        Route::post('/', [ContractController::class, 'store']);
        Route::post('/search', [ContractController::class, 'search']);
        Route::get('/statistics', [ContractController::class, 'statistics']);
        Route::get('/export', [ContractController::class, 'export']);
        Route::post('/export/pdf/ticketsPDF', [PdfController::class, 'ticketsPDF']);
        Route::post('/export/pdf/contractExportPDF', [PdfController::class, 'contractExportPDF']);
        Route::post('/reportAgentsContractsPdf', [PdfController::class, 'reportAgentsContractsPdf']);
        Route::post('/filterAgents', [PropertyController::class, 'searchAgentsByContracts']);
        Route::get('/status/{status}', [ContractController::class, 'getByStatus']);
        Route::get('/{id}', [ContractController::class, 'show']);
        Route::put('/{id}', [ContractController::class, 'update']);
        Route::delete('/{id}', [ContractController::class, 'destroy']);
        Route::post('/import', [XlsController::class, 'importContracts']);
    });
    Route::apiResource('/contracts', ContractController::class);

    // ------------------------------------------------------------------------
    // ARCHIVOS
    // ------------------------------------------------------------------------
    Route::apiResource('/upload_files', UploadFileController::class);

    // ------------------------------------------------------------------------
    // DASHBOARD
    // ------------------------------------------------------------------------
    Route::apiResource('/dashboard', DashboardController::class);

    // ------------------------------------------------------------------------
    // BITÁCORA (AUDIT LOGS)
    // ------------------------------------------------------------------------
    Route::prefix('audit')->name('audit.')->group(function () {
        // Consulta de logs (requiere permiso 'audit.read')
        Route::middleware(['permission:audit.read'])->group(function () {
            Route::get('/logs', [AuditLogController::class, 'index'])->name('index');
            Route::get('/logs/statistics', [AuditLogController::class, 'statistics'])->name('statistics');
            Route::get('/logs/{auditLog}', [AuditLogController::class, 'show'])->name('show');
            Route::get('/logs/export', [AuditLogController::class, 'export'])->name('export');
        });

        // Administración de logs (requiere permiso 'audit.delete')
        Route::middleware(['permission:audit.delete'])->group(function () {
            Route::delete('/logs/clear-old', [AuditLogController::class, 'clearOld'])->name('clear-old');
            Route::delete('/logs/{auditLog}', [AuditLogController::class, 'destroy'])->name('destroy');
        });
    });

    // Opcional: Mantener compatibilidad con rutas anteriores de logs
    Route::get('/logs', [AuditLogController::class, 'index'])->middleware('permission:audit.read');
    Route::get('/logs/statistics', [AuditLogController::class, 'statistics'])->middleware('permission:audit.read');
    Route::get('/logs/{auditLog}', [AuditLogController::class, 'show'])->middleware('permission:audit.read');
    Route::delete('/logs/clear-old', [AuditLogController::class, 'clearOld'])->middleware('permission:audit.delete');
    Route::delete('/logs/{auditLog}', [AuditLogController::class, 'destroy'])->middleware('permission:audit.delete');
});
