<?php

namespace App\Exports;

use FPDF;

class TicketsPdfExport extends FPDF
{
    protected $tickets;
    protected $request;
    protected $totals;
    protected $userName;
    protected $filtersText;

    public function __construct($tickets, $request, $totals, $userName, $filtersText)
    {
        // 'P' = Portrait (Vertical), 'mm', 'Letter' = Tamañio Carta (215.9mm x 279.4mm)
        parent::__construct('P', 'mm', 'Letter');
        $this->tickets = $tickets;
        $this->request = $request;
        $this->totals = $totals;
        $this->userName = $userName;
        $this->filtersText = $filtersText;
    }

    // ENCABEZADO PERSONALIZADO
    public function Header()
    {
        // 1. Logotipo (Lado Izquierdo)
        $logoPath = public_path('images/logo.png');
        if (file_exists($logoPath)) {
            $this->Image($logoPath, 10, 8, 22); // Ancho de 22mm
        }

        // 2. Nombre del Sistema (Lado Derecho)
        $this->SetFont('Arial', 'B', 11);
        $this->SetTextColor(100, 100, 100);
        $this->SetXY(-50, 10);
        $this->Cell(40, 6, mb_convert_encoding('SISTEMA MOTSAKKI', 'ISO-8859-1', 'UTF-8'), 0, 0, 'R');

        // 3. Título del Reporte (Centro)
        $this->SetXY(35, 10);
        $this->SetFont('Arial', 'B', 12);
        $this->SetTextColor(33, 33, 33);
        $this->Cell(130, 6, mb_convert_encoding('REPORTE GENERAL DE RECIBOS', 'ISO-8859-1', 'UTF-8'), 0, 1, 'C');

        // Subtítulo con fecha y usuario
        $this->SetX(35);
        $this->SetFont('Arial', '', 8);
        $this->SetTextColor(120, 120, 120);
        $this->Cell(130, 4, mb_convert_encoding('Generado: ' . date('d/m/Y H:i') . ' | Usuario: ' . $this->userName, 'ISO-8859-1', 'UTF-8'), 0, 1, 'C');

        // Filtros (si existen)
        if (!empty($this->filtersText)) {
            $this->SetX(10);
            $this->SetFont('Arial', 'I', 7.5);
            $this->Cell(196, 4, mb_convert_encoding('Filtros: ' . $this->filtersText, 'ISO-8859-1', 'UTF-8'), 0, 1, 'L');
        }

        // Línea divisora del encabezado
        $this->SetDrawColor(200, 200, 200);
        $this->SetLineWidth(0.4);
        $this->Line(10, 26, 205, 26);
        $this->Ln(6);

        // ENCABEZADOS DE LA TABLA (Ancho total disponible = 196mm)
        $this->SetFont('Arial', 'B', 8);
        $this->SetFillColor(240, 240, 240);
        $this->SetTextColor(0, 0, 0);

        $this->Cell(14, 6, 'No.', 1, 0, 'C', true);
        $this->Cell(18, 6, 'Fecha', 1, 0, 'C', true);
        $this->Cell(48, 6, 'Cliente', 1, 0, 'L', true);
        $this->Cell(38, 6, 'Concepto', 1, 0, 'L', true);
        $this->Cell(22, 6, 'Tipo Pago', 1, 0, 'C', true);
        $this->Cell(18, 6, 'Monto', 1, 0, 'R', true);
        $this->Cell(18, 6, 'Ref.', 1, 0, 'L', true);
        $this->Cell(20, 6, 'Estatus', 1, 1, 'C', true);
    }

    // PIE DE PÁGINA
    public function Footer()
    {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(150, 150, 150);
        $this->Cell(0, 10, mb_convert_encoding('Página ', 'ISO-8859-1', 'UTF-8') . $this->PageNo() . '/{nb}', 0, 0, 'C');
    }

    // RENDERIZADO DE FILAS
    public function GenerateTable()
    {
        $this->SetFont('Arial', '', 5.5);
        $this->SetTextColor(50, 50, 50);

        foreach ($this->tickets as $ticket) {
            $clientName = 'N/A';
            if (isset($ticket->contract->buyer)) {
                $clientName = trim(($ticket->contract->buyer->name ?? '') . ' ' . ($ticket->contract->buyer->lastnames ?? ''));
            } elseif (isset($ticket->client_name)) {
                $clientName = $ticket->client_name;
            }

            $this->Cell(14, 5.5, $ticket->nticket ?? $ticket->id, 1, 0, 'C');
            $this->Cell(18, 5.5, $ticket->date, 1, 0, 'C');
            // Recortar texto con substr para evitar desbordes en celdas más estrechas
            $this->Cell(48, 5.5, mb_convert_encoding(substr($clientName, 0, 27), 'ISO-8859-1', 'UTF-8'), 1, 0, 'L');
            $this->Cell(38, 5.5, mb_convert_encoding(substr($ticket->concept, 0, 22), 'ISO-8859-1', 'UTF-8'), 1, 0, 'L');
            $this->Cell(22, 5.5, mb_convert_encoding(substr($ticket->paytype, 0, 12), 'ISO-8859-1', 'UTF-8'), 1, 0, 'C');
            $this->Cell(18, 5.5, '$' . number_format($ticket->amount, 2), 1, 0, 'R');
            $this->Cell(18, 5.5, mb_convert_encoding(substr($ticket->ref, 0, 10), 'ISO-8859-1', 'UTF-8'), 1, 0, 'L');
            $this->Cell(20, 5.5, ucfirst($ticket->status), 1, 1, 'C');
        }

        // TOTAL GENERAL AL FINAL
        $this->SetFont('Arial', 'B', 6);
        $this->SetFillColor(230, 230, 230);
        $this->Cell(140, 6, 'TOTAL RECAUDADO', 1, 0, 'R', true);
        $this->Cell(18, 6, '$' . number_format($this->totals['amount'], 2), 1, 0, 'R', true);
        $this->Cell(38, 6, '', 1, 1, 'C', true);
    }
}
