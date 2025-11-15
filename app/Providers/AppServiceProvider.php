<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Transaccion;
use App\Observers\TransaccionObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        // Transaccion  será observada por TransaccionObserver"
        Transaccion::observe(TransaccionObserver::class);
    }
}
