<?php

namespace App\Core\Modules\Contracts;

use App\Models\Proyecto;

/**
 * Interface ModuleInterface
 * 
 * Defines the contract that all modules must implement.
 * This ensures consistent behavior across all modules in the system.
 */
interface ModuleInterface
{
    /**
     * Get the unique identifier for this module.
     *
     * @return string Module identifier (e.g., 'finance', 'tasks', 'chat')
     */
    public function getName(): string;

    /**
     * Get the module version.
     *
     * @return string Semantic version (e.g., '1.0.0')
     */
    public function getVersion(): string;

    /**
     * Get the list of modules this module depends on.
     *
     * @return array<string> Array of module names
     */
    public function getDependencies(): array;

    /**
     * Get the capabilities this module provides.
     *
     * @return array{
     *     provides: array<string>,
     *     consumes: array<string>,
     *     exposes: array{
     *         api?: array<string>,
     *         events?: array<string>,
     *         widgets?: array<string>
     *     }
     * }
     */
    public function getCapabilities(): array;

    /**
     * Install the module for a specific project.
     *
     * @param Proyecto $project
     * @param array $config Optional configuration
     * @return void
     */
    public function install(Proyecto $project, array $config = []): void;

    /**
     * Uninstall the module from a specific project.
     *
     * @param Proyecto $project
     * @return void
     */
    public function uninstall(Proyecto $project): void;

    /**
     * Get the module's route definitions.
     *
     * @return array<string, array{method: string, uri: string, action: string}>
     */
    public function getRoutes(): array;

    /**
     * Get the module's migration file paths.
     *
     * @return array<string> Array of migration file paths
     */
    public function getMigrations(): array;

    /**
     * Get the module's event listeners.
     *
     * @return array<string, array<string>> Event class => [Listener classes]
     */
    public function getEventListeners(): array;

    /**
     * Get console commands defined by the module.
     *
     * @return array
     */
    public function getConsoleCommands(): array;

    /**
     * Check if the module is enabled for a specific project.
     *
     * @param Proyecto $project
     * @return bool
     */
    public function isEnabledFor(Proyecto $project): bool;

    /**
     * Get the module's configuration for a specific project.
     *
     * @param Proyecto $project
     * @return array
     */
    /**
     * Get the module's configuration for a specific project.
     *
     * @param Proyecto $project
     * @return array
     */
    public function getConfig(Proyecto $project): array;

    /**
     * Boot the module.
     * Use this to register observers, specific bindings etc.
     *
     * @return void
     */
    public function boot(): void;
}
