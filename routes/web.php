<?php

use App\Http\Controllers\CalculatorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProyectoUiWebController;
use App\Http\Controllers\ProjectAccountUiWebController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::resource('mis-proyectos', ProyectoUiWebController::class)
    ->middleware(['auth', 'verified']);

Route::get('mis-proyectos/{mis_proyecto}/finance', [ProyectoUiWebController::class, 'finance'])
    ->name('mis-proyectos.finance')
    ->middleware(['auth', 'verified']);

Route::resource('mis-proyectos.cuentas', ProjectAccountUiWebController::class)
    ->only(['create', 'store'])
    ->middleware(['cuentas', 'cuenta']);

use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\DocumentationController;

Route::get('/', WelcomeController::class);
Route::get('/docs', [DocumentationController::class, 'index'])->name('docs.index');
Route::get('/docs/user', [DocumentationController::class, 'user'])->name('docs.user');
Route::get('/docs/dev/{path?}', [DocumentationController::class, 'dev'])->where('path', '.*')->name('docs.dev');
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
    Route::delete('/profile/photo', [ProfileController::class, 'deleteProfilePhoto'])->name('profile.photo.delete');
    Route::get('/search', \App\Http\Controllers\SearchController::class)->name('search');

    // Settings
    Route::get('/settings/theme', function () {
        return Inertia::render('Settings/GlobalTheme');
    })->name('settings.theme');

    // User Preferences
    Route::post('/preferences/theme', [\App\Http\Controllers\UserPreferencesController::class, 'updateTheme'])
        ->name('preferences.theme.update');

    // Tools Market
    Route::prefix('tools')->name('tools.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Tools/Index');
        })->name('index');

        Route::get('/financial-calculator', function () {
            return Inertia::render('Tools/FinancialCalculator');
        })->name('calculator');

        Route::post('/toggle', [ToolController::class, 'toggle'])->name('toggle');

        // Financial Calculator Routes
        Route::post('/calculator/calculate', [CalculatorController::class, 'calculate'])->name('calculator.calculate');
        Route::get('/calculator/export/csv', [CalculatorController::class, 'exportCsv'])->name('calculator.export.csv');
        Route::post('/calculator/export/pdf', [CalculatorController::class, 'exportPdf'])->name('calculator.export.pdf');
    });
});

Route::post('/language/{locale}', [\App\Http\Controllers\LanguageController::class, 'switch'])->name('language.switch');

require __DIR__ . '/auth.php';



Route::get('/fix-migrations-table', function () {
    try {
        $wrongMigration = '2025_11_28_023700_add_image_path_theme_typography_to_proyectos_table';
        $correctMigration = '2025_11_28_021238_add_theme_and_image_to_proyectos_table';

        // Remove wrong one
        \Illuminate\Support\Facades\DB::table('migrations')->where('migration', $wrongMigration)->delete();

        // Add correct one if not exists
        $exists = \Illuminate\Support\Facades\DB::table('migrations')->where('migration', $correctMigration)->exists();
        if (!$exists) {
            \Illuminate\Support\Facades\DB::table('migrations')->insert([
                'migration' => $correctMigration,
                'batch' => \Illuminate\Support\Facades\DB::table('migrations')->max('batch')
            ]);
            return 'Migrations table fixed: Swapped 023700 for 021238.';
        }
        return 'Migrations table already has correct migration.';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});
