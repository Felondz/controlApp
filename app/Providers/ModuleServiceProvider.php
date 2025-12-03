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

            // Register module routes
            // This is a placeholder - actual implementation would use Route facade
            // and properly namespace the routes
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
}
