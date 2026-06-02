<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Codedge\Fpdf\Fpdf\Fpdf;

// 1. Extendemos FPDF para personalizar Encabezado y Pie de Página de forma limpia
class CustomPDF extends Fpdf
{
    protected $filters;
    protected $userName;

    public function __construct($filters, $userName)
    {
        parent::__construct('L', 'mm', 'A4'); // Configurado en Orientación Horizontal (Landscape) para las columnas
        $this->filters = $filters;
        $this->userName = $userName;
    }

    // Encabezado Automático
    public function Header()
    {
        if (file_exists(public_path('images/logo.jpeg'))) {
            $this->Image(public_path('images/logo.jpeg'), 15, 10, 25, 0);
        }

        if (file_exists(public_path('images/logo_derecho.png'))) {
            // El ancho de A4 Horizontal es 297mm. Margen derecho 15mm, restamos 30mm de ancho = 252mm
            $this->Image(public_path('images/logo_derecho.png'), 252, 10, 30, 0);
        }
        $this->SetFont('Times', '', 10);
        $this->Cell(0, 10, utf8_decode('Sistema Motsakki-Tju'), 0, 0, 'R');
        // --- 2. TEXTOS CENTRALES (Empresa y Título) ---
        $this->SetY(10); // Nos posicionamos verticalmente a la altura del inicio de los logos

        // Nombre de la Empresa Centrado
        $this->SetFont('Times', 'B', 14);
        $this->SetTextColor(56, 161, 105); // Azul Corporativo
        $this->Cell(0, 8, utf8_decode('Motsakki-Tju'), 0, 1, 'C');

        // Subtítulo / Nombre del Reporte Centrado
        $this->SetFont('Times', 'B', 10);
        $this->SetTextColor(74, 85, 104); // Gris Oscuro
        $this->Cell(0, 6, utf8_decode('REPORTE DE LOTES'), 0, 1, 'C');
        $this->Ln(5); // Espacio de separación para los filtros

        // --- 3. REJILLA DE FILTROS DINÁMICOS ---
        // Configuración de estilos para la barra de filtros
        $this->SetFont('Arial', '', 8.5);
        $this->SetFillColor(252, 252, 252); // Fondo gris muy claro e institucional (#f7fafc)
        $this->SetDrawColor(226, 232, 240); // Bordes suaves gris claro (#e2e8f0)
        $this->SetTextColor(45, 55, 72);

        // Fila 1 de Filtros (Ancho total disponible entre márgenes = 267mm)
        // Cada celda se divide proporcionalmente
        $this->SetFont('Arial', 'B', 8.5);
        $this->Cell(25, 6, 'Proyecto: ', 'TLB', 0, 'L', true);
        $this->SetFont('Arial', '', 8.5);
        $this->Cell(64, 6, utf8_decode($this->filters['proyecto']), 'TRB', 0, 'L', true);

        $this->SetFont('Arial', 'B', 8.5);
        $this->Cell(20, 6, 'Etapa: ', 'TLB', 0, 'L', true);
        $this->SetFont('Arial', '', 8.5);
        $this->Cell(64, 6, utf8_decode($this->filters['etapa']), 'TRB', 0, 'L', true);

        $this->SetFont('Arial', 'B', 8.5);
        $this->Cell(25, 6, 'Manzana: ', 'TLB', 0, 'L', true);
        $this->SetFont('Arial', '', 8.5);
        $this->Cell(69, 6, utf8_decode($this->filters['manzana']), 'TRB', 1, 'L', true);

        // Fila 2 de Filtros (Fechas y Estado)
        $this->SetFont('Arial', 'B', 8.5);
        $this->Cell(25, 6, 'Desde: ', 'TLB', 0, 'L', true);
        $this->SetFont('Arial', '', 8.5);
        $this->Cell(35, 6, $this->filters['desde'], 'TRB', 0, 'L', true);

        $this->SetFont('Arial', 'B', 8.5);
        $this->Cell(15, 6, 'Hasta: ', 'TLB', 0, 'L', true);
        $this->SetFont('Arial', '', 8.5);
        $this->Cell(39, 6, $this->filters['hasta'], 'TRB', 0, 'L', true);

        $this->SetFont('Arial', 'B', 8.5);
        $this->Cell(25, 6, 'Estado: ', 'TLB', 0, 'L', true);

        // Estilo especial dinámico para el texto del Estado destacado
        $this->SetFont('Arial', 'B', 8.5);
        $estado = strtolower($this->filters['status']);

        if ($estado === 'vendido') $this->SetTextColor(229, 62, 62);     // Rojo
        elseif ($estado === 'disponible') $this->SetTextColor(56, 161, 105);  // Verde
        elseif ($estado === 'apartado') $this->SetTextColor(221, 107, 32); // Naranja
        else $this->SetTextColor(49, 151, 149);                           // Azul/Verde para Disponible

        $this->Cell(128, 6, utf8_decode(ucfirst($this->filters['status'])), 'TRB', 1, 'L', true);

        $this->Ln(4); // Espacio antes de iniciar la tabla de datos


        // --- 4. ENCABEZADOS DE LA TABLA DE DATOS ---
        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(56, 161, 105); // Fondo Azul para cabecera de tabla
        $this->SetTextColor(255, 255, 255); // Texto Blanco
        $this->SetDrawColor(43, 108, 176);

        $this->Cell(15, 8, 'ID', 1, 0, 'C', true);
        $this->Cell(45, 8, 'Propiedad', 1, 0, 'L', true);
        $this->Cell(45, 8, 'Manzana', 1, 0, 'L', true);
        $this->Cell(30, 8, 'Estado', 1, 0, 'C', true);
        $this->Cell(33, 8, 'Precio Lote', 1, 0, 'R', true);
        $this->Cell(33, 8, 'Pagado ', 1, 0, 'R', true);
        $this->Cell(33, 8, 'Saldo ', 1, 0, 'R', true);
        $this->Cell(33, 8, 'Fecha Contrato', 1, 1, 'C', true);
    }

    // Pie de Página Automático
    public function Footer()
    {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(113, 128, 150);
        $this->Cell(135, 10, utf8_decode('Generado por: ' . $this->userName), 0, 0, 'L');
        $this->Cell(0, 10, utf8_decode('Página ' . $this->PageNo() . ' de {nb}'), 0, 0, 'R');
    }
}
class PdfController extends Controller
{


    public function contractExportPDF(Request $request)
    {


        $db  = Contract::with('buyer')->with('property')->with('tickets')->find($request->id);

        $data = [
            'title' => 'COL. MONTE TLAPA SEGUNDA ETAPA',
            'date' => date('m/d/Y'),
            'records' => $db,
            'costpropertystring' => $this->RenderNumberToWords(strval($db['property']->amount_init)),
            'partamounttxt' => $this->RenderNumberToWords(strval(($db['advance']))),
            'minum' => (($db['property']->amount_init - ($db->advance))),
            'minumtxt' => $this->RenderNumberToWords(strval(($db['property']->amount_init - ($db['advance'])))),
            'pay' => (($db['property']->amount_init - ($db['advance'])) / intval($db['plazo'])),
            'paytxt' => $this->RenderNumberToWords((($db['property']->amount_init - ($db['advance'])) / intval($db['plazo']))),
        ];

        //dd($data);


        $pdfConfig = Pdf::setOption(['dpi' => 150, 'defaultFont' => 'sans-serif']);
        $pdf = Pdf::loadView('templates/contracts/contractpdf', compact('data'))
            ->setOption(['dpi' => 150, 'defaultFont' => 'sans-serif'])->setPaper('legal', 'portrait');;

        return $pdf->stream();
    }

    public function reportPropertiesPdf(Request $request)
    {

        //dd($request->all());


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




        // Ejemplo de procesamiento en tu controlador antes de mandar a llamar al PDF:
        $filtersLabels = [
            'proyecto' => $request->input('project_id') > 0 ? 'Proyecto ' . $request->input('project_id') : 'Todos',
            'etapa'    => $request->input('stage_id') > 0 ? 'Etapa ' . $request->input('stage_id') : 'Todas',
            'manzana'  => $request->input('block_id') > 0 ? 'Manzana ' . $request->input('block_id') : 'Todas',
            'desde'    => $request->input('dates')['date_init'], // Valor por defecto o real
            'hasta'    => $request->input('dates')['date_end'],
            'status'   => $request->input('status') ? implode(', ', array_keys(array_filter($request->input('status')))) : 'Todos',
        ];

        // Obtenemos el usuario autenticado (O un fallback si es testing)
        $userName = auth()->user() ? auth()->user()->name : 'Usuario Desconocido';

        // Inicializamos nuestra clase personalizada
        $pdf = new CustomPDF($filtersLabels, $userName);
        $pdf->AliasNbPages('{nb}'); // Define el alias del total de páginas
        $pdf->AddPage(); // Esto gatilla de manera interna el método Header()

        // Cuerpo de la Tabla - Tipografía para los registros
        $pdf->SetFont('Arial', '', 8);
        $pdf->SetTextColor(45, 55, 72);

        //dd($properties);
        $granTotalPrecioInicial = 0;
        $granTotalTickets = 0;
        $granTotalSaldo = 0;

        foreach ($properties as $property) {
            $granTotalPrecioInicial += $property->amount_init;
            $granTotalTickets       += $property->total_pagado;
            $granTotalSaldo         += $property->saldo;
            // Validamos que el contenido no desborde la celda y respetamos los anchos definidos en Header()
            $pdf->Cell(15, 7, $property->id, 1, 0, 'C');
            $pdf->Cell(45, 7, utf8_decode($property->name), 1, 0, 'L');
            $pdf->Cell(45, 7, utf8_decode($property->manzana), 1, 0, 'L');
            $pdf->Cell(30, 7, ucfirst($property->status), 1, 0, 'C');
            $pdf->Cell(33, 7, '$' . number_format($property->amount_init, 2), 1, 0, 'R');
            $pdf->Cell(33, 7, '$' . number_format($property->total_pagado, 2), 1, 0, 'R');
            $pdf->Cell(33, 7, '$' . number_format($property->saldo, 2), 1, 0, 'R');
            $pdf->Cell(33, 7, isset($property->fecha_contrato) ? $property->fecha_contrato : 'N/A', 1, 1, 'C');
        }


        // FILA DE TOTALES GENERALES (Al salir del ciclo foreach)
        $pdf->SetFont('Arial', 'B', 9); // Cambiamos la fuente a Negrita
        $pdf->SetFillColor(237, 242, 247); // Fondo gris claro institucional (#edf2f7)
        $pdf->SetTextColor(26, 32, 44); // Texto casi negro para contrastar


        // Fusionamos las primeras 4 columnas (15 + 45 + 45 + 30 = 135mm) para poner la etiqueta "TOTALES"
        $pdf->Cell(135, 8, 'TOTALES GENERALES ', 1, 0, 'R', true);

        // Imprimimos las sumatorias formateadas con su respectivo ancho de columna
        $pdf->Cell(33, 8, '$' . number_format($granTotalPrecioInicial, 2), 1, 0, 'R', true);
        $pdf->Cell(33, 8, '$' . number_format($granTotalTickets, 2), 1, 0, 'R', true);
        $pdf->Cell(33, 8, '$' . number_format($granTotalSaldo, 2), 1, 0, 'R', true);

        // Dejamos la última celda vacía o con un guion bajo la columna de fecha de contrato
        $pdf->Cell(33, 8, '', 1, 1, 'C', true);

        // Retornamos el PDF para abrirse directamente en el navegador del cliente
        return response($pdf->Output('S', 'Reporte_Propiedades.pdf'))
            ->header('Content-Type', 'application/pdf');
    }

    public function exportTicketPDF(Request $request)
    {

        $db  = Ticket::find($request->id);
        $contract = Contract::with("buyer")->with("property")->find($db->contract_id);
        $datetext = $this->dateText(Carbon::parse($db["datepay"])->timestamp);

        $data = [
            'title' => 'COLONIA MONTE TLAPA',
            'date' => $datetext,
            'amount' => $db["amount"],
            "lotstage" => strtoupper($contract["property"]->block_id),
            "place" => "Tlapa de Comonfort, Guerrero",
            "received" => strtoupper($contract["buyer"]->name) . " " . strtoupper($contract["buyer"]->lastnames),
            "fortheamount" => $this->RenderNumberToWords(strval($db["amount"])),
            "concept" => strval($db["concept"]),
            "lotname" => strtoupper($contract["property"]->name),
            "lotm2" => strtoupper($contract["property"]->m2),
            "lotmz" => strtoupper($contract["property"]->block_id),
            "lotamount" => $contract["property"]->amount_init,
            "paytype" => strtoupper($db["paytype"]),
            "lotplazo" => $contract["plazo"],
            "adreessbuyer" => strtoupper($contract["buyer"]->address),
            "phonebuyer" => strtoupper($contract["buyer"]->phone),

        ];


        $pdf = Pdf::loadView('templates/ticket/ticketpdf', compact('data'))
            ->setOption(['dpi' => 150, 'defaultFont' => 'sans-serif'])->setPaper('a1', 'landscape');

        return $pdf->stream();
    }

    public function ticketsPDF(Request $request)
    {
        $db  = Contract::with('buyer')->with('seller')->with('property')->with('tickets')->find($request->id);

        $ldate = time(); // Obtiene la ldate actual en segundos desde la época Unix
        $datetext = $this->dateText($ldate);

        //dd($datetext);
        $totalAdd = $this->total($db->tickets);
        //dd($totalAdd);
        $data = [
            'title' => 'Reporte de Recibos',
            'date' => $datetext,
            'records' => $db,
            'total' => $totalAdd + $db['partamount'],
            'totalString' => $this->RenderNumberToWords(strval(($totalAdd + $db['partamount']))),

        ];

        $pdf = Pdf::loadView('templates/contracts/contractticketspdf', compact('data'));

        return $pdf->stream();
    }

    public function dateText($date)
    {

        $months = array(
            1 => 'enero',
            2 => 'febrero',
            3 => 'marzo',
            4 => 'abril',
            5 => 'mayo',
            6 => 'junio',
            7 => 'julio',
            8 => 'agosto',
            9 => 'septiembre',
            10 => 'octubre',
            11 => 'noviembre',
            12 => 'diciembre'
        );

        $days = array(
            'Sunday' => 'domingo',
            'Monday' => 'lunes',
            'Tuesday' => 'martes',
            'Wednesday' => 'miércoles',
            'Thursday' => 'jueves',
            'Friday' => 'viernes',
            'Saturday' => 'sábado'
        );

        $ldate = $date;
        $day_week = date('l', $ldate); // Día de la semana en inglés
        $day = date('d', $ldate);
        $month = date('n', $ldate); // Número del mes (sin ceros a la izquierda)
        $year = date('Y', $ldate);
        // Example: lunes, 28 de julio de 2025
        $ldate_text =  strtoupper($days[$day_week]) . ', ' . $day . ' DE ' .  strtoupper($months[$month]) . ' DEL ' . $year;
        return $ldate_text;
    }


    //Converter
    public function RenderNumberToWords($xcifra)
    {


        $xarray = array(
            0 => "Cero",
            1 => "UN",
            "DOS",
            "TRES",
            "CUATRO",
            "CINCO",
            "SEIS",
            "SIETE",
            "OCHO",
            "NUEVE",
            "DIEZ",
            "ONCE",
            "DOCE",
            "TRECE",
            "CATORCE",
            "QUINCE",
            "DIECISEIS",
            "DIECISIETE",
            "DIECIOCHO",
            "DIECINUEVE",
            "VEINTI",
            30 => "TREINTA",
            40 => "CUARENTA",
            50 => "CINCUENTA",
            60 => "SESENTA",
            70 => "SETENTA",
            80 => "OCHENTA",
            90 => "NOVENTA",
            100 => "CIENTO",
            200 => "DOSCIENTOS",
            300 => "TRESCIENTOS",
            400 => "CUATROCIENTOS",
            500 => "QUINIENTOS",
            600 => "SEISCIENTOS",
            700 => "SETECIENTOS",
            800 => "OCHOCIENTOS",
            900 => "NOVECIENTOS"
        );
        //
        $xcifra = trim($xcifra);
        $xlength = strlen($xcifra);
        $xpos_punto = strpos($xcifra, ".");
        $xaux_int = $xcifra;
        $xdecimales = "00";
        if (!($xpos_punto === false)) {
            if ($xpos_punto == 0) {
                $xcifra = "0" . $xcifra;
                $xpos_punto = strpos($xcifra, ".");
            }
            $xaux_int = substr($xcifra, 0, $xpos_punto); // obtengo el entero de la cifra a covertir
            $xdecimales = substr($xcifra . "00", $xpos_punto + 1, 2); // obtengo los valores decimales
        }

        $XAUX = str_pad($xaux_int, 18, " ", STR_PAD_LEFT); // ajusto la longitud de la cifra, para que sea divisible por centenas de miles (grupos de 6)
        $xcadena = "";
        for ($xz = 0; $xz < 3; $xz++) {
            $xaux = substr($XAUX, $xz * 6, 6);
            $xi = 0;
            $xlimite = 6; // inicializo el contador de centenas xi y establezco el límite a 6 dígitos en la parte entera
            $xexit = true; // bandera para controlar el ciclo del While
            while ($xexit) {
                if ($xi == $xlimite) { // si ya llegó al límite máximo de enteros
                    break; // termina el ciclo
                }

                $x3digitos = ($xlimite - $xi) * -1; // comienzo con los tres primeros digitos de la cifra, comenzando por la izquierda
                $xaux = substr($xaux, $x3digitos, abs($x3digitos)); // obtengo la centena (los tres dígitos)
                for ($xy = 1; $xy < 4; $xy++) { // ciclo para revisar centenas, decenas y unidades, en ese orden
                    switch ($xy) {
                        case 1: // checa las centenas
                            if (substr($xaux, 0, 3) < 100) { // si el grupo de tres dígitos es menor a una centena ( < 99) no hace nada y pasa a revisar las decenas

                            } else {
                                $key = (int) substr($xaux, 0, 3);
                                if (TRUE === array_key_exists($key, $xarray)) {  // busco si la centena es número redondo (100, 200, 300, 400, etc..)
                                    $xseek = $xarray[$key];
                                    $xsub = $this->subfijo($xaux); // devuelve el subfijo correspondiente (Millón, Millones, Mil o nada)
                                    if (substr($xaux, 0, 3) == 100)
                                        $xcadena = " " . $xcadena . " CIEN " . $xsub;
                                    else
                                        $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                    $xy = 3; // la centena fue redonda, entonces termino el ciclo del for y ya no reviso decenas ni unidades
                                } else { // entra aquí si la centena no fue numero redondo (101, 253, 120, 980, etc.)
                                    $key = (int) substr($xaux, 0, 1) * 100;
                                    $xseek = $xarray[$key]; // toma el primer caracter de la centena y lo multiplica por cien y lo busca en el arreglo (para que busque 100,200,300, etc)
                                    $xcadena = " " . $xcadena . " " . $xseek;
                                } // ENDIF ($xseek)
                            } // ENDIF (substr($xaux, 0, 3) < 100)
                            break;
                        case 2: // checa las decenas (con la misma lógica que las centenas)
                            if (substr($xaux, 1, 2) < 10) {
                            } else {
                                $key = (int) substr($xaux, 1, 2);
                                if (TRUE === array_key_exists($key, $xarray)) {
                                    $xseek = $xarray[$key];
                                    $xsub = $this->subfijo($xaux);
                                    if (substr($xaux, 1, 2) == 20)
                                        $xcadena = " " . $xcadena . " VEINTE " . $xsub;
                                    else
                                        $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                    $xy = 3;
                                } else {
                                    $key = (int) substr($xaux, 1, 1) * 10;
                                    $xseek = $xarray[$key];
                                    if (20 == substr($xaux, 1, 1) * 10)
                                        $xcadena = " " . $xcadena . " " . $xseek;
                                    else
                                        $xcadena = " " . $xcadena . " " . $xseek . " Y ";
                                } // ENDIF ($xseek)
                            } // ENDIF (substr($xaux, 1, 2) < 10)
                            break;
                        case 3: // checa las unidades
                            if (substr($xaux, 2, 1) < 1) { // si la unidad es cero, ya no hace nada

                            } else {
                                $key = (int) substr($xaux, 2, 1);
                                $xseek = $xarray[$key]; // obtengo directamente el valor de la unidad (del uno al nueve)
                                $xsub = $this->subfijo($xaux);
                                $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                            } // ENDIF (substr($xaux, 2, 1) < 1)
                            break;
                    } // END SWITCH
                } // END FOR
                $xi = $xi + 3;
            } // ENDDO

            if (substr(trim($xcadena), -5, 5) == "ILLON") // si la cadena obtenida termina en MILLON o BILLON, entonces le agrega al final la conjuncion DE
                $xcadena .= " DE";

            if (substr(trim($xcadena), -7, 7) == "ILLONES") // si la cadena obtenida en MILLONES o BILLONES, entoncea le agrega al final la conjuncion DE
                $xcadena .= " DE";

            // ----------- esta línea la puedes cambiar de acuerdo a tus necesidades o a tu país -------
            if (trim($xaux) != "") {
                switch ($xz) {
                    case 0:
                        if (trim(substr($XAUX, $xz * 6, 6)) == "1")
                            $xcadena .= "UN BILLON ";
                        else
                            $xcadena .= " BILLONES ";
                        break;
                    case 1:
                        if (trim(substr($XAUX, $xz * 6, 6)) == "1")
                            $xcadena .= "UN MILLON ";
                        else
                            $xcadena .= " MILLONES ";
                        break;
                    case 2:
                        if ($xcifra < 1) {
                            $xcadena = "CERO PESOS $xdecimales/100 M.N.";
                        }
                        if ($xcifra >= 1 && $xcifra < 2) {
                            $xcadena = "UN PESO $xdecimales/100 M.N. ";
                        }
                        if ($xcifra >= 2) {
                            $xcadena .= " PESOS $xdecimales/100 M.N. "; //
                        }
                        break;
                } // endswitch ($xz)
            } // ENDIF (trim($xaux) != "")
            // ------------------      en este caso, para México se usa esta leyenda     ----------------
            $xcadena = str_replace("VEINTI ", "VEINTI", $xcadena); // quito el espacio para el VEINTI, para que quede: VEINTICUATRO, VEINTIUN, VEINTIDOS, etc
            $xcadena = str_replace("  ", " ", $xcadena); // quito espacios dobles
            $xcadena = str_replace("UN UN", "UN", $xcadena); // quito la duplicidad
            $xcadena = str_replace("  ", " ", $xcadena); // quito espacios dobles
            $xcadena = str_replace("BILLON DE MILLONES", "BILLON DE", $xcadena); // corrigo la leyenda
            $xcadena = str_replace("BILLONES DE MILLONES", "BILLONES DE", $xcadena); // corrigo la leyenda
            $xcadena = str_replace("DE UN", "UN", $xcadena); // corrigo la leyenda
        } // ENDFOR ($xz)
        return trim($xcadena);
    }

    public function subfijo($xx)
    { // esta función regresa un subfijo para la cifra
        $xx = trim($xx);
        $xstrlen = strlen($xx);
        if ($xstrlen == 1 || $xstrlen == 2 || $xstrlen == 3)
            $xsub = "";
        //
        if ($xstrlen == 4 || $xstrlen == 5 || $xstrlen == 6)
            $xsub = "MIL";
        //
        return $xsub;
    }


    public function total($listData)
    {


        $total = 0;
        foreach ($listData as $nameKey) {
            $total += $nameKey->amount;
        }
        //var_dump($total);
        return $total;
    }
}
