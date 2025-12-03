<?php

namespace App\Modules\Chat\Events;

use App\Core\Events\BaseModuleEvent;
use App\Models\Message;

/**
 * MessageSent Event
 * 
 * Dispatched when a new message is sent.
 */
class MessageSent extends BaseModuleEvent
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
            'content' => $message->content,
            'is_read' => $message->is_read,
            'sent_at' => $message->created_at->toIso8601String(),
        ], $message->proyecto_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'chat.message.sent';
    }
}
