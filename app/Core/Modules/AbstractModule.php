<?php

namespace App\Core\Modules;

use App\Core\Modules\Contracts\ModuleInterface;
use App\Models\Proyecto;

/**
 * Abstract base class for all modules.
 * 
 * Provides default implementations for common module functionality.
 * Modules should extend this class and override methods as needed.
 */
abstract class AbstractModule implements ModuleInterface
{
    /**
     * Module configuration.
     *
     * @var array
     */
    protected array $config = [];

    /**
     * Module dependencies.
     *
     * @var array<string>
     */
    protected array $dependencies = [];

    /**
     * Module capabilities.
     *
     * @var array
     */
    protected array $capabilities = [
        'provides' => [],
        'consumes' => [],
        'exposes' => [
            'api' => [],
            'events' => [],
            'widgets' => [],
        ],
    ];

    /**
     * {@inheritdoc}
     */
    abstract public function getName(): string;

    /**
     * {@inheritdoc}
     */
    abstract public function getVersion(): string;

    /**
     * {@inheritdoc}
     */
    public function getDependencies(): array
    {
        return $this->dependencies;
    }

    /**
     * {@inheritdoc}
     */
    public function getCapabilities(): array
    {
        return $this->capabilities;
    }

    /**
     * {@inheritdoc}
     */
    public function install(Proyecto $project, array $config = []): void
    {
        // Default implementation: add module to project's modules array
        $modules = $project->modules ?? [];

        if (!in_array($this->getName(), $modules)) {
            $modules[] = $this->getName();
            $project->update(['modules' => $modules]);
        }

        // Store module-specific configuration
        if (!empty($config)) {
            $this->saveConfig($project, $config);
        }

        // Run module-specific installation logic
        $this->onInstall($project, $config);
    }

    /**
     * {@inheritdoc}
     */
    public function uninstall(Proyecto $project): void
    {
        // Remove module from project's modules array
        $modules = $project->modules ?? [];
        $modules = array_filter($modules, fn($m) => $m !== $this->getName());
        $project->update(['modules' => array_values($modules)]);

        // Run module-specific uninstallation logic
        $this->onUninstall($project);
    }

    /**
     * {@inheritdoc}
     */
    public function getRoutes(): array
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getMigrations(): array
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getEventListeners(): array
    {
        return [];
    }

    /**
     * Get console commands defined by the module.
     *
     * @return array
     */
    public function getConsoleCommands(): array
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function isEnabledFor(Proyecto $project): bool
    {
        $modules = $project->modules ?? [];
        return in_array($this->getName(), $modules);
    }

    /**
     * {@inheritdoc}
     */
    public function getConfig(Proyecto $project): array
    {
        $settings = $project->settings ?? [];
        return $settings['modules'][$this->getName()] ?? [];
    }

    /**
     * Hook called when module is installed.
     *
     * @param Proyecto $project
     * @param array $config
     * @return void
     */
    protected function onInstall(Proyecto $project, array $config): void
    {
        // Override in subclasses for custom installation logic
    }

    /**
     * Hook called when module is uninstalled.
     *
     * @param Proyecto $project
     * @return void
     */
    protected function onUninstall(Proyecto $project): void
    {
        // Override in subclasses for custom uninstallation logic
    }

    /**
     * Save module configuration for a project.
     *
     * @param Proyecto $project
     * @param array $config
     * @return void
     */
    protected function saveConfig(Proyecto $project, array $config): void
    {
        $settings = $project->settings ?? [];
        $settings['modules'][$this->getName()] = $config;
        $project->update(['settings' => $settings]);
    }

    /**
     * {@inheritdoc}
     */
    public function boot(): void
    {
        // construction logic in subclasses
    }
}
