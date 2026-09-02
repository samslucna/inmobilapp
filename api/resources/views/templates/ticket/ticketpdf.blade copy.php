<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Recibo de prueba</title>

    <style>
        /* 1. Configurar hoja Tamaño Carta (Letter) y eliminar márgenes del documento */
        @page {
            size: letter portrait; /* 8.5in x 11in */
            margin: 0;
        }

        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }

        /* 2. Imagen de fondo al 100% de la hoja */
        .bg-image {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 650px; /* Ajusta la altura según el diseño de tu plantilla impresa */
            z-index: -1000; /* Asegura que quede detrás del texto */
        }

        /* 3. Contenedor principal con márgenes internos para que el texto no toque las orillas */
        .content {
            padding: 20px 30px; /* Ajusta este relleno para alinear con el diseño de tu plantilla impresa */
        }

        table {
            width: 100%;
        }

        th, td {
            padding: 0px;
        }

        .title {
            margin-top: 10px;
            font-size: .8rem;
            font-weight: bold;
            text-align: center;
        }

        .subtitle {
            text-align: center;
            font-size: .7rem;
        }

        .subold {
            font-weight: bold;
            font-size: .5rem;
        }

        .sutext {
            font-size: .5rem;
        }
    </style>
</head>

<body>

    <!-- Imagen posicionada al 100% de toda la hoja -->
    <img src="{{ public_path('images/recibo2.png') }}" class="bg-image">

    <!-- Todo tu contenido envuelto dentro de .content -->
    <div class="content">

        <p class="title">{{ strtoupper($data['title']) }}</p>
        <p class="subtitle">{{$data['etapa']}}</p>
        <p class="subtitle">{{ strtoupper($data['place']) }}</p>

        <table>
            <tr>
                <td><p class="subold"></p></td>
                <td><p class="sutext"></p></td>
                <td><p class="subold"></p></td>
                <td colspan="2"><p class="subold" style="text-align: right;">BUENO POR : </p></td>
                <td colspan="2"><p class="sutext" style="text-align: left;">$ {{number_format($data['amount'],2) }} </p></td>
            </tr>
            <tr>
                <td><p class="subold">RECIBÍ DE : </p></td>
                <td><p class="sutext"> {{ strtoupper($data['received']) }} </p></td>
                <td><p class="subold"></p></td>
                <td><p class="sutext"></p></td>
                <td><p class="subold"></p></td>
                <td><p class="sutext"></p></td>
            </tr>
            <tr>
                <td><p class="subold">LA CANTIDAD DE : </p></td>
                <td><p class="sutext">{{strtoupper($data['fortheamount']) }}</p></td>
                <td><p class="subold"></p></td>
                <td><p class="sutext"></p></td>
                <td><p class="subold"></p></td>
                <td><p class="sutext"></p></td>
                <td><p class="subold"></p></td>
                <td><p class="sutext"></p></td>
            </tr>
            <tr>
                <td><p class="subold">POR EL CONCEPTO DE: </p></td>
                <td><p class="sutext"> {{ strtoupper($data['concept']) }}</p></td>
                <td><p class="subold"></p></td>
                <td><p class="sutext"></p></td>
                <td><p class="subold"></p></td>
                <td><p class="sutext"></p></td>
                <td><p class="subold"></p></td>
                <td><p class="sutext"></p></td>
            </tr>
            <tr>
                <td><p class="subold" style="text-align: right;">LOTE N°: </p></td>
                <td><p class="sutext">{{ strtoupper($data['lotname']) }}</p></td>
                <td><p class="subold" style="text-align: right;"> MANZANA N°:</p></td>
                <td colspan="2"><p class="sutext">{{ strtoupper($data['lotmz']) }}</p></td>
                <td colspan="2"><p class="subold" style="text-align: right;">FORMA DE PAGO: </p></td>
                <td><p class="sutext">{{ strtoupper($data['paytype']) }}</p></td>
            </tr>
            <tr>
                <td><p class="subold" style="text-align: right;">METROS CUADRADOS: </p></td>
                <td><p class="sutext">{{ strtoupper($data['lotm2']) }}</p></td>
                <td><p class="subold" style="text-align: right;"> Costo ($):</p></td>
                <td colspan="2"><p class="sutext" style="text-align: left;">$ {{ number_format($data['lotamount'],2) }}</p></td>
                <td colspan="2"><p class="subold" style="text-align: right;">PLAZO DE PAGOS: </p></td>
                <td><p class="sutext">{{ strtoupper($data['lotplazo']) }}</p></td>
            </tr>
            <tr>
                <td><p class="subold">DOMICILIO COMPRADOR: </p></td>
                <td colspan="2"><p class="sutext">{{ strtoupper($data['addressbuyer']) }}</p></td>
                <td><p class="subold">TELÉFONO: </p></td>
                <td colspan="2"><p class="sutext">{{ strtoupper($data['phonebuyer']) }}</p></td>
            </tr>
        </table>

        <p class="subold" style="text-align: right; margin-top: 15px;">TLAPA DE COMONFORT, GUERRERO {{$data["date"]}}</p>

        <table style="margin-top: 30px;">
            <tr style="text-align: center;">
                <td>
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

    </div>

</body>

</html>