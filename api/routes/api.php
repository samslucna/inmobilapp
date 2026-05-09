<?php


use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlockController;
use App\Http\Controllers\Api\BoundaryController;
use App\Http\Controllers\Api\BuyerController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\PdfController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\RolController;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\StageController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UploadFileController;
use App\Http\Controllers\Api\XlsController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/token', function (Request $request) {
  $token = $request->session()->token();


  $token = csrf_token();

  return json_encode($token);
});


Route::middleware(['auth:sanctum'])->group(function () {


  Route::get('/logout', [AuthController::class, 'logout']);
  Route::get('/users/search', [UserController::class, 'search']);
  Route::apiResource('/users', UserController::class);


  Route::get('/properties/search', [PropertyController::class, 'search']);
  Route::get('/properties/{id}/boundaries', [PropertyController::class, 'boundariesByProperty']);
  Route::apiResource('/properties', PropertyController::class);

  Route::get('/rols/search', [RolController::class, 'search']);
  Route::apiResource('/rols', RolController::class);

   Route::get('/boundaries/search', [BoundaryController::class, 'search']);
  Route::apiResource('/boundaries', BoundaryController::class);

  Route::get('/projects/search', [ProjectController::class, 'search']);

  Route::apiResource('/projects', ProjectController::class);
  Route::get('/projects/{id}/stages', [StageController::class, 'stagesByProject']);

  Route::get('/stages/search', [StageController::class, 'search']);
  Route::apiResource('/stages', StageController::class);
  Route::get('/stages/{id}/blocks', [BlockController::class, 'blockByStage']);

  Route::get('/blocks/search', [BlockController::class, 'search']);
  Route::apiResource('/blocks', BlockController::class);

  Route::get('/permission/search', [PermissionController::class, 'search']);
  Route::apiResource('/permission', PermissionController::class);


  Route::get('/buyers/search', [BuyerController::class, 'search']);
  Route::apiResource('/buyers', BuyerController::class);

  Route::get('/sellers/search', [SellerController::class, 'search']);
  Route::apiResource('/sellers', SellerController::class);

  Route::get('/agents/search', [AgentController::class, 'search']);
  Route::apiResource('/agents', AgentController::class);

  Route::get('/tickets/search', [TicketController::class, 'search']);
  Route::apiResource('/tickets', TicketController::class);

  Route::get('/contracts/search', [ContractController::class, 'search']);
  Route::apiResource('/contracts', ContractController::class);


  Route::apiResource('/upload_files', UploadFileController::class);
  //exports excel tickets
  Route::post('/tickets/uploadfile', [UploadFileController::class, "uploadFile"]);
  Route::get('/tickets/export/xls/acountclient', [XlsController::class, "exportAcountClient"]);
  Route::get('/tickets/export/xls/date', [XlsController::class, "exportTicketsByDate"]);
  Route::get('/tickets/export/xls', [XlsController::class, "exportTickets"]);
  Route::post('/tickets/import', [XlsController::class, "importTickets"]);
  Route::get('/tickets/export/pdf/exportticket', [PdfController::class, 'exportTicketPDF']);

  //exports excel contracts
  Route::get('/contracts/export/pdf/contractExportPDF', [PdfController::class, 'contractExportPDF']);
  Route::get('/contracts/export/pdf/ticketsPDF', [PdfController::class, 'ticketsPDF']);
  Route::get('/contracts/export/xls', [XlsController::class, "exportContracts"]);
  Route::post('/contracts/import', [XlsController::class, "importContracts"]);


  //exports excel agents
  Route::get('/agents/export/xls', [XlsController::class, "exportAgents"]);
  Route::post('/agents/import', [XlsController::class, "importAgents"]);


  //exports excel sellers
  Route::get('/sellers/export/xls', [XlsController::class, "exportSellers"]);

  Route::post('/sellers/import', [XlsController::class, "importSellers"]);


  //exports excel buyers
  Route::get('/buyers/export/xls', [XlsController::class, "exportBuyers"]);
  Route::post('/buyers/import', [XlsController::class, "importBuyers"]);


  //exports excel properties
  Route::get('/properties/export/xls', [XlsController::class, "export"]);
  Route::post('/properties/import', [XlsController::class, "importProperty"]);
});
