<?php

namespace App\Modules\Notifications\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Notifications\Services\NotificationService;

/**
 * ChatEventListener
 * 
 * Listens to chat events and triggers notifications.
 */
class ChatEventListener
{
    public function __construct(
        private NotificationService $notificationService
    ) {
    }

    public function handleMessageSent(ModuleEvent $event): void
    {
        $this->notificationService->notifyMessageSent($event);
    }
}
