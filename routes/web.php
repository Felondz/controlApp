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
    // Cargar proyectos y categorías (que no son sensibles)
    $user = Auth::user();
    
    // Obtenemos los proyectos (personales + membresías)
    // Nota: Como quitamos el $with global, cargamos solo lo necesario para la UI básica
    $proyectos = $user->proyectosPersonales->merge($user->proyectos);
    
    // Procesamos para agregar flag de admin
    $proyectos->transform(function ($proyecto) use ($user) {
        $proyecto->isAdmin = $user->esAdminDe($proyecto);
        return $proyecto;
    });

    return Inertia::render('Dashboard', ['proyectos' => $proyectos]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/search', \App\Http\Controllers\SearchController::class)->name('search');
});

Route::post('/language/{locale}', [\App\Http\Controllers\LanguageController::class, 'switch'])->name('language.switch');

require __DIR__ . '/auth.php';

Route::get('/test-phase1', function () {
    $user = \App\Models\User::first() ?? \App\Models\User::factory()->create();
    
    $project = \App\Models\Proyecto::create([
        'nombre' => 'Test Project Dynamic',
        'user_id' => $user->id,
        'modules' => ['finance', 'tasks'],
        'color' => '#FF5733',
        'icon' => '🚀',
    ]);

    return response()->json([
        'project' => $project,
        'modules_type' => gettype($project->modules),
        'factory_project' => \App\Models\Proyecto::factory()->create(['user_id' => $user->id]),
    ]);
});
