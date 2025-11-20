<?php

namespace App\Providers;

use App\Models\User; // 💡 Importar el modelo User
use App\Observers\UserObserver; // 💡 Importar el UserObserver
use Illuminate\Database\Eloquent\Relations\Relation; // 💡 Importar para MorphMap
use Illuminate\Support\Facades\Vite;
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
        Vite::prefetch(concurrency: 3);

        // --- INICIO DE CONFIGURACIÓN DE CONTROLAPP ---

        // 1. REGISTRO DE OBSERVERS (ADR-003: Proyectos Personales)
        // Esto dispara la creación del proyecto personal al crear un nuevo usuario.
        User::observe(UserObserver::class);

        // 2. REGISTRO DE MORPH MAP (ADR-002: Alias para Polimórficas)
        // Esto garantiza que la BD guarde 'proyecto' en lugar de 'App\Models\Proyecto'
        Relation::morphMap([
            'proyecto' => \App\Models\Proyecto::class,
            'usuario' => \App\Models\User::class, // Aunque User ya está importado, lo definimos aquí
        ]);
        // --- FIN DE CONFIGURACIÓN DE CONTROLAPP ---
    }
}
