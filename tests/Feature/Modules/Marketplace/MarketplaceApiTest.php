<?php

namespace Tests\Feature\Modules\Marketplace;

use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class MarketplaceApiTest extends TestCase
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
            'modules' => ['finance']
        ]);

        $this->proyecto->miembros()->attach($this->user->id, ['rol' => 'admin']);
    }

    public function test_can_list_modules()
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson("/api/proyectos/{$this->proyecto->id}/marketplace");

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'enabled', 'dependencies']
            ]);
    }

    public function test_can_toggle_module()
    {
        Sanctum::actingAs($this->user);

        // Enable tasks module
        $response = $this->postJson("/api/proyectos/{$this->proyecto->id}/marketplace/tasks");

        $response->assertStatus(200)
            ->assertJson(['enabled' => true]);

        $this->proyecto->refresh();
        $this->assertContains('tasks', $this->proyecto->modules);

        // Disable tasks module
        $response = $this->postJson("/api/proyectos/{$this->proyecto->id}/marketplace/tasks");

        $response->assertStatus(200)
            ->assertJson(['enabled' => false]);

        $this->proyecto->refresh();
        $this->assertNotContains('tasks', $this->proyecto->modules);
    }

    public function test_cannot_toggle_module_if_not_owner()
    {
        $otherUser = User::factory()->create();
        Sanctum::actingAs($otherUser);

        $response = $this->postJson("/api/proyectos/{$this->proyecto->id}/marketplace/tasks");

        $response->assertStatus(403);
    }
}
