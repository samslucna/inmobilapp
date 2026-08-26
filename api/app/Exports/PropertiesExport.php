<?php
namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class PropertiesExport implements 
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    WithTitle,
    ShouldAutoSize,
    WithEvents
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $query = DB::table('properties as p')
            ->join('blocks as b', 'p.block_id', '=', 'b.id')
            ->leftJoin('stages as s', 'b.stage_id', '=', 's.id')
            ->leftJoin('projects as pr', 's.project_id', '=', 'pr.id')
            ->leftJoin('contracts as c', 'p.id', '=', 'c.property_id')
            ->select(
                'p.id',
                'p.name',
                'p.m2',
                'b.name as manzana',
                'p.amount_init',
                'p.status',
                's.name as etapa',
                'pr.name as project_name',
                
                'c.date as fecha_contrato',
                DB::raw("COALESCE((SELECT SUM(tk.amount) FROM tickets tk WHERE tk.contract_id = c.id), 0) as total_pagado"),
                DB::raw("p.amount_init - COALESCE((SELECT SUM(tk.amount) FROM tickets tk WHERE tk.contract_id = c.id), 0) as saldo")
            );

        // Aplicar filtros aquí...

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID', 'Propiedad', 'Manzana', 'Etapa', 'Proyecto',
            'Estado', 'M²', 'Precio Inicial', 'Total Pagado', 'Saldo',
            'Fecha Contrato'
        ];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->name,
            $row->manzana,
            $row->etapa ?? 'N/A',
            $row->project_name ?? 'N/A',
            ucfirst($row->status),
            $row->m2,
            number_format($row->amount_init, 2),
            number_format($row->total_pagado, 2),
            number_format($row->saldo, 2),
            $row->fecha_contrato ?? 'N/A',
            //$row->address ?? 'N/A',
        ];
    }

    public function styles($sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12]],
        ];
    }

    public function title(): string
    {
        return 'Lotes';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet;
                
                // Estilos para el encabezado
                $sheet->getStyle('A1:L1')->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '2B6CB0']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);
            },
        ];
    }
}