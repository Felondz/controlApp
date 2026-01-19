<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Operations\Controllers\LoteController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('proyectos/{proyecto}/operations')->group(function () {
        // Lotes Main
        Route::get('/lotes', [LoteController::class, 'index'])->name('api.operations.lotes.index');
        Route::post('/lotes', [LoteController::class, 'store'])->name('api.operations.lotes.store');
        Route::get('/lotes/{lote}', [LoteController::class, 'show'])->name('api.operations.lotes.show');
        
        // Lote Actions
        Route::put('/lotes/{lote}', [LoteController::class, 'update'])->name('api.operations.lotes.update');
        Route::put('/lotes/{lote}/stage', [LoteController::class, 'updateStage'])->name('api.operations.lotes.update-stage');
        Route::post('/lotes/{lote}/inputs', [LoteController::class, 'addInput'])->name('api.operations.lotes.add-input');
        Route::post('/lotes/{lote}/consume/{input}', [LoteController::class, 'consumeInput'])->name('api.operations.lotes.consume-input');
        Route::post('/lotes/{lote}/finish', [LoteController::class, 'finish'])->name('api.operations.lotes.finish');
        Route::put('/lotes/{lote}/discard', [LoteController::class, 'discard'])->name('api.operations.lotes.discard');

        // Processes
        Route::post('/processes', [LoteController::class, 'storeProcess'])->name('api.operations.processes.store');
        Route::put('/processes/{process}', [LoteController::class, 'updateProcess'])->name('api.operations.processes.update');
        Route::delete('/processes/{process}', [LoteController::class, 'destroyProcess'])->name('api.operations.processes.destroy');

        // Stage Templates (Recipe)
        // Ignoring StageTemplateController for now as simple controller is not imported in web.php context either (full namespace used there)
        Route::post('/stages/{stage}/templates', [\App\Modules\Operations\Controllers\StageTemplateController::class, 'store'])->name('api.operations.stage-templates.store');
        Route::delete('/templates/{template}', [\App\Modules\Operations\Controllers\StageTemplateController::class, 'destroy'])->name('api.operations.stage-templates.destroy');
    });
});
