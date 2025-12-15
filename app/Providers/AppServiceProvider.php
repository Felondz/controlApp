<?php

namespace App\Providers;

use App\Models\User; 
use App\Models\Proyecto; 
use App\Observers\UserObserver; 
use App\Observers\ProyectoObserver; 
use Illuminate\Database\Eloquent\Relations\Relation; 
use Illuminate\Support\Facades\Gate; 
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL; 
use Illuminate\Support\ServiceProvider;

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
        // Support for nested JSON translation files (e.g., lang/es/es.json)
        app('translator')->addJsonPath(resource_path('lang/es'));
        app('translator')->addJsonPath(resource_path('lang/en'));

        // Force HTTPS in production/PTR environment
        if (config('app.env') !== 'local') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);

        // --- INICIO DE CONFIGURACIÓN DE CONTROLAPP ---

        // 1. REGISTRO DE OBSERVERS (ADR-003: Proyectos Personales)
        // Esto dispara la creación del proyecto personal al crear un nuevo usuario.
        User::observe(UserObserver::class);

        // Observer para crear categorías por defecto en proyectos nuevos (v2.6.4)
        Proyecto::observe(ProyectoObserver::class);

        // 2. REGISTRO DE MORPH MAP (ADR-002: Alias para Polimórficas)
        // Esto garantiza que la BD guarde 'proyecto' en lugar de 'App\Models\Proyecto'
        Relation::morphMap([
            'proyecto' => Proyecto::class,
            'usuario' => User::class,
        ]);

        // 3. SUPER ADMIN GOD MODE (Issue #15)
        // Permite que los super admins salten todas las restricciones de Policies
        Gate::before(function ($user, $ability) {
            if ($user->is_super_admin) {
                return true;
            }
        });
        // --- FIN DE CONFIGURACIÓN DE CONTROLAPP ---
    }
}
