<?php

namespace App\Exports;

use App\Models\Property;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PropertiesExport implements FromCollection,WithHeadings,ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function headings(): array
    {
        return [
            'id',
            'Nombre',
            'Descripcion',
            'M2',
            'Direccion',
            'Colindancia 1',
            'Colindancia 2',
            'Colindancia 3',
            'Colindancia 4',
            'Etapa',
            'Precio Vente($)',
            'Status',
            'Manzana',
            'Comprador',
            'Propietario',
            'Alta',
            'Actualizado',
            
            
        ];
    }
    
    public function collection()
    {
        //
        return Property::all();
    }
}
