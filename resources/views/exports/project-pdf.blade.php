<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Reporte Financiero - {{ $proyecto->nombre }}</title>
    <style>
        body {
            font-family: sans-serif;
            color: #333;
            font-size: 10px;
        }

        h1 {
            color: #4F46E5;
            font-size: 18px;
            margin-bottom: 5px;
        }

        h2 {
            color: #6366F1;
            font-size: 14px;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 5px;
        }

        .header-info {
            color: #6B7280;
            font-size: 9px;
            margin-bottom: 15px;
        }

        .summary-container {
            width: 100%;
            margin-bottom: 20px;
            background-color: #F3F4F6;
            border-radius: 5px;
            padding: 15px;
        }

        .summary-grid {
            display: table;
            width: 100%;
        }

        .summary-item {
            display: table-cell;
            width: 33%;
            text-align: center;
            padding: 10px;
        }

        .summary-value {
            font-size: 18px;
            font-weight: bold;
        }

        .summary-value.income {
            color: #10B981;
        }

        .summary-value.expense {
            color: #EF4444;
        }

        .summary-value.balance {
            color: #4F46E5;
        }

        .summary-label {
            font-size: 9px;
            color: #6B7280;
            text-transform: uppercase;
        }

        table.data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
            margin-bottom: 20px;
        }

        table.data-table th,
        table.data-table td {
            border: 1px solid #E5E7EB;
            padding: 5px;
            text-align: left;
        }

        table.data-table th {
            background-color: #F9FAFB;
            font-weight: bold;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .income-text {
            color: #10B981;
        }

        .expense-text {
            color: #EF4444;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 8px;
            color: #9CA3AF;
        }
    </style>
</head>

<body>
    <h1>{{ $proyecto->nombre }}</h1>
    <p class="header-info">
        Reporte Financiero
        @if($from && $to)
            | {{ $from }} - {{ $to }}
        @else
            | Generado el {{ now()->format('d/m/Y H:i') }}
        @endif
    </p>

    <!-- Summary Section -->
    <div class="summary-container">
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-value income">${{ number_format($totalIncome, 2) }}</div>
                <div class="summary-label">Ingresos</div>
            </div>
            <div class="summary-item">
                <div class="summary-value expense">${{ number_format($totalExpenses, 2) }}</div>
                <div class="summary-label">Gastos</div>
            </div>
            <div class="summary-item">
                <div class="summary-value balance">${{ number_format($balance, 2) }}</div>
                <div class="summary-label">Balance</div>
            </div>
        </div>
    </div>

    @if($type === 'summary' || $type === 'all')
        <!-- Accounts Section -->
        @if($accounts->count() > 0)
            <h2>Cuentas ({{ $accounts->count() }})</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th class="text-right">Saldo</th>
                        <th class="text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($accounts as $account)
                        <tr>
                            <td>{{ $account->nombre }}</td>
                            <td>{{ ucfirst($account->tipo) }}</td>
                            <td class="text-right {{ $account->saldo >= 0 ? 'income-text' : 'expense-text' }}">
                                ${{ number_format($account->saldo, 2) }}
                            </td>
                            <td class="text-center">{{ ucfirst($account->estado) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    @endif

    @if($type === 'transactions' || $type === 'all')
        <!-- Transactions Section -->
        @if($transactions->count() > 0)
            <h2>Transacciones ({{ $transactions->count() }})</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Cuenta</th>
                        <th class="text-right">Monto</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($transactions as $t)
                        <tr>
                            <td>{{ \Carbon\Carbon::parse($t->fecha)->format('d/m/Y') }}</td>
                            <td>{{ $t->descripcion ?? 'Sin descripción' }}</td>
                            <td>{{ $t->categoria?->nombre ?? 'Sin categoría' }}</td>
                            <td>{{ $t->cuenta?->nombre ?? 'Sin cuenta' }}</td>
                            <td class="text-right {{ $t->monto > 0 ? 'income-text' : 'expense-text' }}">
                                ${{ number_format(abs($t->monto) / 100, 2) }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    @endif

    <div class="footer">
        Generado por ControlApp | {{ now()->format('d/m/Y H:i:s') }}
    </div>
</body>

</html>