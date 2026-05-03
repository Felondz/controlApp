<?php

namespace App\Modules\Chat\Events;

use App\Core\Events\BaseModuleEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * MessageDeleted Event
 * 
 * Dispatched when a message is deleted.
 */
class MessageDeleted extends BaseModuleEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @param string $messageId
     * @param string $proyectoId
     */
    public function __construct(string $messageId, string $proyectoId)
    {
        parent::__construct('chat', [
            'message_id' => $messageId,
        ], $proyectoId);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'chat.message.deleted';
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('project.' . $this->projectId . '.chat'),
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'MessageDeleted';
    }
}
