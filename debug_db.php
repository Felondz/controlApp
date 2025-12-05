<?php

use Illuminate\Support\Facades\DB;
use App\Models\Transaccion;

// Load Laravel application
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- DB Structure ---\n";
$columns = DB::select('describe transacciones');
foreach ($columns as $col) {
    echo "{$col->Field} | {$col->Type} | {$col->Null} | {$col->Default}\n";
}

echo "\n--- Last Transaction ---\n";
$last = Transaccion::latest()->first();
if ($last) {
    echo json_encode($last->toArray(), JSON_PRETTY_PRINT);
} else {
    echo "No transactions found.";
}
echo "\n";
