<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        channels: __DIR__.'/../routes/channels.php',
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function () {
            // PTR routes — only loaded in staging/testing environment
            if (app()->environment('staging', 'testing') || env('PTR_MODE', false)) {
                require base_path('routes/ptr.php');
            }
        },
    )
    ->withCommands([
        __DIR__ . '/../app/Console/Commands',
    ])
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\SetUserLocale::class,
            \App\Http\Middleware\HandleInertiaRequests::class,

            \App\Http\Middleware\UpdateUserActivity::class,
        ]);

        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        $middleware->alias([
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'stripe/*',
            'http://controlapp.test/stripe/*',
            'http://localhost/stripe/*',
        ]);

        // Trust Cloudflare/Traefik proxies to fix HTTPS detection
        // ⚠️ Security: In production, set TRUSTED_PROXIES env var with specific IPs
        // ⚠️ Currently trusting all proxies only in non-production environments
        if (env('APP_ENV') !== 'production') {
            $middleware->trustProxies(at: '*');
        }
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
