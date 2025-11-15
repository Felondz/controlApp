<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',

        then: function () {

            Route::middleware(['api', 'auth:sanctum', 'super-admin'])
                ->prefix('api/admin') // URL base: /api/admin/...
                ->name('admin.')       // Nombre base 
                ->group(base_path('routes/admin.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
        $middleware->web(append: [
            HandleCors::class,  // Middleware CORS para Vite dev
        ]);

        $middleware->alias([
            'cors' => HandleCors::class,  // Alias para usar en rutas
            'super-admin' => \App\Http\Middleware\EnsureUserIsSuperAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
