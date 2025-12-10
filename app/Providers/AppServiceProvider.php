<?php

namespace App\Providers;

use App\Models\User; // 💡 Importar el modelo User
use App\Models\Proyecto; // 💡 Importar el modelo Proyecto
use App\Observers\UserObserver; // 💡 Importar el UserObserver
use App\Observers\ProyectoObserver; // 💡 Importar el ProyectoObserver
use Illuminate\Database\Eloquent\Relations\Relation; // 💡 Importar para MorphMap
use Illuminate\Support\Facades\Gate; // 💡 Importar Gate
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL; // 💡 Importar URL Facade
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
        // --- FIX: FORCE HTTPS (Error Mixed Content) ---
        // --- FIX: FORCE HTTPS (Error Mixed Content) ---
        // Si la URL configurada es HTTPS (en .env), forzamos esquemas HTTPS en todo el sitio.
        // Esto arregla el problema en PTR (donde APP_ENV=local pero usamos HTTPS por Cloudflare).
        if (str_starts_with(config('app.url'), 'https://')) {
            URL::forceScheme('https');
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
