<?php

namespace App\Modules\Chat\Events;

use App\Core\Events\BaseModuleEvent;

/**
 * MessageDeleted Event
 * 
 * Dispatched when a message is deleted.
 */
class MessageDeleted extends BaseModuleEvent
{
    /**
     * Create a new event instance.
     *
     * @param int $messageId
     * @param int $proyectoId
     */
    public function __construct(int $messageId, int $proyectoId)
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
}
