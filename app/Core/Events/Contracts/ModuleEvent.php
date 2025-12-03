<?php

namespace App\Core\Events\Contracts;

/**
 * Interface ModuleEvent
 * 
 * Base interface for all module events.
 * Events are the primary communication mechanism between modules.
 */
interface ModuleEvent
{
    /**
     * Get the event name.
     *
     * @return string Fully qualified event name (e.g., 'tasks.task.completed')
     */
    public function getName(): string;

    /**
     * Get the module that originated this event.
     *
     * @return string Module name
     */
    public function getSource(): string;

    /**
     * Get the event payload/data.
     *
     * @return array
     */
    public function getPayload(): array;

    /**
     * Get the project context for this event.
     *
     * @return int|null Project ID
     */
    public function getProjectId(): ?int;

    /**
     * Get the timestamp when the event was created.
     *
     * @return \DateTimeInterface
     */
    public function getTimestamp(): \DateTimeInterface;

    /**
     * Check if this event can be handled by a specific module.
     *
     * @param string $moduleName
     * @return bool
     */
    public function canBeHandledBy(string $moduleName): bool;

    /**
     * Get a specific value from the payload.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get(string $key, mixed $default = null): mixed;

    /**
     * Check if a key exists in the payload.
     *
     * @param string $key
     * @return bool
     */
    public function has(string $key): bool;
}
