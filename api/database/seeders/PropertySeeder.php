<?php

namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        $property = new Property();

        $property->name = "Property  test";
        $property->description = "Description test";
        $property->feature = "{}";
        $property->amount = 600000.00;
        $property->ubication = "{}";
        $property->status = "1";
        $property->buyerid = 1;

        $property->save();


    }
}
