<?php

namespace App\Modules\Notifications\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Notifications\Services\NotificationService;

/**
 * TaskEventListener
 * 
 * Listens to task events and triggers notifications.
 */
class TaskEventListener
{
    public function __construct(
        private NotificationService $notificationService
    ) {
    }

    public function handleTaskCreated(ModuleEvent $event): void
    {
        $this->notificationService->notifyTaskCreated($event);
    }

    public function handleTaskCompleted(ModuleEvent $event): void
    {
        // Future: notify project owner
    }

    public function handleFinancialTaskCreated(ModuleEvent $event): void
    {
        // Future: notify project owner
    }
}
