<?php

namespace App\Modules\Analytics\Services;

use App\Modules\Analytics\Models\AnalyticsMetric;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * MetricsCollector Service
 * 
 * Processes events and collects aggregated metrics.
 */
class MetricsCollector
{
    /**
     * Process event data and update metrics.
     */
    public function processEventData(array $eventData): void
    {
        $eventName = $eventData['name'];
        $projectId = $eventData['project_id'];
        $payload = $eventData['payload'];

        if (!$projectId) {
            return; // Skip events without project context
        }

        match (true) {
            str_starts_with($eventName, 'finance.transaction.') => $this->processFinanceTransaction($eventName, $projectId, $payload),
            str_starts_with($eventName, 'tasks.task.') => $this->processTask($eventName, $projectId, $payload),
            str_starts_with($eventName, 'chat.message.') => $this->processChatMessage($eventName, $projectId, $payload),
            default => null,
        };
    }

    /**
     * Process finance transaction events.
     */
    private function processFinanceTransaction(string $eventName, int $projectId, array $payload): void
    {
        $now = Carbon::now();
        $periodStart = $now->copy()->startOfDay();
        $periodEnd = $now->copy()->endOfDay();

        if ($eventName === 'finance.transaction.created') {
            // Increment transaction count
            $this->incrementMetric(
                $projectId,
                'finance',
                'transactions.count.daily',
                1,
                $periodStart,
                $periodEnd
            );

            // Add transaction amount
            if (isset($payload['amount'])) {
                $metricName = $payload['type'] === 'ingreso'
                    ? 'income.total.daily'
                    : 'expense.total.daily';

                $this->incrementMetric(
                    $projectId,
                    'finance',
                    $metricName,
                    abs($payload['amount']),
                    $periodStart,
                    $periodEnd
                );
            }
        }
    }

    /**
     * Process task events.
     */
    private function processTask(string $eventName, int $projectId, array $payload): void
    {
        if ($eventName === 'tasks.task.created') {
            $now = Carbon::now();

            $this->incrementMetric(
                $projectId,
                'tasks',
                'created.count.daily',
                1,
                $now->copy()->startOfDay(),
                $now->copy()->endOfDay()
            );
        }

        if ($eventName === 'tasks.task.completed') {
            $now = Carbon::now();

            $this->incrementMetric(
                $projectId,
                'tasks',
                'completed.count.daily',
                1,
                $now->copy()->startOfDay(),
                $now->copy()->endOfDay()
            );

            // Track financial tasks separately
            if (isset($payload['is_financial']) && $payload['is_financial']) {
                $this->incrementMetric(
                    $projectId,
                    'tasks',
                    'financial_completed.count.daily',
                    1,
                    $now->copy()->startOfDay(),
                    $now->copy()->endOfDay()
                );
            }
        }
    }

    /**
     * Process chat message events.
     */
    private function processChatMessage(string $eventName, int $projectId, array $payload): void
    {
        if ($eventName === 'chat.message.sent') {
            $now = Carbon::now();

            $this->incrementMetric(
                $projectId,
                'chat',
                'messages.count.daily',
                1,
                $now->copy()->startOfDay(),
                $now->copy()->endOfDay()
            );

            // Track private vs public messages
            $messageType = isset($payload['receiver_id']) && $payload['receiver_id']
                ? 'private'
                : 'public';

            $this->incrementMetric(
                $projectId,
                'chat',
                "messages.{$messageType}.count.daily",
                1,
                $now->copy()->startOfDay(),
                $now->copy()->endOfDay()
            );
        }
    }

    /**
     * Increment or create a metric.
     */
    private function incrementMetric(
        int $projectId,
        string $metricType,
        string $metricName,
        float $value,
        Carbon $periodStart,
        Carbon $periodEnd
    ): void {
        DB::transaction(function () use ($projectId, $metricType, $metricName, $value, $periodStart, $periodEnd) {
            $metric = AnalyticsMetric::where('proyecto_id', $projectId)
                ->where('metric_type', $metricType)
                ->where('metric_name', $metricName)
                ->where('period_start', $periodStart)
                ->where('period_end', $periodEnd)
                ->first();

            if ($metric) {
                $metric->increment('value', $value);
            } else {
                AnalyticsMetric::create([
                    'proyecto_id' => $projectId,
                    'metric_type' => $metricType,
                    'metric_name' => $metricName,
                    'value' => $value,
                    'period_start' => $periodStart,
                    'period_end' => $periodEnd,
                ]);
            }
        });
    }
}
