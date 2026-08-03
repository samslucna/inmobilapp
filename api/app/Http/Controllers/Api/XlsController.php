<?php

namespace App\Http\Controllers\Api;

use App\Exports\AgentsExport;
use App\Exports\BuyersExport;
use App\Exports\ContractsExport;
use App\Exports\PropertiesExport;
use App\Exports\SellersExport;
use App\Exports\TicketsByDateExport;
use App\Exports\TicketsExport;
use App\Http\Controllers\Controller;
use App\Imports\AgentsImport;
use App\Imports\BuyersImport;
use App\Imports\PropertiesImport;
use App\Imports\ContractsImport;
use App\Imports\PropertyImport;
use App\Imports\BlocksImport;
use App\Imports\SellersImport;
use App\Imports\TicketsImport;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Style\Color;
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
                'success_count' => $successCount,
                'error_count'   => $errorCount,
                'failed_rows'   => $failedRows, // Contiene: row, attribute, errors, values
                'general_errors'=> $import->getErrors() // Captura excepciones o errores graves de BD
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
        if ($request->has('stage_id') && $request->stage_id) {
            $query->where('b.stage_id', $request->stage_id);
        }

        // Filtro 6: Por manzana específica
        if ($request->has('block_id') && $request->block_id) {
            $query->where('b.id', $request->block_id);
        }

        $query->when($request->input('dates')['date_init'] && $request->input('dates')['date_end'], function ($q) use ($request) {
            //dd($request->input('dates')['date_init']);
            $q->whereBetween('c.date', [
                $request->input('dates')['date_init'],
                $request->input('dates')['date_end']

            ]);
        });
        // Obtenemos todos los registros correspondientes para el reporte (sin paginar en base de datos)
        $properties = $query->get();

        // 3. Inicializar PhpSpreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Lotes');
        // Asegurar que las líneas de cuadrícula sean visibles
        $sheet->setShowGridlines(true);

        // 4. DISEÑO DEL ENCABEZADO CORPORATIVO
        // Nombre de la Empresa
        $sheet->mergeCells('A1:H1');
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->setCellValue('A1', 'Motsakki-Tju ');
        $sheet->getStyle('A1')->getFont()->setName('Arial')->setSize(14)->setBold(true);

 
        // Título del Reporte
        $sheet->mergeCells('A2:H2');
        $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->setCellValue('A2', 'REPORTE DE LOTES ');
        $sheet->getStyle('A2')->getFont()->setName('Arial')->setSize(10)->setBold(true)->getColor()->setRGB('4A5568');


        // Bloque informativo de Filtros Aplicados
        $sheet->mergeCells('A4:H4');
        $sheet->getStyle('A4')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $textoFiltros = "Filtros : -> Estado: " . implode(', ', array_keys(array_filter($request->input('status'))) ?? 'Todos') . " | Manzana: " . $request->input('block_id') ?? 'Todos' . " | Rango: " . ucfirst(implode(', ', array_keys(array_filter($request->input('dates')))) ?? 'Todos') . " | Proyecto: " . $request->input('project_id') ?? 'Todos' . " | Etapa: " . $request->input('stage_id') ?? 'Todas';
        $sheet->setCellValue('A4', $textoFiltros);
        $sheet->getStyle('A4')->getFont()->setName('Arial')->setSize(9)->setItalic(true);
        $sheet->getStyle('A4')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('F7FAFC');
        $sheet->getStyle('A4')->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setRGB('E2E8F0');

        // 5. CABECERA DE LA TABLA DE DATOS (Fila 6)
        $headers = ['ID', 'Propiedad', 'Manzana', 'Estado', 'Precio Inicial', 'Total Tickets', 'Saldo Actual', 'Fecha Contrato'];
        $sheet->fromArray($headers, null, 'A6');

        // Estilos para la Cabecera de la tabla
        $styleHeader = [
            'font' => [
                'name' => 'Arial',
                'bold' => true,
                'size' => 10,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '2B6CB0'], // El mismo azul corporativo del PDF
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ];
        $sheet->getStyle('A6:H6')->applyFromArray($styleHeader);
        $sheet->getRowDimension('6')->setRowHeight(25);
        // 6. LLENADO DE LOS REGISTROS (Inicia en fila 7)
        $rowIdx = 7;
        foreach ($properties as $property) {
            $sheet->setCellValue('A' . $rowIdx, $property->id);
            $sheet->setCellValue('B' . $rowIdx, $property->name);
            $sheet->setCellValue('C' . $rowIdx, $property->manzana);
            $sheet->setCellValue('D' . $rowIdx, ucfirst($property->status));

            // Insertamos los montos como valores numéricos puros (para que Excel los pueda operar matemáticamente)
            $sheet->setCellValue('E' . $rowIdx, (float)$property->amount_init);
            $sheet->setCellValue('F' . $rowIdx, (float)$property->total_pagado);
            $sheet->setCellValue('G' . $rowIdx, (float)$property->saldo);

            // Fecha de contrato
            $sheet->setCellValue('H' . $rowIdx, $property->fecha_contrato ?: 'N/A');

            // Formatear alineación de celdas por fila
            $sheet->getStyle('A' . $rowIdx)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('D' . $rowIdx)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('H' . $rowIdx)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            // Aplicar formato de moneda contable ($#,##0.00) a las columnas E, F y G
            $sheet->getStyle("E{$rowIdx}:G{$rowIdx}")->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_CURRENCY_USD_SIMPLE);

            // Agregar un borde inferior sutil a la fila de datos
            $sheet->getStyle("A{$rowIdx}:H{$rowIdx}")->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->getColor()->setRGB('E2E8F0');

            $rowIdx++;
        }

        // 7. FILA DE TOTALES GENERALES (Fórmulas dinámicas de Excel)
        // Fusionamos desde la columna A hasta la D para colocar el texto descriptivo
        $sheet->mergeCells("A{$rowIdx}:D{$rowIdx}");
        $sheet->setCellValue("A{$rowIdx}", 'TOTALES GENERALES ');

        // Escribimos las fórmulas de SUM nativas de Excel utilizando los índices de inicio (7) y fin ($rowIdx - 1)
        $startRow = 7;
        $endRow = $rowIdx - 1;

        $sheet->setCellValue("E{$rowIdx}", "=SUM(E{$startRow}:E{$endRow})");
        $sheet->setCellValue("F{$rowIdx}", "=SUM(F{$startRow}:F{$endRow})");
        $sheet->setCellValue("G{$rowIdx}", "=SUM(G{$startRow}:G{$endRow})");
        $sheet->setCellValue("H{$rowIdx}", ''); // Celda de fecha de contrato vacía para el total

        // Estilos para la fila de Totales
        $styleTotales = [
            'font' => [
                'name' => 'Arial',
                'bold' => true,
                'size' => 10,
                'color' => ['rgb' => '1A202C'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'EDF2F7'], // Gris claro de cierre financiero
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_RIGHT,
            ],
            'borders' => [
                'top' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'A0AEC0'],
                ],
                'bottom' => [
                    'borderStyle' => Border::BORDER_DOUBLE, // Doble línea inferior tradicional contable
                    'color' => ['rgb' => 'A0AEC0'],
                ],
            ]
        ];

        // Aplicamos el estilo a toda la fila de cierre
        $sheet->getStyle("A{$rowIdx}:H{$rowIdx}")->applyFromArray($styleTotales);
        // Alineamos al centro la celda H vacía por estética
        $sheet->getStyle("H{$rowIdx}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        // Aplicamos formato de moneda a los resultados de las fórmulas
        $sheet->getStyle("E{$rowIdx}:G{$rowIdx}")->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_CURRENCY_USD_SIMPLE);
        $sheet->getRowDimension($rowIdx)->setRowHeight(22);

        // 8. AUTO-AJUSTAR EL ANCHO DE LAS COLUMNAS AUTOMÁTICAMENTE
        foreach (range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setAutosize(true);
        }

        // 9. CONFIGURACIÓN DE DESCARGA DIRECTA POR EL NAVEGADOR
        $fileName = 'Reporte_Propiedades_' . date('Y-m-d') . '.xlsx';

        return response()->stream(
            function () use ($spreadsheet) {
                $writer = new Xlsx($spreadsheet);
                $writer->save('php://output');
            },
            200,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
                'Cache-Control' => 'max-age=0',
            ]
        );
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


    public function exportTickets()
    {
        //
        Excel::store(new TicketsExport, 'GralTickets.xlsx');

        return response()->file(storage_path() . '/app/private/GralTickets.xlsx');
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
