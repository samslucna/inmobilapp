<!DOCTYPE html>
<html lang="es">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recibos - {{ $data['records']->id }}</title>
    
    <style>
        /* Reset y estilos base */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            background: #f5f7fa;
            padding: 20px;
            color: #333;
        }
        
        /* Contenedor principal */
        .main-container {
            max-width: 1200px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            padding: 30px;
        }
        
        /* Encabezado */
        .header {
            text-align: center;
            border-bottom: 3px solid #2B6CB0;
            padding-bottom: 20px;
            margin-bottom: 25px;
        }
        
        .header h1 {
            color: #2B6CB0;
            font-size: 28px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .header .date {
            color: #718096;
            font-size: 14px;
            margin-top: 5px;
        }
        
        .header .subtitle {
            color: #4A5568;
            font-size: 16px;
            margin-top: 5px;
            font-weight: bold;
        }
        
        /* Tablas */
        .table-container {
            margin-bottom: 30px;
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }
        
        .table-info {
            border: 2px solid #e2e8f0;
            border-radius: 8px;
        }
        
        .table-info td {
            padding: 12px 10px;
            border: 1px solid #e2e8f0;
            font-size: 13px;
        }
        
        .table-info tr:nth-child(even) {
            background-color: #f7fafc;
        }
        
        .table-info .label {
            font-weight: 700;
            color: #2B6CB0;
            background-color: #ebf8ff;
            width: 15%;
            text-align: center;
        }
        
        .table-info .value {
            font-weight: 600;
            color: #2d3748;
            text-align: center;
        }
        
        .table-info .highlight {
            color: #e53e3e;
            font-weight: 700;
        }
        
        /* Tabla de recibos */
        .tickets-section {
            margin-top: 30px;
        }
        
        .tickets-section h3 {
            color: #2B6CB0;
            font-size: 20px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .table-tickets {
            border: 2px solid #e2e8f0;
            border-radius: 8px;
        }
        
        .table-tickets th {
            background: #49aa46;
            color: white;
            font-weight: 700;
            padding: 12px;
            text-align: center;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .table-tickets td {
            padding: 12px;
            border: 1px solid #e2e8f0;
            text-align: center;
            font-size: 13px;
        }
        
        .table-tickets tr:nth-child(even) {
            background-color: #f7fafc;
        }
        
        .table-tickets tr:hover {
            background-color: #edf2f7;
        }
        
        /* Resumen y totales */
        .summary {
            margin-top: 25px;
            padding: 20px;
            background: #f7fafc;
            border-radius: 8px;
            border: 2px solid #e2e8f0;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .summary-item {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .summary-item .label {
            font-size: 12px;
            color: #718096;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        
        .summary-item .value {
            font-size: 22px;
            font-weight: 700;
            color: #2B6CB0;
            margin-top: 5px;
        }
     
        
        .summary-item .value.paid {
            color: #38a169;
        }
        
        /* Estados con colores */
        .status {
            display: inline-block;
            padding: 4px 15px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
        }
        
        .status.paid {
            background: #c6f6d5;
            color: #22543d;
        }
        
        .status.paying {
            background: #fefcbf;
            color: #744210;
        }
        
        .status.finished {
            background: #bee3f8;
            color: #2a4365;
        }
        
        /* Pie de página */
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #718096;
        }
        
        .footer .company {
            font-weight: 700;
            color: #2bb072;
            font-size: 14px;
        }
        
        /* Responsive */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .main-container {
                box-shadow: none;
                border-radius: 0;
                padding: 20px;
            }
            .table-tickets tr:hover {
                background-color: #f7fafc;
            }
        }
        
        @media (max-width: 768px) {
            .main-container {
                padding: 15px;
            }
            .table-info td {
                padding: 8px;
                font-size: 12px;
            }
            .table-tickets th,
            .table-tickets td {
                padding: 8px;
                font-size: 11px;
            }
            .header h1 {
                font-size: 22px;
            }
            .summary-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
        
        @media (max-width: 480px) {
            .table-info td {
                font-size: 10px;
                padding: 5px;
            }
            .table-tickets th,
            .table-tickets td {
                font-size: 10px;
                padding: 5px;
            }
            .summary-grid {
                grid-template-columns: 1fr;
            }
            .summary-item .value {
                font-size: 18px;
            }
        }
    </style>
</head>

<body>
    <div class="main-container">
        <!-- Encabezado -->
        <div class="header">
            <h1>{{ $data['title'] }}</h1>
            <div class="subtitle">Detalle de Pagos y Abonos</div>
            <div class="date">Fecha de emisión: {{ $data['date'] }}</div>
        </div>

        <!-- Información del Contrato -->
        <div class="table-container">
            <table class="table-info">
                <tr>
                    <td class="label">Contrato #</td>
                    <td class="value"><strong>{{ $data['records']->id }}</strong></td>
                    
                    <td class="label">Cliente</td>
                    <td class="value" colspan="3">
                        <strong>{{ strtoupper($data['records']->buyer->name) }} {{ strtoupper($data['records']->buyer->lastnames) }}</strong>
                    </td>
                </tr>
                <tr>
                    <td class="label">N° Lote</td>
                    <td class="value"><strong>{{ $data['records']->property->id }}</strong></td>
                    
                    <td class="label">Lote</td>
                    <td class="value"><strong>{{ $data['records']->property->name }}</strong></td>
                    
                    <td class="label">Costo ($)</td>
                    <td class="value"><strong>$ {{ number_format($data['records']->property->amount_init, 2) }}</strong></td>
                </tr>
                <tr>
                    <td class="label">Abonado</td>
                    <td class="value paid"><strong>$ {{ number_format($data['total'], 2) }}</strong></td>
                    
                    <td class="label">Saldo</td>
                    <td class="value highlight">
                        <strong>$ {{ number_format($data['records']->property->amount_init - $data['total'], 2) }}</strong>
                    </td>
                    
                    <td class="label">Estado</td>
                    <td class="value">
                        @php
                            $restante = $data['records']->property->amount_init - $data['total'];
                            if ($data['records']->amount == $data['total']) {
                                $estado = 'Finiquitado';
                                $clase = 'finished';
                            } elseif ($restante > 0) {
                                $estado = 'Pagando';
                                $clase = 'paying';
                            } else {
                                $estado = 'Pagado';
                                $clase = 'paid';
                            }
                        @endphp
                        <span class="status {{ $clase }}">{{ $estado }}</span>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Tabla de Recibos -->
        <div class="tickets-section">
            <h3>Historial de Recibos</h3>
            
            <div class="table-container">
                <table class="table-tickets">
                    <thead>
                        <tr>
                            <th style="width:10%">N° Recibo</th>
                            <th style="width:20%">Fecha</th>
                            <th style="width:50%">Concepto</th>
                            <th style="width:20%">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($data['records']->tickets as $record)
                            <tr>
                                <td><strong>#{{ $record->id }}</strong></td>
                                <td>{{ \Carbon\Carbon::parse($record->date)->format('d/m/Y') }}</td>
                                <td>{{ $record->concept }}</td>
                                <td><strong>$ {{ number_format($record->amount, 2) }}</strong></td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" style="text-align: center; padding: 30px; color: #718096;">
                                    <strong>No hay recibos registrados para este contrato</strong>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Resumen de Totales -->
        <div class="summary">
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="label">Total del Contrato</span>
                    <span class="value total">$ {{ number_format($data['records']->property->amount_init, 2) }}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Abonado</span>
                    <span class="value paid">$ {{ number_format($data['total'], 2) }}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Saldo Pendiente</span>
                    <span class="value" style="color: #e53e3e;">
                        $ {{ number_format($data['records']->property->amount_init - $data['total'], 2) }}
                    </span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Recibos</span>
                    <span class="value" style="color: #2B6CB0;">
                        {{ $data['records']->tickets->count() }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Pie de página -->
        <div class="footer">
            <div class="company">MOTSAKKI-TJU</div>
            <div>Documento generado automáticamente el {{ $data['date'] }}</div>
            <div style="margin-top: 5px; color: #a0aec0;">
                * Este documento es un resumen informativo de los pagos realizados
            </div>
        </div>
    </div>
</body>
</html>