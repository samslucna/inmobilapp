<?php

namespace App\Exports;

use App\Models\Seller;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SellersExport implements FromCollection,WithHeadings,ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */

    public function headings(): array
    {
        return [
            'id',
            'Nombre',
            'Apellidos',
            'Direccion',
            'Telefono',
            'dni',
            'email',
            'Alta',
            'Actualizado',
        ];
    }
    public function collection()
    {
        //
        return Seller::all();
    }
}
