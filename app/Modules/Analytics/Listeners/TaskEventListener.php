<?php

namespace App\Modules\Analytics\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Analytics\Jobs\ProcessAnalyticsEvent;

/**
 * TaskEventListener
 * 
 * Listens to all task events and queues them for processing.
 */
class TaskEventListener
{
    /**
     * Handle task events.
     *
     * @param ModuleEvent $event
     * @return void
     */
    public function handleTaskEvent(ModuleEvent $event): void
    {
        ProcessAnalyticsEvent::dispatch($event);
    }
}
