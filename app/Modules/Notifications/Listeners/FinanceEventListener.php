<?php

namespace App\Modules\Notifications\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Notifications\Services\NotificationService;

/**
 * FinanceEventListener
 * 
 * Listens to finance events and triggers notifications.
 */
class FinanceEventListener
{
    public function __construct(
        private NotificationService $notificationService
    ) {
    }

    public function handleTransactionCreated(ModuleEvent $event): void
    {
        $this->notificationService->notifyTransactionCreated($event);
    }

    public function handleBalanceLow(ModuleEvent $event): void
    {
        // Future: implement balance low notification
    }
}
