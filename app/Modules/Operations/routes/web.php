<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Operations\Controllers\LoteController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('proyectos/{proyecto}/operations')->group(function () {
        // Lotes Main
        Route::get('/lotes/history', [LoteController::class, 'history'])->name('operations.lotes.history');
        Route::get('/lotes', [LoteController::class, 'index'])->name('operations.lotes.index');
        Route::get('/lotes/create', [LoteController::class, 'create'])->name('operations.lotes.create');
        Route::get('/lotes/{lote}', [LoteController::class, 'show'])->name('operations.lotes.show');
        Route::post('/lotes', [LoteController::class, 'store'])->name('operations.lotes.store');
        
        // Lote Actions
        Route::put('/lotes/{lote}', [LoteController::class, 'update'])->name('operations.lotes.update');
        Route::put('/lotes/{lote}/stage', [LoteController::class, 'updateStage'])->name('operations.lotes.update-stage');
        Route::post('/lotes/{lote}/inputs', [LoteController::class, 'addInput'])->name('operations.lotes.add-input');
        Route::post('/lotes/{lote}/consume/{input}', [LoteController::class, 'consumeInput'])->name('operations.lotes.consume-input');
        Route::post('/lotes/{lote}/finish', [LoteController::class, 'finish'])->name('operations.lotes.finish');
        Route::put('/lotes/{lote}/discard', [LoteController::class, 'discard'])->name('operations.lotes.discard');

        // Processes
        Route::post('/processes', [LoteController::class, 'storeProcess'])->name('operations.processes.store');
        Route::put('/processes/{process}', [LoteController::class, 'updateProcess'])->name('operations.processes.update');
        Route::delete('/processes/{process}', [LoteController::class, 'destroyProcess'])->name('operations.processes.destroy');

        // Stage Templates (Recipe)
        Route::post('/stages/{stage}/templates', [\App\Modules\Operations\Controllers\StageTemplateController::class, 'store'])->name('operations.stage-templates.store');
        Route::delete('/templates/{template}', [\App\Modules\Operations\Controllers\StageTemplateController::class, 'destroy'])->name('operations.stage-templates.destroy');
    });
});
