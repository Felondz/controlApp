<?php

namespace App\Core\Modules;

use App\Core\Modules\Contracts\ModuleInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

/**
 * ModuleRegistry
 * 
 * Central registry for discovering, loading, and managing modules.
 */
class ModuleRegistry
{
    /**
     * Registered modules.
     *
     * @var array<string, ModuleInterface>
     */
    protected array $modules = [];

    /**
     * Module configurations from config/modules.php
     *
     * @var array
     */
    protected array $config;

    /**
     * Whether modules have been discovered.
     *
     * @var bool
     */
    protected bool $discovered = false;

    public function __construct()
    {
        $this->config = config('modules', []);
    }

    /**
     * Register a module.
     *
     * @param string $name
     * @param ModuleInterface $module
     * @return void
     */
    public function register(string $name, ModuleInterface $module): void
    {
        $this->modules[$name] = $module;
    }

    /**
     * Get a registered module.
     *
     * @param string $name
     * @return ModuleInterface|null
     */
    public function get(string $name): ?ModuleInterface
    {
        if (!$this->discovered) {
            $this->discover();
        }

        return $this->modules[$name] ?? null;
    }

    /**
     * Get all registered modules.
     *
     * @return array<string, ModuleInterface>
     */
    public function all(): array
    {
        if (!$this->discovered) {
            $this->discover();
        }

        return $this->modules;
    }

    /**
     * Get all enabled modules.
     *
     * @return array<string, ModuleInterface>
     */
    public function enabled(): array
    {
        return array_filter($this->all(), function ($module, $name) {
            $config = $this->config['registry'][$name] ?? [];
            return ($config['enabled'] ?? false) === true;
        }, ARRAY_FILTER_USE_BOTH);
    }

    /**
     * Discover modules from configuration and filesystem.
     *
     * @return void
     */
    public function discover(): void
    {
        if ($this->discovered) {
            return;
        }

        // Try to load from cache
        if ($this->shouldUseCache()) {
            $cached = $this->loadFromCache();
            if ($cached !== null) {
                $this->modules = $cached;
                $this->discovered = true;
                return;
            }
        }

        // Discover from config
        $this->discoverFromConfig();

        // Discover from filesystem
        $this->discoverFromFilesystem();

        // Cache the results
        if ($this->shouldUseCache()) {
            $this->saveToCache();
        }

        $this->discovered = true;
    }

    /**
     * Boot all enabled modules.
     *
     * @return void
     */
    public function boot(): void
    {
        foreach ($this->enabled() as $name => $module) {
            // Modules can perform initialization here if needed
            // For now, just ensure they're loaded
        }
    }

    /**
     * Check if a module exists.
     *
     * @param string $name
     * @return bool
     */
    public function has(string $name): bool
    {
        if (!$this->discovered) {
            $this->discover();
        }

        return isset($this->modules[$name]);
    }

    /**
     * Resolve module dependencies.
     *
     * @param string $moduleName
     * @return array<string> Ordered list of module names (dependencies first)
     * @throws \RuntimeException
     */
    public function resolveDependencies(string $moduleName): array
    {
        $module = $this->get($moduleName);
        if (!$module) {
            throw new \RuntimeException("Module '{$moduleName}' not found");
        }

        $resolved = [];
        $this->resolveDependenciesRecursive($moduleName, $resolved, []);

        return $resolved;
    }

    /**
     * Discover modules from config/modules.php
     *
     * @return void
     */
    protected function discoverFromConfig(): void
    {
        $registry = $this->config['registry'] ?? [];

        foreach ($registry as $name => $config) {
            if (!isset($config['class'])) {
                continue;
            }

            if (!class_exists($config['class'])) {
                continue;
            }

            try {
                $module = app($config['class']);
                if ($module instanceof ModuleInterface) {
                    $this->register($name, $module);
                }
            } catch (\Exception $e) {
                // Log error but continue
                logger()->error("Failed to load module '{$name}': {$e->getMessage()}");
            }
        }
    }

    /**
     * Discover modules from filesystem.
     *
     * @return void
     */
    protected function discoverFromFilesystem(): void
    {
        $paths = $this->config['discovery']['paths'] ?? [];

        foreach ($paths as $path) {
            if (!File::isDirectory($path)) {
                continue;
            }

            $this->scanDirectory($path);
        }
    }

    /**
     * Scan a directory for module files.
     *
     * @param string $directory
     * @return void
     */
    protected function scanDirectory(string $directory): void
    {
        $files = File::glob($directory . '/*Module.php');

        foreach ($files as $file) {
            $className = $this->getClassNameFromFile($file);

            if (!$className || !class_exists($className)) {
                continue;
            }

            try {
                $module = app($className);
                if ($module instanceof ModuleInterface) {
                    $this->register($module->getName(), $module);
                }
            } catch (\Exception $e) {
                logger()->error("Failed to load module from '{$file}': {$e->getMessage()}");
            }
        }
    }

    /**
     * Get class name from file path.
     *
     * @param string $file
     * @return string|null
     */
    protected function getClassNameFromFile(string $file): ?string
    {
        $relativePath = str_replace(app_path() . '/', '', $file);
        $relativePath = str_replace('.php', '', $relativePath);
        $className = 'App\\' . str_replace('/', '\\', $relativePath);

        return $className;
    }

    /**
     * Resolve dependencies recursively.
     *
     * @param string $moduleName
     * @param array $resolved
     * @param array $seen
     * @return void
     * @throws \RuntimeException
     */
    protected function resolveDependenciesRecursive(string $moduleName, array &$resolved, array $seen): void
    {
        if (in_array($moduleName, $seen)) {
            throw new \RuntimeException("Circular dependency detected: " . implode(' -> ', $seen) . " -> {$moduleName}");
        }

        if (in_array($moduleName, $resolved)) {
            return;
        }

        $module = $this->get($moduleName);
        if (!$module) {
            throw new \RuntimeException("Module '{$moduleName}' not found");
        }

        $seen[] = $moduleName;

        foreach ($module->getDependencies() as $dependency) {
            $this->resolveDependenciesRecursive($dependency, $resolved, $seen);
        }

        $resolved[] = $moduleName;
    }

    /**
     * Check if caching should be used.
     *
     * @return bool
     */
    protected function shouldUseCache(): bool
    {
        return !app()->environment('local', 'testing');
    }

    /**
     * Load modules from cache.
     *
     * @return array|null
     */
    protected function loadFromCache(): ?array
    {
        $cachePath = $this->config['discovery']['cache'] ?? null;

        if (!$cachePath || !File::exists($cachePath)) {
            return null;
        }

        try {
            $cached = include $cachePath;

            // Instantiate modules from cached class names
            $modules = [];
            foreach ($cached as $name => $className) {
                if (class_exists($className)) {
                    $modules[$name] = app($className);
                }
            }

            return $modules;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Save modules to cache.
     *
     * @return void
     */
    protected function saveToCache(): void
    {
        $cachePath = $this->config['discovery']['cache'] ?? null;

        if (!$cachePath) {
            return;
        }

        $cacheDir = dirname($cachePath);
        if (!File::isDirectory($cacheDir)) {
            File::makeDirectory($cacheDir, 0755, true);
        }

        // Cache module class names
        $cached = [];
        foreach ($this->modules as $name => $module) {
            $cached[$name] = get_class($module);
        }

        $content = '<?php return ' . var_export($cached, true) . ';';
        File::put($cachePath, $content);
    }
}
