<?php

use Illuminate\Support\Facades\Route;
use App\Features\Finanzas\Controllers\TransaccionController;

Route::prefix('finanzas')->group(function () {
    Route::apiResource('transacciones', TransaccionController::class)
        ->parameters(['transacciones' => 'transaccion']);
});
