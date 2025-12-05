<?php

namespace App\Modules\Analytics\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Analytics\Jobs\ProcessAnalyticsEvent;

/**
 * FinanceEventListener
 * 
 * Listens to all finance events and queues them for processing.
 */
class FinanceEventListener
{
    /**
     * Handle finance events.
     *
     * @param ModuleEvent $event
     * @return void
     */
    public function handleFinanceEvent(ModuleEvent $event): void
    {
        // Dispatch async job to process event
        ProcessAnalyticsEvent::dispatch($event);
    }
}
