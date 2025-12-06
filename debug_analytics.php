<?php

use App\Models\Proyecto;
use App\Models\Transaccion;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Find a project with transactions
$project = Proyecto::whereHas('transacciones')->first();

if (!$project) {
    echo "No projects with transactions found.\n";
    exit;
}

echo "Project ID: {$project->id}\n";
echo "Project Name: {$project->nombre}\n";

// Raw count of transactions
$totalTransactions = Transaccion::where('proyecto_id', $project->id)->count();
echo "Total Transactions: $totalTransactions\n";

// Count by status
$byStatus = Transaccion::where('proyecto_id', $project->id)
    ->select('status', DB::raw('count(*) as count'))
    ->groupBy('status')
    ->get();

echo "Transactions by Status:\n";
foreach ($byStatus as $stat) {
    echo " - {$stat->status}: {$stat->count}\n";
}

// Check categories types
$categories = DB::table('categorias')->select('tipo', DB::raw('count(*) as count'))->groupBy('tipo')->get();
echo "Categories Types in DB:\n";
foreach ($categories as $cat) {
    echo " - {$cat->tipo}: {$cat->count}\n";
}

// Run the Analytics Query Logic
$totals = Transaccion::where('transacciones.proyecto_id', $project->id)
    ->where('transacciones.status', 'completed')
    ->join('categorias', 'transacciones.categoria_id', '=', 'categorias.id')
    ->select(
        DB::raw("SUM(CASE WHEN categorias.tipo = 'ingreso' THEN transacciones.monto ELSE 0 END) as total_income"),
        DB::raw("SUM(CASE WHEN categorias.tipo = 'gasto' THEN transacciones.monto ELSE 0 END) as total_expenses"),
        DB::raw("COUNT(*) as transaction_count")
    )
    ->first();

echo "\nAnalytics Query Result:\n";
echo "Total Income: " . ($totals->total_income ?? 'NULL') . "\n";
echo "Total Expenses: " . ($totals->total_expenses ?? 'NULL') . "\n";
echo "Transaction Count (Completed): " . ($totals->transaction_count ?? 'NULL') . "\n";

// Check for transactions with missing categories or mismatched types
$orphaned = Transaccion::where('proyecto_id', $project->id)
    ->where('status', 'completed')
    ->whereDoesntHave('categoria')
    ->count();
echo "Completed Transactions without Category: $orphaned\n";
