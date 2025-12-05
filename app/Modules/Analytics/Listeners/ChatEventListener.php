<?php

namespace App\Modules\Analytics\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Analytics\Jobs\ProcessAnalyticsEvent;

/**
 * ChatEventListener
 * 
 * Listens to all chat events and queues them for processing.
 */
class ChatEventListener
{
    /**
     * Handle chat events.
     *
     * @param ModuleEvent $event
     * @return void
     */
    public function handleChatEvent(ModuleEvent $event): void
    {
        ProcessAnalyticsEvent::dispatch($event);
    }
}
