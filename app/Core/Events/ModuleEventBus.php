<?php

namespace App\Core\Events;

use App\Core\Events\Contracts\ModuleEvent;
use Illuminate\Support\Facades\Log;

/**
 * ModuleEventBus
 * 
 * Handles inter-module communication via events.
 * Provides pub/sub mechanism for decoupled module interaction.
 */
class ModuleEventBus
{
    /**
     * Event listeners.
     *
     * @var array<string, array<callable>>
     */
    protected array $listeners = [];

    /**
     * Event bus configuration.
     *
     * @var array
     */
    protected array $config;

    public function __construct()
    {
        $this->config = config('modules.event_bus', []);
    }

    /**
     * Dispatch an event to all registered listeners.
     *
     * @param ModuleEvent $event
     * @return void
     */
    public function dispatch(ModuleEvent $event): void
    {
        $eventName = $event->getName();

        if ($this->shouldLogEvents()) {
            Log::info("ModuleEvent dispatched: {$eventName}", [
                'source' => $event->getSource(),
                'project_id' => $event->getProjectId(),
                'payload' => $event->getPayload(),
            ]);
        }

        $listeners = $this->getListeners($eventName);

        // Also check for listeners registered using the Event Class Name
        $className = get_class($event);
        if ($className !== $eventName) {
            $listeners = array_merge($listeners, $this->getListeners($className));
        }

        // Deduplicate listeners to ensure single execution
        $listeners = array_unique($listeners, SORT_REGULAR);

        foreach ($listeners as $listener) {
            try {
                if ($this->shouldRunAsync()) {
                    // Queue the listener for async execution
                    dispatch(function () use ($listener, $event) {
                        $this->executeListener($listener, $event);
                    });
                } else {
                    // Execute synchronously
                    $this->executeListener($listener, $event);
                }
            } catch (\Exception $e) {
                Log::error("Error in event listener for '{$eventName}': {$e->getMessage()}", [
                    'event' => $eventName,
                    'source' => $event->getSource(),
                    'exception' => $e,
                ]);
            }
        }
    }

    /**
     * Subscribe to an event.
     *
     * @param string $eventName
     * @param callable $handler
     * @return void
     */
    public function subscribe(string $eventName, mixed $handler): void
    {
        if (!isset($this->listeners[$eventName])) {
            $this->listeners[$eventName] = [];
        }

        if (in_array($handler, $this->listeners[$eventName])) {
            return;
        }

        $this->listeners[$eventName][] = $handler;
    }

    /**
     * Unsubscribe from an event.
     *
     * @param string $eventName
     * @param callable $handler
     * @return void
     */
    public function unsubscribe(string $eventName, mixed $handler): void
    {
        if (!isset($this->listeners[$eventName])) {
            return;
        }

        $this->listeners[$eventName] = array_filter(
            $this->listeners[$eventName],
            fn($listener) => $listener !== $handler
        );
    }

    /**
     * Get all listeners for an event.
     *
     * @param string $eventName
     * @return array<callable>
     */
    public function getListeners(string $eventName): array
    {
        // Get exact match listeners
        $listeners = $this->listeners[$eventName] ?? [];

        // Get wildcard listeners (e.g., 'tasks.*' matches 'tasks.task.completed')
        foreach ($this->listeners as $pattern => $patternListeners) {
            // Skip the exact match key because we already grabbed it above
            if ($pattern === $eventName) {
                continue;
            }

            if ($this->matchesPattern($eventName, $pattern)) {
                $listeners = array_merge($listeners, $patternListeners);
            }
        }

        return $listeners;
    }

    /**
     * Check if all listeners have been called for an event.
     *
     * @param string $eventName
     * @return bool
     */
    public function hasListeners(string $eventName): bool
    {
        return !empty($this->getListeners($eventName));
    }

    /**
     * Clear all listeners for an event.
     *
     * @param string|null $eventName If null, clears all listeners
     * @return void
     */
    public function clearListeners(?string $eventName = null): void
    {
        if ($eventName === null) {
            $this->listeners = [];
        } else {
            unset($this->listeners[$eventName]);
        }
    }

    /**
     * Register multiple listeners at once.
     *
     * @param array<string, array<callable>> $listeners Event name => [handlers]
     * @return void
     */
    public function registerListeners(array $listeners): void
    {
        foreach ($listeners as $eventName => $handlers) {
            foreach ($handlers as $handler) {
                $this->subscribe($eventName, $handler);
            }
        }
    }

    /**
     * Check if event name matches a pattern.
     *
     * @param string $eventName
     * @param string $pattern
     * @return bool
     */
    protected function matchesPattern(string $eventName, string $pattern): bool
    {
        // Exact match
        if ($eventName === $pattern) {
            return true;
        }

        // Wildcard match (e.g., 'tasks.*' matches 'tasks.task.completed')
        if (str_contains($pattern, '*')) {
            $regex = '/^' . str_replace('*', '.*', preg_quote($pattern, '/')) . '$/';
            return preg_match($regex, $eventName) === 1;
        }

        return false;
    }

    /**
     * Execute a specific listener for an event.
     *
     * @param mixed $listener
     * @param ModuleEvent $event
     * @return void
     */
    protected function executeListener(mixed $listener, ModuleEvent $event): void
    {
        // Handle class strings (e.g., 'App\Listeners\MyListener')
        if (is_string($listener) && class_exists($listener)) {
            $instance = app($listener);
            
            if (method_exists($instance, 'handle')) {
                $instance->handle($event);
                return;
            }
            
            // If it's an invokable class
            if (is_callable($instance)) {
                $instance($event);
                return;
            }
        }

        // Handle regular callables (closures, array callbacks)
        if (is_callable($listener)) {
            call_user_func($listener, $event);
            return;
        }

        throw new \Exception("Listener is not callable or does not have a handle() method.");
    }

    /**
     * Check if events should be logged.
     *
     * @return bool
     */
    protected function shouldLogEvents(): bool
    {
        return $this->config['log_events'] ?? false;
    }

    /**
     * Check if listeners should run asynchronously.
     *
     * @return bool
     */
    protected function shouldRunAsync(): bool
    {
        return $this->config['async'] ?? false;
    }
}
