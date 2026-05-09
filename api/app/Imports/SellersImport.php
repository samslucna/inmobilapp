<?php

namespace App\Imports;

use App\Models\Seller;
use Maatwebsite\Excel\Concerns\ToModel;

class SellersImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new Seller([
            'id'     => $row[0],
            'name'    => $row[1],
            'lastnames' => $row[2],
            'address' => $row[3],
            'phone' => $row[4],
            'dni' => $row[5],
            'email' => $row[6],
            
        ]);
    }
}
