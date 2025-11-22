<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProyectoUiWebController;
use App\Http\Controllers\ProjectAccountUiWebController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::resource('mis-proyectos', ProyectoUiWebController::class)
    ->middleware(['auth', 'verified']);

Route::resource('mis-proyectos.cuentas', ProjectAccountUiWebController::class)
    ->only(['create', 'store'])
    ->middleware(['cuentas', 'cuenta']);

use App\Http\Controllers\WelcomeController;

Route::get('/', WelcomeController::class);
Route::get('/dashboard', function () {
    $user = Auth::user()->fresh()->load('proyectos');

    $proyectos = $user->proyectos;

    return Inertia::render('Dashboard', ['proyectos' => $proyectos,]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
