<?php

namespace App\Http\Controllers\Api;

use App\Exports\AgentsExport;
use App\Exports\BuyersExport;
use App\Exports\ContractsExport;
use App\Exports\PropertiesExport;
use App\Exports\SellersExport;
use App\Exports\TicketsByBuyerExport;
use App\Exports\TicketsByDateExport;
use App\Exports\TicketsExport;
use App\Http\Controllers\Controller;
use App\Imports\AgentsImport;
use App\Imports\BuyersImport;
use App\Imports\ContractsImport;
use App\Imports\PropertiesImport;
use App\Imports\PropertyImport;
use App\Imports\SellersImport;
use App\Imports\TicketsImport;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;
use PhpOffice\PhpSpreadsheet\IOFactory;

use Illuminate\Support\Facades\DB;

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
            'file' => 'required|mimes:xlsx,xls',
        ]);

        // Get the uploaded file
        $file = $request->file('file');

        // Process the Excel file
        Excel::import(new ContractsImport, $file);

        $response['message'] = "Importacion satisfactoria";
        $response['success'] = true;

        return $response;
    }

    public function importTickets(Request $request)
    {
        //dd($request);
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        // Get the uploaded file
        $file = $request->file('file');

        // Process the Excel file
        Excel::import(new TicketsImport, $file);

        $response['message'] = "Importacion satisfactoria";
        $response['success'] = true;

        return $response;
    }
    public function exportTickets()
    {
        //
        Excel::store(new TicketsExport, 'GralTickets.xlsx');

        return response()->file(storage_path() . '/app/private/GralTickets.xlsx');
    }

    public function exportTicketsByDate(Request $request)
    {
        //
        //dd($request['dates']);

        Excel::store(new TicketsByDateExport($request['dates'], $request['datee']), 'GralDateTickets.xlsx');

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
