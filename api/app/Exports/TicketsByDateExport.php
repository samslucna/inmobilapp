<?php

namespace App\Exports;

use App\Models\Ticket;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;

class TicketsByDateExport implements FromQuery
{
    /**
    * @return \Illuminate\Support\Collection
    */
    use Exportable;

    protected $dates;
    protected $datee;

    

    public function __construct(string $dates,string $datee)
    {
        $this->dates = $dates;
        $this->datee = $datee;
    }




    public function query()
    {
        $query =Ticket::whereBetween('datepay', [$this->dates,$this->datee]);
       //dd($query);
        return $query;
    }
}
