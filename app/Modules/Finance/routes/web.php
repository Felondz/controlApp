<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Finance\Controllers\TransaccionController;
use App\Http\Controllers\ProyectoUiWebController;
use App\Http\Controllers\ProjectAccountUiWebController;

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Project Finance Dashboard
    Route::get('mis-proyectos/{mis_proyecto}/finance', [ProyectoUiWebController::class, 'finance'])
        ->name('mis-proyectos.finance');

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

    // Project Accounts
    Route::delete('mis-proyectos/{proyecto}/accounts/{account}/unlink', [ProjectAccountUiWebController::class, 'unlink'])
        ->name('finance.accounts.unlink')
        ->withoutScopedBindings();

    Route::delete('mis-proyectos/{proyecto}/accounts/{account}', [ProjectAccountUiWebController::class, 'destroy'])
        ->name('finance.accounts.destroy')
        ->withoutScopedBindings();
        
    // Project Settings (Finance)
    Route::put('mis-proyectos/{project}/settings', [ProyectoUiWebController::class, 'updateSettings'])
        ->name('finance.projects.update-settings');

    // Personal Finance (if considered part of the module)
    // Route::get('/finance', [\App\Http\Controllers\PersonalFinanceController::class, 'index'])->name('finance.personal');
});
