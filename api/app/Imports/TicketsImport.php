<?php

namespace App\Imports;

use App\Models\Ticket;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class TicketsImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {

        $date = Date::excelToDateTimeObject($row[3]);
        return new Ticket([
            "id" => $row[0],
            "concept" => $row[1],
            "amount" => $row[2],
            "datepay" => $date,
            "paytype_id" => $row[4],
            "contract_id"=> $row[5],
          
        ]);
    }

    
}
