<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Finance\Controllers\TransaccionController;
use App\Http\Controllers\ProjectAccountUiWebController; // Assuming we reuse this or creating a new API specific one? The route uses this.
use App\Http\Controllers\ProjectMemberUiWebController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('proyectos/{proyecto}')->group(function () {
        
        // Settings (Finance)
        // Route::put('/settings', [ProyectoUiWebController::class, 'updateSettings'])->name('api.finance.projects.update-settings');

        // Accounts
        // Note: ProjectAccountUiWebController might return Inertia responses. 
        // Ideally we should have ProjectAccountController for API. 
        // Mapping existing routes as requested.
        Route::delete('/accounts/{account}/unlink', [ProjectAccountUiWebController::class, 'unlink'])
            ->name('api.finance.accounts.unlink')
            ->withoutScopedBindings();
        Route::delete('/accounts/{account}', [ProjectAccountUiWebController::class, 'destroy'])
            ->name('api.finance.accounts.destroy')
            ->withoutScopedBindings();

        // Transactions
        // TransaccionController is likely shared
        Route::post('/transactions', [TransaccionController::class, 'store'])
            ->name('api.finance.transactions.store');
        Route::put('/transactions/{transaccion}', [TransaccionController::class, 'update'])
            ->name('api.finance.transactions.update');
        Route::delete('/transactions/{transaccion}', [TransaccionController::class, 'destroy'])
            ->name('api.finance.transactions.destroy');
        Route::post('/transactions/{transaccion}/pay-direct', [TransaccionController::class, 'payDirectly'])
            ->name('api.finance.bills.pay-direct');

        // Members (Technically part of Core/Project but often grouped near Finance for permissions)
        // Moving to Core or treating as Project Utils? 
        // The user asked to sync "Module" routes. Members seem core.
        // But Finance routes were mixed in web.php. 
        // I will stick to Finance specific routes (Transactions, Accounts).
    });
});
