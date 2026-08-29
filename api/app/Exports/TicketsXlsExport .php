<?php

namespace App\Exports;

use App\Models\Ticket;
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

class TicketsXlsExport implements
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
        $request = $this->request;

        $perPage = (int) $request->input('per_page', 5);
        $page = (int) $request->input('page', 1);
        $query = Ticket::query()->with(['contract.buyer']); // Carga ansiosa para evitar problema N+1

        // 1. Filtro General de Búsqueda (ID o Número de Recibo)
        $query->when($request->filled('search'), function ($q) use ($request) {
            $search = $request->input('search');
            $q->where('id', 'LIKE', "%{$search}%");
        });

        // Aplicar filtros aquí...

        //dd($request->input('clientname'));
        // 2. Filtro por Nombre de Cliente (A través de la relación de contrato/cliente)
        $query->when($request->filled('clientname'), function ($q) use ($request) {
            $clientName = $request->input('clientname');
            $q->whereHas('contract.buyer', function ($qClient) use ($clientName) {
                $qClient->where('name', 'LIKE', "%{$clientName}%")
                    ->orWhere('lastnames', 'LIKE', "%{$clientName}%");
            });
        });


        // 3. Filtro por Concepto
        $query->when($request->filled('concept'), function ($q) use ($request) {
            $q->where('concept', 'LIKE', "%{$request->input('concept')}%");
        });


        // 4. Filtro por Estado (Status)
        $query->when($request->filled('status'), function ($q) use ($request) {
            $q->where('status', $request->input('status'));
        });



        //// 5. Filtro por Rango de Fechas (fecha_inicio - fecha_fin)
        //$query->when($request->filled('fecha_inicio'), function ($q) use ($request) {
        //    $q->whereDate('created_at', '>=', $request->input('fecha_inicio'));
        //});
        //
        //$query->when($request->filled('fecha_fin'), function ($q) use ($request) {
        //    $q->whereDate('created_at', '<=', $request->input('fecha_fin'));
        //});

        // 6. Filtro por Mes (1 al 12)
        $query->when($request->filled('month'), function ($q) use ($request) {
            $q->whereMonth('created_at', $request->input('month'));
        });

        // 7. Filtro por Año (Ej: 2026)
        $query->when($request->filled('year'), function ($q) use ($request) {
            $q->whereYear('created_at', $request->input('year'));
        });



        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Numero',
            'Manzana',
            'Etapa',
            'Proyecto',
            'Estado',
            'M²',
            'Precio',
            'Total Pagado',
            'Saldo',
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
            AfterSheet::class => function (AfterSheet $event) {
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
