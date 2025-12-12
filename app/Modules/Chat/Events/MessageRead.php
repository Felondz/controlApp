<?php

namespace App\Modules\Chat\Events;

use App\Core\Events\BaseModuleEvent;
use App\Modules\Chat\Models\Message;

/**
 * MessageRead Event
 * 
 * Dispatched when a message is marked as read.
 */
class MessageRead extends BaseModuleEvent
{
    /**
     * Create a new event instance.
     *
     * @param Message $message
     */
    public function __construct(Message $message)
    {
        parent::__construct('chat', [
            'message_id' => $message->id,
            'sender_id' => $message->user_id,
            'receiver_id' => $message->receiver_id,
            'read_at' => now()->toIso8601String(),
        ], $message->proyecto_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'chat.message.read';
    }
}
