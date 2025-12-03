<?php

namespace Tests\Feature\Modules\Notifications;

use Tests\TestCase;
use App\Models\User;
use App\Modules\Notifications\Models\NotificationPreference;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_list_notifications()
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/notifications');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_can_update_preferences()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/notifications/preferences', [
            'event_type' => 'test.event',
            'channel' => 'mail',
            'enabled' => false
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('notification_preferences', [
            'user_id' => $this->user->id,
            'event_type' => 'test.event',
            'channel' => 'mail',
            'enabled' => false
        ]);
    }

    public function test_can_get_preferences()
    {
        Sanctum::actingAs($this->user);

        NotificationPreference::create([
            'user_id' => $this->user->id,
            'event_type' => 'test.event',
            'channel' => 'mail',
            'enabled' => false
        ]);

        $response = $this->getJson('/api/notifications/preferences');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'event_type' => 'test.event',
                'channel' => 'mail',
                'enabled' => false
            ]);
    }
}
