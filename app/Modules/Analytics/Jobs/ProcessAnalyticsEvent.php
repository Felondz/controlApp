<?php

namespace App\Modules\Analytics\Jobs;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Analytics\Services\MetricsCollector;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * ProcessAnalyticsEvent Job
 * 
 * Processes module events asynchronously to collect metrics.
 */
class ProcessAnalyticsEvent implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The event to process.
     */
    private array $eventData;

    /**
     * Create a new job instance.
     */
    public function __construct(ModuleEvent $event)
    {
        // Serialize event data to avoid serialization issues
        $this->eventData = [
            'name' => $event->getName(),
            'source' => $event->getSource(),
            'payload' => $event->getPayload(),
            'project_id' => $event->getProjectId(),
            'timestamp' => $event->getTimestamp()->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Execute the job.
     */
    public function handle(MetricsCollector $collector): void
    {
        $collector->processEventData($this->eventData);
    }
}
