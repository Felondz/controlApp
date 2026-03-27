<?php

namespace App\Core\Events;

use App\Core\Events\Contracts\ModuleEvent;
use App\Core\Events\ModuleEventBus;

/**
 * BaseModuleEvent
 * 
 * Abstract base class for module events.
 * Provides common functionality for all events.
 */
abstract class BaseModuleEvent implements ModuleEvent
{
    /**
     * Dispatch this event via the ModuleEventBus.
     * 
     * @param mixed ...$args Arguments for the event constructor
     * @return static
     */
    public static function dispatch(...$arguments)
    {
        /** @phpstan-ignore-next-line */
        $event = new static(...$arguments);
        
        // Dispatch via custom ModuleEventBus for inter-module communication and testing spies
        if (app()->bound(ModuleEventBus::class)) {
            app(ModuleEventBus::class)->dispatch($event);
        }

        // Also dispatch via Laravel default system for any standard listeners
        event($event);
        
        return $event;
    }

    /**
     * Module that originated this event.
     *
     * @var string
     */
    protected string $source;

    /**
     * Event payload/data.
     *
     * @var array
     */
    protected array $payload;

    /**
     * Project context.
     *
     * @var int|null
     */
    protected ?int $projectId;

    /**
     * Event timestamp.
     *
     * @var \DateTimeInterface
     */
    protected \DateTimeInterface $timestamp;

    /**
     * Modules that can handle this event.
     *
     * @var array<string>
     */
    protected array $allowedHandlers = [];

    /**
     * Create a new event instance.
     *
     * @param string $source
     * @param array $payload
     * @param int|null $projectId
     */
    public function __construct(string $source, array $payload, ?int $projectId = null)
    {
        $this->source = $source;
        $this->payload = $payload;
        $this->projectId = $projectId;
        $this->timestamp = new \DateTimeImmutable();
    }

    /**
     * {@inheritdoc}
     */
    abstract public function getName(): string;

    /**
     * {@inheritdoc}
     */
    public function getSource(): string
    {
        return $this->source;
    }

    /**
     * {@inheritdoc}
     */
    public function getPayload(): array
    {
        return $this->payload;
    }

    /**
     * {@inheritdoc}
     */
    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    /**
     * {@inheritdoc}
     */
    public function getTimestamp(): \DateTimeInterface
    {
        return $this->timestamp;
    }

    /**
     * {@inheritdoc}
     */
    public function canBeHandledBy(string $moduleName): bool
    {
        // If no specific handlers are defined, any module can handle it
        if (empty($this->allowedHandlers)) {
            return true;
        }

        return in_array($moduleName, $this->allowedHandlers);
    }

    /**
     * Get a specific value from the payload.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get(string $key, mixed $default = null): mixed
    {
        return $this->payload[$key] ?? $default;
    }

    /**
     * Check if a key exists in the payload.
     *
     * @param string $key
     * @return bool
     */
    public function has(string $key): bool
    {
        return array_key_exists($key, $this->payload);
    }

    /**
     * Convert event to array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'name' => $this->getName(),
            'source' => $this->source,
            'payload' => $this->payload,
            'project_id' => $this->projectId,
            'timestamp' => $this->timestamp->format(\DateTimeInterface::ATOM),
        ];
    }

    /**
     * Convert event to JSON.
     *
     * @return string
     */
    public function toJson(): string
    {
        return json_encode($this->toArray());
    }
}
