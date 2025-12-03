<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class ChatSystemTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_send_message_to_general_channel()
    {
        $user = User::factory()->create();
        $project = Proyecto::factory()->create(['user_id' => $user->id, 'modules' => ['chat']]);

        $response = $this->actingAs($user)
            ->postJson(route('project.messages.store', $project->id), [
                'content' => 'Hello General',
                'type' => 'text'
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('messages', [
            'content' => 'Hello General',
            'proyecto_id' => $project->id,
            'recipient_id' => null
        ]);
    }

    public function test_user_can_send_direct_message()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $project = Proyecto::factory()->create(['user_id' => $user1->id, 'modules' => ['chat']]);
        $project->miembros()->attach($user2->id, ['rol' => 'member']);

        $response = $this->actingAs($user1)
            ->postJson(route('project.messages.store', $project->id), [
                'content' => 'Hello User 2',
                'recipient_id' => $user2->id
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('messages', [
            'content' => 'Hello User 2',
            'proyecto_id' => $project->id,
            'user_id' => $user1->id,
            'recipient_id' => $user2->id
        ]);
    }

    public function test_mark_as_read_updates_last_read_at_for_general_channel()
    {
        $user = User::factory()->create();
        $project = Proyecto::factory()->create(['user_id' => $user->id, 'modules' => ['chat']]);

        // Ensure user is attached to pivot (owner logic fix)
        $project->miembros()->attach($user->id, ['rol' => 'admin', 'last_read_at' => now()->subDay()]);

        $response = $this->actingAs($user)
            ->postJson(route('project.messages.read', $project->id));

        $response->assertStatus(200);

        $pivot = $user->proyectos()->where('proyecto_id', $project->id)->first()->pivot;
        $this->assertTrue(now()->diffInSeconds($pivot->last_read_at) < 5);
    }

    public function test_online_status_is_cleared_on_logout()
    {
        $user = User::factory()->create();

        // Simulate login (middleware sets cache)
        $this->actingAs($user)->get('/dashboard');
        Cache::put('user-is-online-' . $user->id, true, now()->addMinutes(5));

        $this->assertTrue(Cache::has('user-is-online-' . $user->id));

        // Logout
        $this->post(route('logout'));

        $this->assertFalse(Cache::has('user-is-online-' . $user->id));
    }
}
