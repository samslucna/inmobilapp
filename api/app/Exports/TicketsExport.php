<?php

namespace App\Exports;

use App\Models\Ticket;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TicketsExport implements FromCollection,WithHeadings
{

    public function headings(): array
    {
        return [
            'ID',
            "Concepto",
            "Monto",
            "Fecha_Pago",
            "Forma_Pago",
            "Contrato",
     
        ];
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Ticket::all();
    }
}
