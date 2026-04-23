<?php declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserThemeTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_theme_via_web(): void
    {
        $user = User::factory()->create([
            'global_theme' => 'purple-modern'
        ]);

        $response = $this->actingAs($user)
            ->post(route('preferences.theme.update'), [
                'global_theme' => 'ocean-blue'
            ]);

        $response->assertStatus(302); // Redirect back
        $this->assertEquals('ocean-blue', $user->fresh()->global_theme);
    }

    public function test_user_can_update_theme_via_web_with_legacy_key(): void
    {
        $user = User::factory()->create([
            'global_theme' => 'purple-modern'
        ]);

        $response = $this->actingAs($user)
            ->post(route('preferences.theme.update'), [
                'theme' => 'forest-green'
            ]);

        $response->assertStatus(302);
        $this->assertEquals('forest-green', $user->fresh()->global_theme);
    }

    public function test_user_can_update_theme_via_api(): void
    {
        $user = User::factory()->create([
            'global_theme' => 'purple-modern'
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/user/theme', [
                'global_theme' => 'scarlet-red'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'global_theme' => 'scarlet-red'
            ]);

        $this->assertEquals('scarlet-red', $user->fresh()->global_theme);
    }
}
