<?php

namespace App\Exports;

use App\Models\Buyer;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BuyersExport implements FromCollection,WithHeadings,ShouldAutoSize
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
            'INE',
            'Email',
            'Alta',
            'Actualizado',
            
            
        ];
    }
    
    public function collection()
    {
        //
        return Buyer::all();
    }
}