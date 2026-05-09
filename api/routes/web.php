<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});



//Route::apiResource('/properties',PropertyController::class);
//Route::post('/login',AuthController::class,"login");



Route::middleware(['auth:sanctum'])->group(function(){
    


});




//Route::get('property',function(){

/*     $property = new Property();


    $property->name = 'Inmueble de prueba 3';
    $property->description = 'Inmueble de prueba 3';
    $property->feature = '{ roms:"3", ws:"2", build:"45x50", park:"1"}';
    $property->amount = 200000.00;
    $property->ubication = '{}';
    $property->status = '1';
    $property->buyerid = 2;
    $property->save();

    return $property; */ 


 /*    $property = Property::find(1);

    return $property; */

/* 
$property = Property::where('name','Inmueble de prueba 2')->first();

$property->amount = 500000.00;

$property->save();

return $property; */




//$property= Property::All();

/* $property= Property::where('id','>=','2')->orderBy('id','desc')->select('id','name','description','amount')->get();

return $property; */

/* $property= Property::find(9);
$property->delete();

return 'Eliminado correctamente'; */




//});
;