<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf; 
use Carbon\Carbon;
use Illuminate\Http\Request;

class PdfController extends Controller
{
    public function contractExportPDF(Request $request)
    {

//dd($request->id);
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

    public function exportTicketPDF(Request $request)
    {

        $db  = Ticket::find($request->id);
        $contract = Contract::with("buyer")->with("property")->find($db->contract_id);
        $datetext = $this->dateText(Carbon::parse($db["datepay"])->timestamp);

        $data = [
            'title' => 'COLONIA MONTE TLAPA',
            'date' =>$datetext,
            'amount' =>$db["amount"],
            "lotstage"=> strtoupper($contract["property"]->stage),
            "place"=>"Tlapa de Comonfort, Guerrero",
            "received"=> strtoupper($contract["buyer"]->name)." ".strtoupper($contract["buyer"]->lastnames),
            "fortheamount"=>$this->RenderNumberToWords(strval($db["amount"])),
            "concept"=>strval($db["concept"]),
            "lotname"=> strtoupper($contract["property"]->name),
            "lotm2"=> strtoupper($contract["property"]->m2),
            "lotmz"=> strtoupper($contract["property"]->mz),
            "lotamount"=> $contract->amount,
            "paytype"=> strtoupper($db["paytype_id"]),
            "lotplazo"=>$contract["plazo"],
            "adreessbuyer"=> strtoupper($contract["buyer"]->address),
            "phonebuyer"=> strtoupper($contract["buyer"]->phone),
            
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
