<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use App\Models\Transaccion;
use App\Models\User;
use App\Models\Proyecto;
use App\Models\Categoria;
use App\Models\Cuenta;
use App\Models\Invitacion;
use App\Observers\TransaccionObserver;
use App\Observers\UserObserver;
use App\Policies\ProyectoPolicy;
use App\Policies\CategoriaPolicy;
use App\Policies\CuentaPolicy;
use App\Policies\TransaccionPolicy;
use App\Policies\InvitacionPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Proyecto::class => ProyectoPolicy::class,
        Categoria::class => CategoriaPolicy::class,
        Cuenta::class => CuentaPolicy::class,
        Transaccion::class => TransaccionPolicy::class,
        Invitacion::class => InvitacionPolicy::class,
    ];

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
        // Register authorization policies
        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }

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
