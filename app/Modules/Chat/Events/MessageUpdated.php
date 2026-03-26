<?php

namespace App\Modules\Chat\Events;

use App\Core\Events\BaseModuleEvent;
use App\Modules\Chat\Models\Message;

/**
 * MessageUpdated Event
 * 
 * Dispatched when a message is edited or reacted to.
 */
class MessageUpdated extends BaseModuleEvent
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
            'recipient_id' => $message->recipient_id,
            'content' => $message->content,
            'is_edited' => $message->is_edited,
            'reactions' => $message->reactions,
            'updated_at' => $message->updated_at->toIso8601String(),
        ], $message->proyecto_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'chat.message.updated';
    }
}
