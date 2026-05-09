<?php

namespace App\Imports;

use App\Models\Property;
use Maatwebsite\Excel\Concerns\ToModel;

class PropertiesImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */


    /* public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            Property::create([
                'id'     => $row[0],
                'name'    => $row[1],
                'description' => $row[2],
                'm2' => $row[3],
                'typeinm' => $row[4],
                'address' => $row[5],
                'north' => $row[6],
                'south' => $row[7],
                'east' => $row[8],
                'west' => $row[9],
                'stage' => $row[10],
                'amount' => $row[11],
                'status' => $row[12],
                'buyer_id' => $row[13],
            ]);
        }
    } */


    public function model(array $row)
    {
        return new Property([
            'id'     => $row[0],
            'name'    => $row[1],
            'description' => $row[2],
            'm2' => $row[3],
            'address' => $row[4],
            'block_id' => $row[5],
            'amount_init' => $row[6],
            'amount_end' => $row[7],
            'status' => $row[8],
        ]);
    }
}
