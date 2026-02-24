<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Inventory\Controllers\InventoryItemController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('proyectos/{proyecto}/inventory')->group(function () {
        Route::apiResource('items', InventoryItemController::class)
            ->except(['show'])
            ->names([
                'index' => 'api.inventory.items.index',
                'store' => 'api.inventory.items.store',
                'update' => 'api.inventory.items.update',
                'destroy' => 'api.inventory.items.destroy',
            ]);
    });
});
