<!DOCTYPE html>
<html>


<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>test</title>

    <style>
        /* spacing */



        .container {
            display: flex;
            flex-direction: row;
            align-items: stretch;
            width: 100%;
        }


        table.tblone {

            width: 45%;
            border-collapse: collapse;
            border: 1px solid gray;
            float: left;
        }

        table.tbltwo {

            width: 100%;
            border-collapse: collapse;


        }


        table.tblthree {

            width: 30%;
            border-collapse: collapse;
            border: 1px solid gray;
            float: left;
        }

        th,
        td {
            padding: 5px;
            border: 1px solid gray;
            text-align: center;
            font-size: .7rem;
        }



        label {
            display: inline-block;
            position: relative;
            bottom: 21px;
        }

        h4 {
            display: inline-block;
            /* Otros estilos para el párrafo */
        }
    </style>
</head>

<body>

    <h1>{{ $data['title'] }}</h1>
    <p>{{ $data['date'] }}</p>
    <div class="container">




        <table class="ui tbltwo  table">
            <tr>
                <td>Contrato</td>
                <td>{{$data['records']->id}}</td>
                <td>NC:</td>
                <td>{{$data['records']->buyer->id}}</td>
                <td>Cliente:</td>
                <td colspan="5">{{strtoupper($data['records']->buyer->name)}} {{strtoupper($data['records']->buyer->lastnames)}}</td>
            </tr>
            <tr>
                <td>N° Lote</td>
                <td>{{$data['records']->property->id}}</td>
                <td>Lote:</td>
                <td>{{$data['records']->property->name}}</td>
                <td>Costo($):</td>
                <td>$ {{number_format($data['records']->property->amount_init,2)}}</td>

                <td>Abonado:</td>
                <td>$ {{number_format($data['total'],2)}}</td>
                <td>Estado:</td>
                <td>{{$data['records']->amount === $data['total'] ? 'Finiquitado' : 'Pagando' }}</td>
            </tr>

        </table>




    </div>

    <br>
    <br>

    <div class="container">
        <h3>Recibos:</h3>
        <table class="ui tblone table">
            <tr>
                    <th>N°</th>
                    <th>Fecha</th>
                    <th>Concepto</th>
                    <th>Monto</th>

            </tr>

            @foreach($data['records']->tickets as $records)
            <tr>


                <td>{{$records->id }}</td>
                <td>{{$records->date }}</td>
                <td>{{$records->concept }}</td>
                <td>$ {{ number_format($records->amount,2) }}</td>

            </tr>
            @endforeach
        </table>
    </div>


</body>

</html>