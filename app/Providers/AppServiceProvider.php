<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Relations\Relation;

use Illuminate\Support\ServiceProvider;
use App\Models\Transaccion;
use App\Models\User;
use App\Observers\TransaccionObserver;
use App\Observers\UserObserver;

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
        // Register morph map for Proyecto
        Relation::morphMap([
            'proyecto' => \App\Models\Proyecto::class,
        ]);

        // Transaccion será observada por TransaccionObserver
        Transaccion::observe(TransaccionObserver::class);

        // User será observada por UserObserver
        User::observe(UserObserver::class);
    }
}
