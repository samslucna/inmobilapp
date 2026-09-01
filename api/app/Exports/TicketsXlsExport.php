<?php

namespace App\Exports;

use App\Models\Ticket;
use Carbon\Carbon;
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
        $query = Ticket::query()->with(['contract.buyer']); // Carga ansiosa para evitar problema N+1

        //dd($query->)
        // 1. Filtro General de Búsqueda (ID o Número de Recibo)
        $query->when($request->filled('search'), function ($q) use ($request) {
            $search = $request->input('search');
            $q->where('id', 'LIKE', "%{$search}%");
        });

        // Aplicar filtros aquí...

        //dd($query->get()[0]);
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
        if ($request->input(('datei')) !== "null" &&  $request->input(('datee')) !== "null") {

            //// 5. Filtro por Rango de Fechas (fecha_inicio - fecha_fin)
            if ($request->filled('datei') && $request->filled('datee')) {
                $query->whereBetween('date', [
                    Carbon::parse($request->input('datei'))->format('Y-m-d'),
                    Carbon::parse($request->input('datee'))->format('Y-m-d')
                ]);
            } else {
                // Si solo viene una de las dos:
                $query->when($request->filled('datei'), function ($q) use ($request) {
                    $q->whereDate('date', '>=', Carbon::parse($request->input('datei'))->format('Y-m-d'));
                });

                $query->when($request->filled('datee'), function ($q) use ($request) {
                    $q->whereDate('date', '<=', Carbon::parse($request->input('datee'))->format('Y-m-d'));
                });
            }
        }

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
            'Fecha',
            'Cliente',
            'Concepto',
            'Monto',
            'Status',
        ];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->nticket,
            $row->date,
            $row->contract->buyer->name." ".$row->contract->buyer->lastnames ?? 'N/A',
            $row->concept,
            number_format($row->amount, 2),
            ucfirst($row->status),

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
        return 'Recibos';
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
