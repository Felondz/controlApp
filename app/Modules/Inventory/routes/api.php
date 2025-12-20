<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Inventory\Controllers\InventoryItemController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('proyectos/{proyecto}/inventory')->group(function () {
        Route::get('/items', [InventoryItemController::class, 'index'])->name('api.inventory.items.index');
        Route::post('/items', [InventoryItemController::class, 'store'])->name('api.inventory.items.store');
        Route::get('/items/{item}', [InventoryItemController::class, 'show'])->name('api.inventory.items.show');
        Route::put('/items/{item}', [InventoryItemController::class, 'update'])->name('api.inventory.items.update');
        Route::delete('/items/{item}', [InventoryItemController::class, 'destroy'])->name('api.inventory.items.destroy');
    });
});
