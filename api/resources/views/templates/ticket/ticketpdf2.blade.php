<!DOCTYPE html>
<html lang="es">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recibo de Cobro - {{ $data['title'] }}</title>

    <style>
        /* Reset y estilos base */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            background: #f0f2f5;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .recibo-wrapper {
            max-width: 800px;
            width: 100%;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            padding: 40px 35px;
            position: relative;
        }

        /* Borde decorativo */
        .recibo-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #1a365d, #2b6cb0, #4299e1);
            border-radius: 12px 12px 0 0;
        }

        /* Encabezado */
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px dashed #e2e8f0;
        }

        .header .title {
            font-size: 2.8rem;
            font-weight: 900;
            color: #1a365d;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        .header .subtitle {
            font-size: 1.4rem;
            font-weight: 600;
            color: #2b6cb0;
            letter-spacing: 2px;
        }

        .header .place {
            font-size: 1.2rem;
            color: #4a5568;
            font-weight: 500;
            margin-top: 3px;
        }

        .header .receipt-number {
            display: inline-block;
            background: #ebf8ff;
            color: #2b6cb0;
            padding: 5px 20px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-top: 10px;
            border: 1px solid #bee3f8;
        }

        /* Tabla de contenido */
        .content-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .content-table td {
            padding: 8px 6px;
            vertical-align: middle;
        }

        .label {
            font-weight: 700;
            color: #1a365d;
            font-size: 0.95rem;
            white-space: nowrap;
            min-width: 120px;
        }

        .value {
            font-weight: 500;
            color: #2d3748;
            font-size: 0.95rem;
            border-bottom: 1px dotted #e2e8f0;
            padding: 6px 8px;
        }

        .value-highlight {
            background: #f7fafc;
            border-radius: 4px;
            padding: 4px 10px;
        }

        .amount-box {
            background: linear-gradient(135deg, #ebf8ff, #bee3f8);
            border-radius: 8px;
            padding: 10px 20px;
            text-align: center;
            border: 2px solid #2b6cb0;
        }

        .amount-box .label {
            font-size: 0.8rem;
            color: #2b6cb0;
            display: block;
        }

        .amount-box .value {
            font-size: 1.8rem;
            font-weight: 900;
            color: #1a365d;
            border: none;
            padding: 0;
        }

        /* Sección de firmas */
        .signatures {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px dashed #e2e8f0;
        }

        .signatures table {
            width: 100%;
            border-collapse: collapse;
        }

        .signatures td {
            text-align: center;
            padding: 10px 15px;
        }

        .signature-line {
            border-bottom: 2px solid #2d3748;
            width: 80%;
            margin: 0 auto 8px;
            height: 30px;
        }

        .signature-name {
            font-weight: 700;
            color: #1a365d;
            font-size: 0.9rem;
            margin-top: 5px;
        }

        .signature-role {
            font-size: 0.8rem;
            color: #4a5568;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Pie de página */
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: #718096;
        }

        .footer .date {
            font-weight: 600;
            color: #2d3748;
        }

        .footer .company {
            font-weight: 600;
            color: #2b6cb0;
        }

        /* Utilidades */
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .text-uppercase {
            text-transform: uppercase;
        }
        .mt-10 { margin-top: 10px; }
        .mb-10 { margin-bottom: 10px; }
        .font-bold { font-weight: 700; }

        /* Responsive */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .recibo-wrapper {
                box-shadow: none;
                border-radius: 0;
                padding: 20px;
            }
            .recibo-wrapper::before {
                display: none;
            }
        }

        @media (max-width: 600px) {
            .recibo-wrapper {
                padding: 20px 15px;
            }
            .header .title {
                font-size: 1.8rem;
            }
            .header .subtitle {
                font-size: 1rem;
            }
            .label {
                font-size: 0.8rem;
                min-width: 80px;
            }
            .value {
                font-size: 0.8rem;
            }
            .amount-box .value {
                font-size: 1.4rem;
            }
            .signatures td {
                display: block;
                margin-bottom: 20px;
            }
            .footer {
                flex-direction: column;
                text-align: center;
                gap: 5px;
            }
            .content-table td {
                display: block;
                padding: 4px 0;
            }
            .content-table tr {
                display: block;
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>

<div class="recibo-wrapper">
    
    <!-- ENCABEZADO -->
    <div class="header">
        <div class="title">{{ strtoupper($data['title']) }}</div>
        <div class="subtitle">SEGUNDA ETAPA</div>
        <div class="place">{{ strtoupper($data['place']) }}</div>
        @if(isset($data['receipt_number']))
            <div class="receipt-number">📄 RECIBO N°: {{ $data['receipt_number'] }}</div>
        @endif
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <table class="content-table">
        <tr>
            <td class="label">RECIBÍ DE :</td>
            <td class="value value-highlight" colspan="3">
                <strong>{{ strtoupper($data['received']) }}</strong>
            </td>
            <td class="label text-right">BUENO POR :</td>
            <td class="value amount-box" colspan="2">
                <span class="label">TOTAL</span>
                <span class="value">$ {{ number_format($data['amount'], 2) }}</span>
            </td>
        </tr>
        <tr>
            <td class="label">LA CANTIDAD DE :</td>
            <td class="value" colspan="5">
                {{ strtoupper($data['fortheamount']) }}
            </td>
        </tr>
        <tr>
            <td class="label">POR CONCEPTO :</td>
            <td class="value" colspan="5">
                {{ strtoupper($data['concept']) }}
            </td>
        </tr>
        <tr>
            <td class="label">LOTE N° :</td>
            <td class="value"><strong>{{ strtoupper($data['lotname']) }}</strong></td>
            <td class="label">MANZANA :</td>
            <td class="value"><strong>{{ strtoupper($data['lotmz']) }}</strong></td>
            <td class="label">FORMA DE PAGO :</td>
            <td class="value">{{ strtoupper($data['paytype']) }}</td>
        </tr>
        <tr>
            <td class="label">M² :</td>
            <td class="value">{{ number_format($data['lotm2'], 2) }}</td>
            <td class="label">COSTO ($) :</td>
            <td class="value">$ {{ number_format($data['lotamount'], 2) }}</td>
            <td class="label">PLAZO :</td>
            <td class="value">{{ strtoupper($data['lotplazo']) }}</td>
        </tr>
        <tr>
            <td class="label">DOMICILIO :</td>
            <td class="value" colspan="3">{{ $data['addressbuyer'] }}</td>
            <td class="label">TELÉFONO :</td>
            <td class="value">{{ $data['phonebuyer'] }}</td>
        </tr>
    </table>

    <!-- SECCIÓN DE OBSERVACIONES (opcional) -->
    @if(isset($data['observations']))
        <div style="margin: 15px 0; padding: 12px; background: #f7fafc; border-radius: 6px; border-left: 4px solid #2b6cb0;">
            <strong style="color: #2b6cb0;">OBSERVACIONES:</strong>
            <p style="margin-top: 5px; color: #4a5568;">{{ $data['observations'] }}</p>
        </div>
    @endif

    <!-- FIRMAS -->
    <div class="signatures">
        <table>
            <tr>
                <td>
                    <div class="signature-line"></div>
                    <div class="signature-name">L.C. ÁLVARO PANO HERNÁNDEZ</div>
                    <div class="signature-role">AUTORIZÓ</div>
                </td>
                <td>
                    <div class="signature-line"></div>
                    <div class="signature-name">C. RAÚL VALENTE BELTRÁN CAJERO</div>
                    <div class="signature-role">CAJERO</div>
                </td>
                <td>
                    <div class="signature-line"></div>
                    <div class="signature-name">__________________________________</div>
                    <div class="signature-role">RECIBÍ CONFORME</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- PIE DE PÁGINA -->
    <div class="footer">
        <div>
            <span class="company">🏢 {{ strtoupper($data['title']) }}</span>
        </div>
        <div>
            <span class="date">📅 {{ $data['date'] }}</span>
        </div>
        <div>
            <span>📍 TLAPA DE COMONFORT, GUERRERO</span>
        </div>
    </div>

    <!-- Sello de agua (opcional) -->
    @if(isset($data['watermark']) && $data['watermark'])
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); opacity: 0.05; font-size: 5rem; font-weight: 900; color: #2b6cb0; pointer-events: none; white-space: nowrap;">
            {{ $data['watermark'] }}
        </div>
    @endif

</div>

</body>
</html>