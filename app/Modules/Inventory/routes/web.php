<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Inventory\Controllers\InventoryItemController;

// Middleware 'auth' and verification logic should be applied in ServiceProvider or here?
// Usually applied in grouping.

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('proyectos/{proyecto}/inventory')->group(function () {
        Route::get('/items', [InventoryItemController::class, 'index'])->name('inventory.items.index');
        Route::post('/items', [InventoryItemController::class, 'store'])->name('inventory.items.store');
        Route::get('/items/{item}', [InventoryItemController::class, 'show'])->name('inventory.items.show');
    });
});
