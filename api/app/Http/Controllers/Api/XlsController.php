<?php

namespace App\Http\Controllers\Api;

use App\Exports\AgentsExport;
use App\Exports\BuyersExport;
use App\Exports\ContractsExport;
use App\Exports\PropertiesExport;
use App\Exports\SellersExport;
use App\Exports\TicketsByDateExport;
use App\Exports\TicketsXlsExport;
use App\Http\Controllers\Controller;
use App\Imports\AgentsImport;
use App\Imports\BuyersImport;
use App\Imports\PropertiesImport;
use App\Imports\ContractsImport;
use App\Imports\PropertyImport;
use App\Imports\BlocksImport;
use App\Imports\BoundaryImport;
use App\Imports\SellersImport;
use App\Imports\TicketsImport;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Jobs\ImportTicketsJob;

class XlsController extends Controller
{
    //

    public function export()
    {
        //
        Excel::store(new PropertiesExport, 'GralLotes.xlsx');

        return response()->file(storage_path() . '/app/private/GralLotes.xlsx');
    }

    public function import(Request $request)
    {
        //dd($request);
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        // Get the uploaded file
        $file = $request->file('file');

        // Process the Excel file
        Excel::import(new PropertiesImport, $file);

        $response['message'] = "Importacion satisfactoria";
        $response['success'] = true;

        return $response;
    }


    public function importBlocks(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        // 2. Instanciar la clase de importación
        $import = new BlocksImport();

        try {
            // 3. Ejecutar la importación de manera síncrona
            $import->import($request->file('file'));

            // 4. Armar la respuesta estructurada
            $failedRows = $import->getFailedRows();
            $errorCount = $import->getErrorCount();
            $successCount = $import->getSuccessCount();

            return response()->json([
                'message'       => 'Proceso de importación finalizado.',
                'success_count' =>  $successCount,
                'error_count'   =>  $errorCount,
                'failed_rows'   =>  $failedRows, // Contiene: row, attribute, errors, values
                'general_errors' => $import->getErrors() // Captura excepciones o errores graves de BD
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error crítico durante la importación.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }




    public function reportPropertiesXls(Request $request)
    {
        return Excel::download(new PropertiesExport($request), 'Reporte_Lotes_' . date('Y-m-d') . '.xlsx');
    }

    public function exportTickets(Request $request)
    {
        //
        return Excel::download(new TicketsXlsExport($request), 'Reporte_recibos_' . date('Y-m-d') . '.xlsx');

        
    }

    public function importProperty(Request $request)
    {
        //dd($request);
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240'
        ]);

        try {
            // 2. Pasamos la instancia al método import
            DB::beginTransaction();

            $import = new PropertyImport();
            Excel::import($import, $request->file('file'));

            DB::commit();

            $mesage = $import->getErrorCount() === 0 ? 'Importación completada' : 'Errores al importar datos';

            return response()->json([
                'message' => $mesage,
                'success_count' => $import->getSuccessCount(),
                'error_count' => $import->getErrorCount(),
                'errors' => $import->getErrors()
            ], 200);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'message' => 'Error en la importación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function exportBuyers()
    {
        //
        Excel::store(new BuyersExport, 'GralClientes.xlsx');

        return response()->file(storage_path() . '/app/private/GralClientes.xlsx');
    }

    public function importBuyers(Request $request)
    {
        //dd($request);
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240'
        ]);

        try {
            // 2. Pasamos la instancia al método import
            DB::beginTransaction();

            $import = new BuyersImport();
            Excel::import($import, $request->file('file'));

            DB::commit();

            $mesage = $import->getErrorCount() === 0 ? 'Importación completada' : 'Errores al importar datos';

            return response()->json([
                'message' => $mesage,
                'success_count' => $import->getSuccessCount(),
                'error_count' => $import->getErrorCount(),
                'errors' => $import->getErrors()
            ], 200);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'message' => 'Error en la importación',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function importBoundaries(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240'
        ]);

        try {
            // 2. Pasamos la instancia al método import
            DB::beginTransaction();
            $import = new BoundaryImport();
            Excel::import($import, $request->file('file'));

            DB::commit();

            $mesage = $import->getErrorCount() === 0 ? 'Importación completada' : 'Errores al importar datos';

            return response()->json([
                'message' => $mesage,
                'success_count' => $import->getSuccessCount(),
                'error_count' => $import->getErrorCount(),
                'errors' => $import->getErrors()
            ], 200);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'message' => 'Error en la importación',
                'error' => $e->getMessage()
            ], 500);
        }
    }




    public function exportSellers()
    {
        //
        Excel::store(new SellersExport, 'GralPropietarios.xlsx');

        return response()->file(storage_path() . '/app/private/GralPropietarios.xlsx');
    }

    public function importSellers(Request $request)
    {
        //dd($request);
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        // Get the uploaded file
        $file = $request->file('file');

        // Process the Excel file
        Excel::import(new SellersImport, $file);

        $response['message'] = "Importacion satisfactoria";
        $response['success'] = true;

        return $response;
    }


    public function exportAgents()
    {
        //
        Excel::store(new AgentsExport, 'GralAgentesdeVentas.xlsx');

        return response()->file(storage_path() . '/app/private/GralAgentesdeVentas.xlsx');
    }

    public function importAgents(Request $request)
    {
        //dd($request);
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        // Get the uploaded file
        $file = $request->file('file');

        // Process the Excel file
        Excel::import(new AgentsImport, $file);

        $response['message'] = "Importacion satisfactoria";
        $response['success'] = true;

        return $response;
    }


    public function exportContracts()
    {
        //
        Excel::store(new ContractsExport, 'GralContratos.xlsx');

        return response()->file(storage_path() . '/app/private/GralContratos.xlsx');
    }

    public function importContracts(Request $request)
    {

        //dd($request);
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240'
        ]);

        try {
            // 2. Pasamos la instancia al método import
            DB::beginTransaction();

            $import = new ContractsImport();
            Excel::import($import, $request->file('file'));

            DB::commit();

            $mesage = $import->getErrorCount() === 0 ? 'Importación completada' : 'Errores al importar datos';

            return response()->json([
                'message' => $mesage,
                'success_count' => $import->getSuccessCount(),
                'error_count' => $import->getErrorCount(),
                'errors' => $import->getErrors()
            ], 200);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'message' => 'Error en la importación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function importTickets(Request $request)
    {

        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:102400',
        ]);

        try {
            $import = new TicketsImport();

            // Configurar límites
            set_time_limit(300);
            ini_set('memory_limit', '2G');

            // Importar con el chunk configurado
            Excel::import($import, $request->file('file'));

            $summary = $import->getSummary();

            return response()->json([
                'success' => true,
                'message' => 'Importación completada',
                'data' => $summary
            ]);
        } catch (\Exception $e) {
            Log::error('Error en importación: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al importar: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Importación con Job en background para 1000+ registros
     */
    public function importBackground(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:102400',
        ]);

        try {
            $filePath = $request->file('file')->store('imports/tickets');

            // Despachar Job
            dispatch(new ImportTicketsJob($filePath));

            return response()->json([
                'success' => true,
                'message' => 'La importación se está procesando en segundo plano',
                'file' => $filePath
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al iniciar importación: ' . $e->getMessage()
            ], 500);
        }
    }


    

    public function exportTicketsByDate(Request $request)
    {
        //dd($request);

        Excel::store(new TicketsByDateExport($request['date_init'], $request['date_end']), 'GralDateTickets.xlsx');

        return response()->file(storage_path() . '/app/private/GralDateTickets.xlsx');
    }

    public function exportAcountClient(Request $request)
    {
        //
        //dd($request);
        $spreadsheet = IOFactory::load(public_path('reports/') . 'estadocuentaclient-1748301590.xlsx');
        $spreadsheet->getProperties()
            ->setCreator("Samuel S. Lucena")
            ->setLastModifiedBy("Samuel S. Lucena")
            ->setTitle("EstadoCuentaCliente")
            ->setSubject("Office 2007 XLSX Test Document")
            ->setDescription(
                "Documento que muestra  el estado de cuenta de los clientes."
            )
            ->setKeywords("office 2007 openxml php")
            ->setCategory("Test result file");

        $spreadsheet->setActiveSheetIndex(0);


        $spreadsheet->getActiveSheet()
            ->setCellValue('C2', time())
            ->setCellValue('G2', $request->id)
            ->setCellValue('C4', $request->buyer['id'] . ' - ' . $request->property['name'] . ' ' . $request->buyer['lastnames'])
            ->setCellValue('H3', 'Tacamandapio')
            ->setCellValue('K3', Carbon::now())
            ->setCellValue('K4', $request->datecontract)
            ->setCellValue('C5', $request->property['id'] . ' - ' . $request->property['name'])
            ->setCellValue('G5', $request->plazo)
            ->setCellValue('J5', 'status');
        // Assign the Active Worksheet (Sheet1) to $worksheet1
        //$worksheet1 = $spreadsheet->getActiveSheet();
        // Create a new Worksheet (Sheet2) and make that the Active Worksheet
        //$worksheet2 = $spreadsheet->createSheet();

        for ($i = 0; $i  < count($request->tickets); $i++) {

            if ($i < 12) {
                $spreadsheet->getActiveSheet()->setCellValue('C' . ($i + 8), $request->tickets[$i]['datepay'])
                    ->setCellValue('D' . ($i + 8), $request->tickets[$i]['amount']);
            } else if ($i > 11 && $i < 24) {
                $j = $i - 12;
                $spreadsheet->getActiveSheet()->setCellValue('F' . ($j + 8), $request->tickets[$i]['datepay'])
                    ->setCellValue('G' . ($j + 8), $request->tickets[$i]['amount']);
            } else if ($i > 23 && $i < 36) {
                $j = ($i - 24);
                $spreadsheet->getActiveSheet()->setCellValue('I' . ($j + 8), $request->tickets[$i]['datepay'])
                    ->setCellValue('J' . ($j + 8), $request->tickets[$i]['amount']);
            }
        }


        $writer = IOFactory::createWriter($spreadsheet, "Xlsx");
        $writer->save(public_path('exports') . "EstadoCuentaC.xlsx");

        return response()->file(public_path('exports') . "EstadoCuentaC.xlsx");
    }
}
