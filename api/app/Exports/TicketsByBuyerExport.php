<?php

namespace App\Exports;

use App\Models\Ticket;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;

class TicketsByBuyerExport implements FromQuery
{
    /**
    * @return \Illuminate\Support\Collection
    */

    use Exportable;
    protected $urlLoadWorkBook;
    protected $workSheets;
    protected $workBook;
    protected $datas;

    public function __construct(string $urlLoadWorkBook,string $workBook,string $workSheets,array $datas)
    {
        $this->urlLoadWorkBook = $urlLoadWorkBook;
        $this->workSheets = $workSheets;
        $this->workBook = $workBook;
        $this->datas = $datas;
    }
    
    public function query()
    {
       // $query =Ticket::whereBetween('datepay', [$this->urlLoadDoc,$this->worksheets]);
       //dd($query);
       // return $query;
    }
}
