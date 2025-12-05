<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ToolTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_tools_index_returns_list()
    {
        $user = User::factory()->create([
            'enabled_tools' => ['financial-calculator'],
        ]);

        $response = $this->actingAs($user)->getJson('/api/tools');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'name_key',
                    'description_key',
                    'status',
                    'is_enabled',
                ]
            ]);

        // Verify specific data
        $response->assertJsonFragment([
            'id' => 'financial-calculator',
            'is_enabled' => true,
        ]);

        $response->assertJsonFragment([
            'id' => 'calendar',
            'is_enabled' => false,
        ]);
    }

    public function test_api_tools_toggle_updates_preference()
    {
        $user = User::factory()->create([
            'enabled_tools' => [],
        ]);

        // Enable tool
        $response = $this->actingAs($user)->postJson('/api/tools/toggle', [
            'tool' => 'financial-calculator',
            'enable' => true,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Tool status updated successfully.',
                'enabled_tools' => ['financial-calculator'],
            ]);

        $this->assertTrue(in_array('financial-calculator', $user->fresh()->enabled_tools));

        // Disable tool
        $response = $this->actingAs($user)->postJson('/api/tools/toggle', [
            'tool' => 'financial-calculator',
            'enable' => false,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Tool status updated successfully.',
                'enabled_tools' => [],
            ]);

        $this->assertFalse(in_array('financial-calculator', $user->fresh()->enabled_tools));
    }

    public function test_api_tools_toggle_validation()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/tools/toggle', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tool', 'enable']);
    }
}
