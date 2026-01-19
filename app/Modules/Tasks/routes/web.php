<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Tasks Module
    // Note: The resource name 'mis-proyectos.tasks' implies nested resource under 'mis-proyectos'.
    // The parameter renaming 'mis-proyectos' => 'proyecto' is important for route model binding.
    Route::resource('mis-proyectos.tasks', \App\Modules\Tasks\Controllers\TaskController::class)
        ->parameters(['mis-proyectos' => 'proyecto'])
        ->except(['create', 'edit', 'show']);
});
