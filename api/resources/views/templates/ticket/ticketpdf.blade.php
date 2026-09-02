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
            height: 850px; /* Ajusta la altura según el diseño de tu plantilla impresa */
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
            font-size: 1.6rem;
        }

        .sutext {
            font-size: 1rem;
        }
    </style>
</head>

<body>

    <!-- Imagen posicionada al 100% de toda la hoja -->
    <img src="{{ public_path('images/recibo3.png') }}" class="bg-image">

    <!-- Todo tu contenido envuelto dentro de .content -->
    <div class="content">


    <p class="subold" style="text-align: right;margin-top: 105px;position: relative; right: 150px; font-weight: bold; color: #ad4c4c;"> {{$data['ticket_id']}} </p>
    <p class="sutext" style="margin-top: 50px;position: relative; left: 980px;">{{number_format($data['amount'],2) }} </p>

    <p class="sutext" style="margin-top: 40px;position: relative; left: 240px;" > {{ strtoupper($data['received']) }} </p>
        
    <p class="sutext" style="margin-top: -25px;position: relative; left: 295px;">{{strtoupper($data['fortheamount']) }}</p>
    
    <p class="sutext" style="margin-top: 50px;position: relative; left: 225px;">{{ strtoupper($data['lotname']) }}</p>
    <p class="sutext" style="margin-top: -52px;position: relative; left: 500px;">{{ strtoupper($data['lotmz']) }}</p>
    <p class="sutext" style="margin-top: -52px;position: relative; left: 950px;">{{ strtoupper($data['paytype']) }}</p>
    <p class="sutext" style="margin-top: -25px;position: relative; left: 150px;">{{ strtoupper($data['lotm2']) }}</p>
    <p class="sutext" style="margin-top: -55px;position: relative; left: 455px;">{{ number_format($data['lotamount'],2) }}</p>
    <p class="sutext" style="margin-top: -55px;position: relative; left: 955px;">{{ strtoupper($data['lotplazo']) }}</p>
    <p class="sutext" style="margin-top: 26px;position: relative; left: 400px;">{{ strtoupper($data['addressbuyer']) }}</p>
    <p class="sutext" style="margin-top: 26px;position: relative; left: 955px;">{{ strtoupper($data['phonebuyer']) }}</p>
    <table>

            <tr>
          
                <td><p class="subold">TELÉFONO: </p></td>
                <td colspan="2"></td>
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