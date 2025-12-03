<?php

namespace Tests\Feature\Modules\Analytics;

use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Modules\Analytics\Models\AnalyticsMetric;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class AnalyticsApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Proyecto $proyecto;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->proyecto = Proyecto::create([
            'nombre' => 'Test Project',
            'user_id' => $this->user->id,
            'moneda_default' => 'USD',
            'modules' => ['analytics']
        ]);

        $this->proyecto->miembros()->attach($this->user->id, ['rol' => 'admin']);

        // Create some dummy metrics
        AnalyticsMetric::create([
            'proyecto_id' => $this->proyecto->id,
            'metric_type' => 'finance',
            'metric_name' => 'transactions.count',
            'value' => 10,
            'period_start' => now()->startOfDay(),
            'period_end' => now()->endOfDay()
        ]);
    }

    public function test_can_retrieve_metrics()
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson("/api/proyectos/{$this->proyecto->id}/analytics/metrics");

        $response->assertStatus(200)
            ->assertJsonStructure(['metrics', 'count']);
    }

    public function test_can_retrieve_summary()
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson("/api/proyectos/{$this->proyecto->id}/analytics/summary");

        $response->assertStatus(200);
    }

    public function test_cannot_access_analytics_if_not_member()
    {
        $otherUser = User::factory()->create();
        Sanctum::actingAs($otherUser);

        $response = $this->getJson("/api/proyectos/{$this->proyecto->id}/analytics/metrics");

        $response->assertStatus(403);
    }
}
