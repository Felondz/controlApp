<?php

use App\Http\Controllers\CalculatorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserLlmSettingController;
use App\Http\Controllers\LlmModelsController;
use App\Http\Controllers\ProyectoUiWebController;
use App\Http\Controllers\ProjectAccountUiWebController;
use App\Http\Controllers\ProjectMessageUiWebController;
use App\Http\Controllers\ToolController;
use App\Modules\Finance\Controllers\TransaccionController;
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
    // Routes moved to project scope below
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::delete('/profile/photo', [ProfileController::class, 'deleteProfilePhoto'])->name('profile.photo.delete');

    // LLM Settings
    Route::post('/profile/llm-settings', [UserLlmSettingController::class, 'store'])->name('profile.llm-settings.store');
    Route::delete('/profile/llm-settings/{provider}', [UserLlmSettingController::class, 'destroy'])->name('profile.llm-settings.destroy');
    Route::post('/profile/llm-settings/fetch-models', [LlmModelsController::class, 'fetchModels'])->name('profile.llm-settings.fetch-models');
    Route::post('/profile/toggle-ai', [ProfileController::class, 'toggleAi'])->name('profile.toggle-ai');
    Route::get('/search', \App\Http\Controllers\SearchController::class)->name('search');
    Route::get('/inbox', [\App\Http\Controllers\InboxController::class, 'index'])->name('inbox');

    // Personal Finance
    Route::get('/finance', [\App\Http\Controllers\PersonalFinanceController::class, 'index'])->name('finance.personal');

    // Project Messages
    Route::get('mis-proyectos/{mis_proyecto}/messages', [ProjectMessageUiWebController::class, 'index'])->name('project.messages.index');
    Route::post('mis-proyectos/{mis_proyecto}/messages', [ProjectMessageUiWebController::class, 'store'])->name('project.messages.store');
    Route::put('mis-proyectos/{mis_proyecto}/messages/{message}', [ProjectMessageUiWebController::class, 'update'])->name('project.messages.update');
    Route::delete('mis-proyectos/{mis_proyecto}/messages/{message}', [ProjectMessageUiWebController::class, 'destroy'])->name('project.messages.destroy');
    Route::post('mis-proyectos/{mis_proyecto}/messages/{message}/react', [ProjectMessageUiWebController::class, 'toggleReaction'])->name('project.messages.react');
    Route::get('mis-proyectos/{mis_proyecto}/messages/read', [ProjectMessageUiWebController::class, 'markAsRead'])->name('project.messages.read'); // Should be post but current routes have it mixed
    Route::post('mis-proyectos/{mis_proyecto}/messages/read', [ProjectMessageUiWebController::class, 'markAsRead'])->name('project.messages.read.post');
    Route::get('mis-proyectos/{mis_proyecto}/messages/unread', [ProjectMessageUiWebController::class, 'unreadCounts'])->name('project.messages.unread');
    Route::get('mis-proyectos/{mis_proyecto}/messages/search', [ProjectMessageUiWebController::class, 'search'])->name('project.messages.search');

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

    // Project Accounts
    Route::delete('mis-proyectos/{proyecto}/accounts/{account}/unlink', [ProjectAccountUiWebController::class, 'unlink'])
        ->name('finance.accounts.unlink')
        ->withoutScopedBindings();

    Route::delete('mis-proyectos/{proyecto}/accounts/{account}', [ProjectAccountUiWebController::class, 'destroy'])
        ->name('finance.accounts.destroy')
        ->withoutScopedBindings();

    // Project Transactions
    Route::post('mis-proyectos/{proyecto}/transactions', [TransaccionController::class, 'store'])
        ->name('finance.transactions.store');
    Route::put('mis-proyectos/{proyecto}/transactions/{transaccion}', [TransaccionController::class, 'update'])
        ->name('finance.transactions.update');
    Route::delete('mis-proyectos/{proyecto}/transactions/{transaccion}', [TransaccionController::class, 'destroy'])
        ->name('finance.transactions.destroy');

    // Direct bill payment
    Route::post('mis-proyectos/{proyecto}/transactions/{transaccion}/pay-direct', [TransaccionController::class, 'payDirectly'])
        ->name('finance.bills.pay-direct');

    // Project Settings (Finance)
    Route::put('mis-proyectos/{project}/settings', [ProyectoUiWebController::class, 'updateSettings'])
        ->name('finance.projects.update-settings');

    // Tasks Module
    Route::resource('mis-proyectos.tasks', \App\Modules\Tasks\Controllers\TaskController::class)
        ->parameters(['mis-proyectos' => 'proyecto'])
        ->except(['create', 'edit', 'show']);

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
    Route::post('/preferences/dashboard', [\App\Http\Controllers\UserPreferencesController::class, 'updateDashboardSettings'])
        ->name('preferences.dashboard.update');
    Route::post('/preferences/complete-tour', [\App\Http\Controllers\UserPreferencesController::class, 'completeTour'])
        ->name('preferences.tour.complete');

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

// Admin User Management Routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'show'])->name('users.show');
    Route::patch('/users/{user}/status', [\App\Http\Controllers\Admin\UserController::class, 'toggleStatus'])->name('users.toggleStatus');
    Route::patch('/users/{user}/admin', [\App\Http\Controllers\Admin\UserController::class, 'toggleAdmin'])->name('users.toggleAdmin');
});



// ==========================================
// DEBUG ROUTES - ONLY AVAILABLE IN LOCAL/TESTING
// Remove these routes before production deployment
// ==========================================
if (app()->environment('local', 'testing', 'staging')) {
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

    Route::get('/debug-email', function () {
        try {
            Illuminate\Support\Facades\Log::info('Debug Email: Start');
            Illuminate\Support\Facades\Mail::raw('This is a test email from ControlApp debug route.', function ($message) {
                $message->to('test@example.com')->subject('Debug Email Test');
            });
            Illuminate\Support\Facades\Log::info('Debug Email: Dispatched');
            return 'Email dispatched via ' . config('mail.default') . '. Check logs and inbox.';
        } catch (\Exception $e) {
            Illuminate\Support\Facades\Log::error('Debug Email Error: ' . $e->getMessage());
            return 'Error: ' . $e->getMessage();
        }
    });
}
Route::get("/proyectos/{proyecto}/image", [\App\Http\Controllers\ProjectImageController::class, "show"])->middleware(["auth", "verified"])->name("projects.image");
