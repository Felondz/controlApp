<?php

namespace Tests\Unit\Modules\Analytics;

use Tests\TestCase;
use App\Modules\Analytics\Services\MetricsCollector;
use App\Modules\Analytics\Models\AnalyticsMetric;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MetricsCollectorTest extends TestCase
{
    use RefreshDatabase;

    protected MetricsCollector $collector;
    protected Proyecto $proyecto;

    protected function setUp(): void
    {
        parent::setUp();

        $this->collector = new MetricsCollector();

        $user = User::factory()->create();
        $this->proyecto = Proyecto::create([
            'nombre' => 'Test Project',
            'user_id' => $user->id,
            'moneda_default' => 'USD',
            'modules' => ['analytics']
        ]);
    }

    public function test_it_processes_finance_event()
    {
        $eventData = [
            'name' => 'finance.transaction.created',
            'project_id' => $this->proyecto->id,
            'payload' => [
                'amount' => 100,
                'type' => 'ingreso'
            ]
        ];

        $this->collector->processEventData($eventData);

        $this->assertDatabaseHas('analytics_metrics', [
            'proyecto_id' => $this->proyecto->id,
            'metric_type' => 'finance',
            'metric_name' => 'transactions.count.daily',
            'value' => 1
        ]);

        $this->assertDatabaseHas('analytics_metrics', [
            'proyecto_id' => $this->proyecto->id,
            'metric_type' => 'finance',
            'metric_name' => 'income.total.daily',
            'value' => 100
        ]);
    }

    public function test_it_processes_task_event()
    {
        $eventData = [
            'name' => 'tasks.task.completed',
            'project_id' => $this->proyecto->id,
            'payload' => []
        ];

        $this->collector->processEventData($eventData);

        $this->assertDatabaseHas('analytics_metrics', [
            'proyecto_id' => $this->proyecto->id,
            'metric_type' => 'tasks',
            'metric_name' => 'completed.count.daily',
            'value' => 1
        ]);
    }

    public function test_it_aggregates_values_for_same_period()
    {
        $eventData = [
            'name' => 'tasks.task.completed',
            'project_id' => $this->proyecto->id,
            'payload' => []
        ];

        // First event
        $this->collector->processEventData($eventData);

        // Second event
        $this->collector->processEventData($eventData);

        $this->assertDatabaseHas('analytics_metrics', [
            'proyecto_id' => $this->proyecto->id,
            'metric_type' => 'tasks',
            'metric_name' => 'completed.count.daily',
            'value' => 2
        ]);
    }
}
