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

    protected $date_init;
    protected $date_end;

    

    public function __construct(string $date_init,string $date_end)
    {
        $this->date_init = $date_init;
        $this->date_end = $date_end;
    }




    public function query()
    {
        $query =Ticket::whereBetween('date', [$this->date_init,$this->date_end]);
       //dd($query);
        return $query;
    }
}
