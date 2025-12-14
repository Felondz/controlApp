<?php

namespace Tests\Feature\Web;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Modules\Chat\Models\Message;

class ProjectMessageUiWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_members_can_send_messages_via_web_if_module_enabled()
    {
        $user = User::factory()->create();
        $project = Proyecto::factory()->create([
            'user_id' => $user->id,
            'modules' => ['chat'],
        ]);

        $response = $this->actingAs($user)->postJson(route('project.messages.store', $project), [
            'content' => 'Hello Web',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'content' => 'Hello Web',
                'user_id' => $user->id,
            ]);

        $this->assertDatabaseHas('messages', [
            'content' => 'Hello Web',
            'proyecto_id' => $project->id,
        ]);
    }

    public function test_cannot_send_messages_via_web_if_module_disabled()
    {
        $user = User::factory()->create();
        $project = Proyecto::factory()->create([
            'user_id' => $user->id,
            'modules' => ['finance'],
        ]);

        $response = $this->actingAs($user)->postJson(route('project.messages.store', $project), [
            'content' => 'Hello Web',
        ]);

        $response->assertStatus(403);
    }

    public function test_can_list_messages_via_web()
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

        $response = $this->actingAs($user)->getJson(route('project.messages.index', $project));

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }
}
