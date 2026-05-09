<?php

namespace App\Imports;

use App\Models\Boundary;
use Maatwebsite\Excel\Concerns\ToModel;

class BoundaryImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */



    public function model(array $row)
    {
        return new Boundary([
            'id'     => $row[0],
            'name'    => $row[1],
            'description' => $row[2],
            'm2' => $row[3],
            'property_id' => $row[4],
        ]);
    }
}
