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
            border: solid gray 1px;
        }

        table {

            width: 100%;


        }

        th,
        td {
            padding: 5px;
            font-size: .7rem;
        }



        label {
            display: inline-block;
            position: relative;
            bottom: 21px;
        }


        .title {
            margin-top: 100px;
            font-size: 5rem;
            font-weight: bold;
            text-align: center;
        }

        .subtitle {
            text-align: center;
            font-size: 4rem;
        }

        .subold {
            font-weight: bold;

            font-size: 2.5rem;
        }

        .sutext {

            font-size: 2.5rem;
        }
    </style>
</head>

<body>

    <p class="title">{{ strtoupper($data['title']) }}</p>
    <p class="subtitle">SEGUNDA ETAPA</p>
    <p class="subtitle">{{ strtoupper($data['place']) }}</p>



    <table>
        <tr>
            <td>
                <p class="subold"></p>
            </td>
            <td>
                <p class="sutext"> </p>
            </td>
            <td>
                <p class="subold"></p>
            </td>
            <td>
                <p class="sutext"> </p>
            </td>
            <td>
                <p class="subold"></p>
            </td>
         
            <td>
                <p class="subold" style="text-align: right;">BUENO POR : </p>
            </td>
            <td colspan="2">
                <p class="sutext" style="text-align: left;">$ {{number_format($data['amount'],2) }} </p>
            </td>
        </tr>
        <tr>
            <td>
                <p class="subold">RECIBÍ DE : </p>
            </td>
            <td>
                <p class="sutext"> {{ strtoupper($data['received']) }} </p>
            </td>
            <td>
                <p class="subold"></p>
            </td>
            <td>
                <p class="sutext"> </p>
            </td>
            <td>
                <p class="subold"></p>
            </td>
            <td>
                <p class="sutext"> </p>
            </td>
        </tr>
        <tr>
            <td>
                <p class="subold">LA CANTIDA DE : </p>
            </td>
            <td>
                <p class="sutext">{{strtoupper($data['fortheamount']) }}</p>
            </td>
            <td>
                <p class="subold"> </p>
            </td>
            <td>
                <p class="sutext"> </p>
            </td>
            <td>
                <p class="subold"></p>
            </td>
            <td>
                <p class="sutext"> </p>
            </td>
            <td>
                <p class="subold"></p>
            </td>
            <td>
                <p class="sutext"> </p>
            </td>
        </tr>
        <tr>
            <td>
                <p class="subold">POR EL CONCEPTO DE: : </p>
            </td>
            <td>
                <p class="sutext"> {{ strtoupper($data['concept']) }}</p>
            </td>
            <td>
                <p class="subold"> </p>
            </td>
            <td>
                <p class="sutext"> </p>
            </td>
            <td>
                <p class="subold"></p>
            </td>
            <td>
                <p class="sutext"> </p>
            </td>
            <td>
                <p class="subold"></p>
            </td>
            <td>
                <p class="sutext"> </p>
            </td>
        </tr>
        <tr>
            <td>
                <p class="subold">LOTE N°: </p>
            </td>
            <td>

                <p class="sutext">{{ strtoupper($data['lotname']) }}</p>

            </td>
            <td>
                <p class="subold"> MANZANA N°:</p>
            </td>
            <td colspan="2">

                <p class="sutext">{{ strtoupper($data['lotmz']) }}</p>
            </td>
            <td>

            </td>
            <td>
                <p class="subold">FORMA DE PAGO°: </p>
            </td>
            <td>
                <p class="sutext">{{ strtoupper($data['paytype']) }}</p>
            </td>
        </tr>
        <tr>
            <td>
                <p class="subold">METROS CUADRADOS: </p>
            </td>
            <td>

                <p class="sutext">{{ strtoupper($data['lotm2']) }}</p>

            </td>
            <td>
                <p class="subold"> Costo ($):</p>
            </td>
            <td colspan="2">

                <p class="sutext">$ {{ number_format($data['lotamount'],2) }}</p>
            </td>
            <td>

            </td>
            <td>
                <p class="subold">PLAZO DE PAGOS: </p>
            </td>
            <td>

                <p class="sutext">{{ strtoupper($data['lotplazo']) }}</p>
            </td>
        </tr>
        <tr>
            <td>
                <p class="subold">DOMICILIO COMPRADOR: </p>
            </td>
            <td colspan="2">



                <p class="sutext">{{ strtoupper($data['adreessbuyer']) }}</p>

            </td>

            <td>
                <p class="subold">TELEFONO: </p>

            </td>
            <td colspan="2">
                <p class="sutext">{{ strtoupper($data['phonebuyer']) }}</p>
            </td>

        </tr>

    </table>








    <p class="subold" style="text-align: right;">TLAPA DE COMONFORT, GUERRERO {{$data["date"]}} </p>
    <p class="sutext"></p>




    <table>

        <tr style="text-align: center;">
            <td >
                <p class="subold">_____________________________________ </p>
                <p class="subold">L.C. ÁLVARO PANO HERNÁNDEZ</p>
                <p class="subold"> Autorizó </p>
            </td>
            <td>
                <p class="subold">_____________________________________ </p>
                <p class="subold">C. RAÚL VALENTE BELTRÁN CAJERO</p>
                <p class="subold"> CAJERO </p>
            </td>
        </tr>
    </table>

</body>

</html>