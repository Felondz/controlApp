<?php

namespace App\Providers;

use App\Core\Modules\ModuleRegistry;
use App\Core\Events\ModuleEventBus;
use Illuminate\Support\ServiceProvider;

/**
 * ModuleServiceProvider
 * 
 * Bootstraps the module system.
 */
class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register(): void
    {
        // Register ModuleRegistry as singleton
        $this->app->singleton(ModuleRegistry::class, function ($app) {
            return new ModuleRegistry();
        });

        // Register ModuleEventBus as singleton
        $this->app->singleton(ModuleEventBus::class, function ($app) {
            return new ModuleEventBus();
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot(): void
    {
        $registry = $this->app->make(ModuleRegistry::class);
        $eventBus = $this->app->make(ModuleEventBus::class);

        // Discover and boot modules
        $registry->discover();
        $registry->boot();

        // Register module routes
        $this->registerModuleRoutes($registry);

        // Register event listeners
        $this->registerEventListeners($registry, $eventBus);

        // Register console commands
        if ($this->app->runningInConsole()) {
            $this->registerModuleCommands($registry);
        }
    }

    /**
     * Register routes for all enabled modules.
     *
     * @param ModuleRegistry $registry
     * @return void
     */
    protected function registerModuleRoutes(ModuleRegistry $registry): void
    {
        foreach ($registry->enabled() as $name => $module) {
            $routes = $module->getRoutes();

            if (empty($routes)) {
                continue;
            }

            // Handle 'web' routes
            if (isset($routes['web']) && is_string($routes['web']) && file_exists($routes['web'])) {
                \Illuminate\Support\Facades\Route::middleware('web')
                    ->group($routes['web']);
            }

            // Handle 'api' routes
            if (isset($routes['api']) && is_string($routes['api']) && file_exists($routes['api'])) {
                \Illuminate\Support\Facades\Route::prefix('api')
                    ->middleware('api')
                    ->group($routes['api']);
            }
        }
    }

    /**
     * Register event listeners for all enabled modules.
     *
     * @param ModuleRegistry $registry
     * @param ModuleEventBus $eventBus
     * @return void
     */
    protected function registerEventListeners(ModuleRegistry $registry, ModuleEventBus $eventBus): void
    {
        foreach ($registry->enabled() as $name => $module) {
            $listeners = $module->getEventListeners();

            if (empty($listeners)) {
                continue;
            }

            // Register listeners with the event bus
            $eventBus->registerListeners($listeners);
        }
    }

    /**
     * Register console commands for all enabled modules.
     *
     * @param ModuleRegistry $registry
     * @return void
     */
    protected function registerModuleCommands(ModuleRegistry $registry): void
    {
        foreach ($registry->enabled() as $name => $module) {
            $commands = $module->getConsoleCommands();

            if (empty($commands)) {
                continue;
            }

            $this->commands($commands);
        }
    }
}
