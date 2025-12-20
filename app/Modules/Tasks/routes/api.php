<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Tasks\Controllers\TaskController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('proyectos/{proyecto}')->group(function () {
        
        // Tasks Resource
        // Matches web.php: Route::resource('mis-proyectos.tasks', ...)
        Route::apiResource('tasks', TaskController::class)
            ->names([
                'index' => 'api.tasks.index',
                'store' => 'api.tasks.store',
                'show' => 'api.tasks.show',
                'update' => 'api.tasks.update',
                'destroy' => 'api.tasks.destroy',
            ]);
    });
});
