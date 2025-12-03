<?php

use App\Http\Controllers\CalculatorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProyectoUiWebController;
use App\Http\Controllers\ProjectAccountUiWebController;
use App\Http\Controllers\ProjectMessageUiWebController;
use App\Http\Controllers\ToolController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::resource('mis-proyectos', ProyectoUiWebController::class)
    ->middleware(['auth', 'verified']);

Route::get('mis-proyectos/{mis_proyecto}/finance', [ProyectoUiWebController::class, 'finance'])
    ->name('mis-proyectos.finance')
    ->middleware(['auth', 'verified']);

Route::get('mis-proyectos/{mis_proyecto}/chat', [ProyectoUiWebController::class, 'chat'])
    ->name('mis-proyectos.chat')
    ->middleware(['auth', 'verified']);




use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\DocumentationController;

Route::get('/', WelcomeController::class);
Route::get('/docs', [DocumentationController::class, 'index'])->name('docs.index');
Route::get('/docs/user', [DocumentationController::class, 'user'])->name('docs.user');
Route::get('/docs/dev/{path?}', [DocumentationController::class, 'dev'])->where('path', '.*')->name('docs.dev');
Route::get('/dashboard', [ProyectoUiWebController::class, 'dashboard'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::delete('/profile/photo', [ProfileController::class, 'deleteProfilePhoto'])->name('profile.photo.delete');
    Route::get('/search', \App\Http\Controllers\SearchController::class)->name('search');
    Route::get('/inbox', [\App\Http\Controllers\InboxController::class, 'index'])->name('inbox');

    // Project Messages
    Route::get('mis-proyectos/{mis_proyecto}/messages', [ProjectMessageUiWebController::class, 'index'])->name('project.messages.index');
    Route::post('mis-proyectos/{mis_proyecto}/messages', [ProjectMessageUiWebController::class, 'store'])->name('project.messages.store');
    Route::post('mis-proyectos/{mis_proyecto}/messages/read', [ProjectMessageUiWebController::class, 'markAsRead'])->name('project.messages.read');
    Route::get('mis-proyectos/{mis_proyecto}/messages/unread', [ProjectMessageUiWebController::class, 'unreadCounts'])->name('project.messages.unread');

    // Invitations
    Route::get('/invitations', [\App\Http\Controllers\InvitationController::class, 'index'])->name('invitations.index');
    Route::post('/invitations/{invitation}/accept', [\App\Http\Controllers\InvitationController::class, 'accept'])->name('invitations.accept');
    Route::post('/invitations/{invitation}/reject', [\App\Http\Controllers\InvitationController::class, 'reject'])->name('invitations.reject');

    // Project Members
    Route::get('mis-proyectos/{proyecto}/members', [\App\Http\Controllers\ProjectMemberUiWebController::class, 'index'])
        ->name('project.members.index');
    Route::post('mis-proyectos/{proyecto}/members', [\App\Http\Controllers\ProjectMemberUiWebController::class, 'store'])
        ->name('project.members.store');
    Route::put('mis-proyectos/{proyecto}/members/{user}', [\App\Http\Controllers\ProjectMemberUiWebController::class, 'update'])
        ->name('project.members.update');
    Route::delete('mis-proyectos/{proyecto}/members/{user}', [\App\Http\Controllers\ProjectMemberUiWebController::class, 'destroy'])
        ->name('project.members.destroy');
    Route::delete('mis-proyectos/{proyecto}/invitations/{invitation}', [\App\Http\Controllers\ProjectMemberUiWebController::class, 'cancelInvitation'])
        ->name('project.invitations.destroy');
    Route::post('mis-proyectos/{proyecto}/transfer-ownership', [\App\Http\Controllers\ProjectMemberUiWebController::class, 'transferOwnership'])
        ->name('project.ownership.transfer');
    Route::get('mis-proyectos/{proyecto}/users/search', [\App\Http\Controllers\ProjectMemberUiWebController::class, 'searchUsers'])
        ->name('project.users.search');

    // Accept Invitation
    Route::get('/invitacion/{token}', [\App\Http\Controllers\ProjectMemberUiWebController::class, 'showInvitation'])
        ->name('invitation.accept');
    Route::post('/invitacion/{token}', [\App\Http\Controllers\ProjectMemberUiWebController::class, 'processInvitation'])
        ->name('invitation.process');

    // Public User Profile
    Route::get('/users/{user}', [\App\Http\Controllers\PublicUserProfileController::class, 'show'])
        ->name('users.show');

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
