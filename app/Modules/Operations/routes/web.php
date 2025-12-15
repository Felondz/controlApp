<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Operations\Controllers\LoteController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('proyectos/{proyecto}/operations')->group(function () {
        Route::get('/lotes', [LoteController::class, 'index'])->name('operations.lotes.index');
        Route::get('/lotes/create', [LoteController::class, 'create'])->name('operations.lotes.create');
        Route::post('/lotes', [LoteController::class, 'store'])->name('operations.lotes.store');
    });
});
