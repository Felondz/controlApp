<?php

declare(strict_types=1);

use App\Modules\BugReporter\Controllers\BugReportController;
use App\Modules\BugReporter\Controllers\BugReportScreenshotController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PTR Routes (Public Test Realm)
|--------------------------------------------------------------------------
|
| These routes are only loaded when APP_ENV=staging.
| They are protected by RequirePtrEnvironment middleware for extra safety.
|
*/

Route::middleware(['web', 'auth', \App\Http\Middleware\RequirePtrEnvironment::class])
    ->prefix('ptr')
    ->group(function (): void {
        Route::get('/bug-reports', [BugReportController::class, 'index'])->name('ptr.bug-reports.index');
        Route::post('/bug-reports', [BugReportController::class, 'store'])->name('ptr.bug-reports.store');
        Route::patch('/bug-reports/{bugReport}', [BugReportController::class, 'update'])->name('ptr.bug-reports.update');
        Route::get('/bug-reports/stats', [BugReportController::class, 'stats'])->name('ptr.bug-reports.stats');
        Route::get('/bug-reports/export', [BugReportController::class, 'exportJson'])->name('ptr.bug-reports.export');
        Route::get('/bug-reports/{bugReport}/screenshot', [BugReportScreenshotController::class, 'show'])
            ->name('ptr.bug-reports.screenshot');
        Route::get('/bug-reports/gallery/{image}', [BugReportScreenshotController::class, 'showImage'])
            ->name('ptr.bug-reports.gallery.image');
    });
