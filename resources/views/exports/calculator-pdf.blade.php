<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Proyección de Crédito</title>
    <style>
        body {
            font-family: sans-serif;
            color: #333;
            font-size: 10px;
        }

        h1 {
            color: #4F46E5;
            font-size: 16px;
            margin-bottom: 10px;
        }

        .summary-container {
            width: 100%;
            margin-bottom: 15px;
            background-color: #F3F4F6;
            border-radius: 5px;
            padding: 10px;
        }

        .summary-table {
            width: 100%;
            border: none;
        }

        .summary-table td {
            border: none;
            padding: 2px 5px;
            text-align: left;
        }

        .summary-label {
            font-weight: bold;
            color: #4B5563;
        }

        table.data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
        }

        table.data-table th,
        table.data-table td {
            border: 1px solid #E5E7EB;
            padding: 4px;
            text-align: right;
        }

        table.data-table th {
            background-color: #F9FAFB;
            font-weight: bold;
            text-align: center;
        }

        .chart-container {
            text-align: center;
            margin-bottom: 15px;
        }

        .chart-img {
            width: auto;
            height: auto;
            max-width: 60%;
            max-height: 250px;
        }
    </style>
</head>

<body>
    <h1>Proyección de Crédito</h1>

    <div class="summary-container">
        <table class="summary-table">
            <tr>
                <td><span class="summary-label">Monto:</span> ${{ number_format($results['inputs']['amount'], 0) }}</td>
                <td><span class="summary-label">Cuota Estimada:</span>
                    ${{ number_format($results['monthlyPayment'], 0) }}</td>
            </tr>
            <tr>
                <td><span class="summary-label">Tasa:</span> {{ $results['inputs']['rate'] }}%
                    ({{ $results['inputs']['rateType'] }})</td>
                <td><span class="summary-label">Total Intereses:</span>
                    ${{ number_format($results['totalInterest'], 0) }}</td>
            </tr>
            <tr>
                <td><span class="summary-label">Plazo:</span> {{ $results['inputs']['term'] }}
                    {{ $results['inputs']['termType'] == 'months' ? 'Meses' : 'Años' }}
                </td>
                <td><span class="summary-label">Total a Pagar:</span> ${{ number_format($results['totalPayment'], 0) }}
                </td>
            </tr>
        </table>
    </div>

    @if($chartImage)
        <div class="chart-container">
            <img src="{{ $chartImage }}" class="chart-img">
        </div>
    @endif

    <table class="data-table">
        <thead>
            <tr>
                <th>Mes</th>
                <th>Cuota</th>
                <th>Interés</th>
                <th>Capital</th>
                <th>Saldo</th>
            </tr>
        </thead>
        <tbody>
            @foreach($results['schedule'] as $row)
                <tr>
                    <td style="text-align: center;">{{ $row['month'] }}</td>
                    <td>${{ number_format($row['payment'], 0) }}</td>
                    <td>${{ number_format($row['interest'], 0) }}</td>
                    <td>${{ number_format($row['principal'], 0) }}</td>
                    <td>${{ number_format($row['balance'], 0) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>