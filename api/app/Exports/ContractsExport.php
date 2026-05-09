<?php

namespace App\Exports;

use App\Models\Contract;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ContractsExport implements FromCollection, WithHeadings,ShouldAutoSize
{
    /**
     * @return \Illuminate\Support\Collection
     */


    public function headings(): array
    {
        return [
            'id',
            "buyer_id",
            "seller_id",
            "agent_id",
            "property_id",
            "plazo",
            "conditionpay",
            "amount",
            "partamount",
            "datecontract"
        ];
    }
    public function collection()
    {
        return Contract::all();
    }
}
