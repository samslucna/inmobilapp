<?php

namespace App\Exports;

use App\Models\Agent;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AgentsExport implements FromCollection,WithHeadings,ShouldAutoSize
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
            'Email',
            'Alta',
            'Actualizado',
        ];
    }
    public function collection()
    {
        //
        return Agent::all();
    }
}
