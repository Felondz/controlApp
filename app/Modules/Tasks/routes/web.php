<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'project.access'])->group(function () {
    // Tasks Module
    // Note: The resource name 'mis-proyectos.tasks' implies nested resource under 'mis-proyectos'.
    // The parameter renaming 'mis-proyectos' => 'proyecto' is important for route model binding.
    Route::get('mis-proyectos/{proyecto}/tasks/{task}/image', [\App\Modules\Tasks\Controllers\TaskController::class, 'image'])
        ->name('mis-proyectos.tasks.image');

    Route::resource('mis-proyectos.tasks', \App\Modules\Tasks\Controllers\TaskController::class)
        ->parameters(['mis-proyectos' => 'proyecto'])
        ->except(['create', 'edit', 'show']);
});
