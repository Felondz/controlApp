<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Models\Message;

class MessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_members_can_send_messages_if_module_enabled()
    {
        $user = User::factory()->create();
        $project = Proyecto::factory()->create([
            'user_id' => $user->id,
            'modules' => ['chat'], // Enable chat
        ]);

        $response = $this->actingAs($user)->postJson("/api/proyectos/{$project->id}/messages", [
            'content' => 'Hello World',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'content' => 'Hello World',
                'user_id' => $user->id,
            ]);

        $this->assertDatabaseHas('messages', [
            'content' => 'Hello World',
            'proyecto_id' => $project->id,
        ]);
    }

    public function test_cannot_send_messages_if_module_disabled()
    {
        $user = User::factory()->create();
        $project = Proyecto::factory()->create([
            'user_id' => $user->id,
            'modules' => ['finance'], // Chat disabled
        ]);

        $response = $this->actingAs($user)->postJson("/api/proyectos/{$project->id}/messages", [
            'content' => 'Hello World',
        ]);

        $response->assertStatus(403);
    }

    public function test_non_members_cannot_access_messages()
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $project = Proyecto::factory()->create([
            'user_id' => $owner->id,
            'modules' => ['chat'],
        ]);

        $response = $this->actingAs($otherUser)->getJson("/api/proyectos/{$project->id}/messages");

        $response->assertStatus(403);
    }

    public function test_can_list_messages()
    {
        $user = User::factory()->create();
        $project = Proyecto::factory()->create([
            'user_id' => $user->id,
            'modules' => ['chat'],
        ]);

        Message::factory()->count(3)->create([
            'proyecto_id' => $project->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->getJson("/api/proyectos/{$project->id}/messages");

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_send_private_message()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $project = Proyecto::factory()->create([
            'user_id' => $user1->id,
            'modules' => ['chat'],
        ]);
        $project->miembros()->attach($user2);

        $response = $this->actingAs($user1)->postJson("/api/proyectos/{$project->id}/messages", [
            'content' => 'Secret message',
            'recipient_id' => $user2->id,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'content' => 'Secret message',
                'recipient_id' => $user2->id,
            ]);
    }

    public function test_can_list_private_messages()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create(); // Outsider
        $project = Proyecto::factory()->create([
            'user_id' => $user1->id,
            'modules' => ['chat'],
        ]);
        $project->miembros()->attach([$user2->id, $user3->id]);

        // Message from User1 to User2
        Message::factory()->create([
            'proyecto_id' => $project->id,
            'user_id' => $user1->id,
            'recipient_id' => $user2->id,
            'content' => 'For User 2',
        ]);

        // User2 should see it
        $response = $this->actingAs($user2)->getJson("/api/proyectos/{$project->id}/messages");
        $response->assertStatus(200)
            ->assertJsonFragment(['content' => 'For User 2']);

        // User1 should see it (as sender)
        $response = $this->actingAs($user1)->getJson("/api/proyectos/{$project->id}/messages");
        $response->assertStatus(200)
            ->assertJsonFragment(['content' => 'For User 2']);

        // User3 should NOT see it
        $response = $this->actingAs($user3)->getJson("/api/proyectos/{$project->id}/messages");
        $response->assertStatus(200)
            ->assertJsonMissing(['content' => 'For User 2']);
    }

    public function test_can_mark_messages_as_read()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $project = Proyecto::factory()->create([
            'user_id' => $user1->id,
            'modules' => ['chat'],
        ]);
        $project->miembros()->attach($user2);

        // Private message to User1
        $message = Message::factory()->create([
            'proyecto_id' => $project->id,
            'user_id' => $user2->id,
            'recipient_id' => $user1->id,
            'read_at' => null,
        ]);

        $response = $this->actingAs($user1)->postJson("/api/proyectos/{$project->id}/messages/read");

        $response->assertStatus(200);
        $this->assertNotNull($message->fresh()->read_at);
    }
}
