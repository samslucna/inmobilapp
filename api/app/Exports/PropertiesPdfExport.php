<?php

namespace App\Exports;


use Codedge\Fpdf\Fpdf\Fpdf as FPDF;

class PropertiesPdfExport extends FPDF
{
    protected $properties;
    protected $request;
    protected $totals;
    protected $userName;
    protected $filters;

    public function __construct($properties, $request, $totals, $userName, $filters)
    {
        parent::__construct('L', 'mm', 'A4');
        $this->properties = $properties;
        $this->request = $request;
        $this->totals = $totals;
        $this->userName = $userName;
        $this->filters = $filters;
    }

    // Encabezado
    function Header()
    {
        // Logo o nombre de la empresa (derecha)
        $this->SetY(5);
        $this->SetX(250);
        $this->SetFont('Arial', 'B', 12);
        $this->SetTextColor(43, 108, 176);
        $this->Cell(40, 10, 'Motsakki-Tju', 0, 1, 'R');

        // Título del reporte (centrado)
        $this->SetY(10);
        $this->SetFont('Arial', 'B', 16);
        $this->SetTextColor(26, 32, 44);
        $this->Cell(0, 10, 'REPORTE DE LOTES', 0, 1, 'C');

        // Subtítulo
        $this->SetFont('Arial', 'I', 10);
        $this->SetTextColor(74, 85, 104);
        $this->Cell(0, 6, 'Sistema de Gestión de Propiedades - Motsakki-Tju', 0, 1, 'C');

        // Fecha y hora
        $this->SetFont('Arial', '', 9);
        $this->SetTextColor(113, 128, 150);
        $this->Cell(0, 6, 'Fecha de generación: ' . date('d/m/Y H:i:s'), 0, 1, 'C');

        // Línea separadora
        $this->SetY(32);
        $this->SetDrawColor(43, 108, 176);
        $this->SetLineWidth(1);
        $this->Line(10, 32, 290, 32);
        $this->SetY(35);

        // Filtros aplicados
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(74, 85, 104);
        $this->MultiCell(0, 5, $this->filters, 0, 'L');
        $this->Ln(3);

        // Cabecera de la tabla
        $this->SetY(48);
        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(43, 108, 176);
        $this->SetTextColor(255, 255, 255);
        $this->SetDrawColor(43, 108, 176);
        
        // Anchos de columna
        $w = [12, 25, 18, 20, 30, 18, 15, 25, 25, 25, 22, 30, 30];
        $headers = ['ID', 'Propiedad', 'Manzana', 'Etapa', 'Proyecto', 'Estado', 'M²', 'Precio', 'Pagado', 'Saldo', 'Fec. Cont.'];
        
        for ($i = 0; $i < count($headers); $i++) {
            // Ajustar el texto de la cabecera para que quepa mejor
            $headerText = $headers[$i];
            if ($i == 10) $headerText = 'F.Cont.';
            //if ($i == 11) $headerText = 'Dirección';
            //if ($i == 12) $headerText = 'GPS';
            
            $this->Cell($w[$i], 8, $headerText, 1, 0, 'C', true);
        }
        $this->Ln();
    }

    // Pie de página
    function Footer()
    {
        // Posición: a 1.5 cm del final
        $this->SetY(-15);
        
        // Línea separadora
        $this->SetDrawColor(200, 200, 200);
        $this->Line(10, $this->GetY(), 290, $this->GetY());
        
        // Usuario y página
        $this->SetFont('Arial', '', 8);
        $this->SetTextColor(100, 100, 100);
        
        // Usuario que generó el reporte
        $this->Cell(0, 5, 'Usuario: ' . $this->userName, 0, 0, 'L');
        
        // Número de página
        $this->Cell(0, 5, 'Página ' . $this->PageNo() . ' de {nb}', 0, 0, 'R');
    }

    // Método para generar la tabla de datos
    function GenerateTable()
    {
        // Anchos de columna
        $w = [12, 25, 18, 20, 30, 18, 15, 25, 25, 25, 22, 30, 30];
        
        // Configurar estilos
        $this->SetFont('Arial', '', 8);
        $this->SetTextColor(0, 0, 0);
        $this->SetFillColor(249, 250, 252);
        $this->SetDrawColor(200, 200, 200);
        
        $fill = false;
        $rowCount = 0;
        $maxRowsPerPage = 22;
        
        foreach ($this->properties as $property) {
            // Verificar si necesitamos nueva página
            if ($rowCount >= $maxRowsPerPage) {
                $this->AddPage();
                $this->SetFont('Arial', '', 8);
                $rowCount = 0;
                // Reiniciar el color de relleno
                $fill = false;
            }
            
            // Datos de la fila
            $data = [
                $property->id,
                $property->name,
                $property->manzana,
                $property->etapa ?? 'N/A',
                $property->project_name ?? 'N/A',
                ucfirst($property->status),
                number_format($property->m2, 2),
                '$' . number_format($property->amount_init, 2),
                '$' . number_format($property->total_pagado, 2),
                '$' . number_format($property->saldo, 2),
                $property->fecha_contrato ?? 'N/A',
                //$this->truncateText($property->address ?? 'N/A', 25),
                //$this->truncateText(
                //    ($property->latitude && $property->longitude) ? 
                //    $property->latitude . ', ' . $property->longitude : 
                //    'N/A', 25
                //)
            ];
            
            // Dibujar cada celda
            $x = $this->GetX();
            for ($i = 0; $i < count($data); $i++) {
                $this->Cell($w[$i], 6, $data[$i], 1, 0, $i == 0 ? 'C' : 'L', $fill);
            }
            $this->Ln();
            
            $fill = !$fill;
            $rowCount++;
        }
        
        // Agregar fila de totales
        $this->AddTotalsRow($w);
    }

    // Método para truncar texto
    private function truncateText($text, $maxLength)
    {
        if (strlen($text) > $maxLength) {
            return substr($text, 0, $maxLength) . '...';
        }
        return $text;
    }

    // Método para agregar fila de totales
    private function AddTotalsRow($w)
    {
        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(237, 242, 247);
        $this->SetDrawColor(160, 174, 192);
        
        // Celda de texto "TOTALES GENERALES"
        $this->SetX($this->GetX());
        // Sumar el ancho de las primeras 7 columnas
        $totalWidth = 0;
        for ($i = 0; $i < 7; $i++) {
            $totalWidth += $w[$i];
        }
        $this->Cell($totalWidth, 8, 'TOTALES GENERALES', 1, 0, 'R', true);
        
        // Totales
        $totals = [
            '$' . number_format($this->totals['amount_init'], 2),
            '$' . number_format($this->totals['total_pagado'], 2),
            '$' . number_format($this->totals['saldo'], 2),
            '', '', '' // Columnas vacías para Fecha, Dirección y GPS
        ];
        
        for ($i = 0; $i < count($totals); $i++) {
            $this->Cell($w[7 + $i], 8, $totals[$i], 1, 0, 'R', true);
        }
        $this->Ln();
        
        // Línea doble al final
        $this->SetDrawColor(43, 108, 176);
        $this->SetLineWidth(1.5);
        $this->Line(10, $this->GetY() - 0.5, 290, $this->GetY() - 0.5);
        $this->setLineWidth(0.2);
    }
}