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

        foreach ($listeners as $listener) {
            try {
                if ($this->shouldRunAsync()) {
                    // Queue the listener for async execution
                    dispatch(function () use ($listener, $event) {
                        call_user_func($listener, $event);
                    });
                } else {
                    // Execute synchronously
                    call_user_func($listener, $event);
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
    public function subscribe(string $eventName, callable $handler): void
    {
        if (!isset($this->listeners[$eventName])) {
            $this->listeners[$eventName] = [];
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
    public function unsubscribe(string $eventName, callable $handler): void
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
