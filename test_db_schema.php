<?php

use App\Models\Transaccion;
use App\Models\Proyecto;
use App\Models\Categoria;
use App\Models\User;

// Get first project, category, user
$project = Proyecto::first();
$category = Categoria::first();
$user = User::first();

if (!$project || !$category || !$user) {
    echo "Missing data for test.\n";
    exit(1);
}

try {
    $t = Transaccion::create([
        'proyecto_id' => $project->id,
        'cuenta_id' => null, // Testing nullable
        'categoria_id' => $category->id,
        'user_id' => $user->id,
        'monto' => -1000,
        'descripcion' => 'Test Pending Bill',
        'fecha' => now(),
        'status' => 'pending'
    ]);
    echo "Success: Created transaction with null account. ID: " . $t->id . "\n";
    // Clean up
    $t->delete();
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
