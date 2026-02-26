<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserLlmSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Facades\DB;

class UserLlmSettingsTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_stores_and_encrypts_api_key_when_setting_is_created(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('profile.llm-settings.store'), [
            'provider' => 'openai',
            'api_key' => 'sk-test-secret-123',
            'default_model' => 'gpt-4o',
            'is_active' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('profile.edit'));

        $this->assertDatabaseHas('user_llm_settings', [
            'user_id' => $user->id,
            'provider' => 'openai',
            'default_model' => 'gpt-4o',
            'is_active' => 1,
        ]);

        // Verify that the actual value in the database is not plain text
        $rawRow = DB::table('user_llm_settings')->where('user_id', $user->id)->first();
        $this->assertNotNull($rawRow);
        $this->assertNotEquals('sk-test-secret-123', $rawRow->api_key);

        // Verify eloquent automatically decrypts it
        $setting = UserLlmSetting::where('user_id', $user->id)->first();
        $this->assertEquals('sk-test-secret-123', $setting->api_key);
    }

    #[Test]
    public function it_updates_is_active_without_requiring_api_key_again(): void
    {
        $user = User::factory()->create();
        $user->llmSettings()->create([
            'provider' => 'anthropic',
            'api_key' => 'old-secret-key',
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->post(route('profile.llm-settings.store'), [
            'provider' => 'anthropic',
            'api_key' => '', // Sent empty from frontend
            'is_active' => false,
        ]);

        $response->assertSessionHasNoErrors();
        
        $setting = UserLlmSetting::where('user_id', $user->id)->first();
        $this->assertEquals('old-secret-key', $setting->api_key); // Key remains unaffected
        $this->assertFalse($setting->is_active); // But status changes
    }
    
    #[Test]
    public function it_deletes_a_provider_setting(): void
    {
        $user = User::factory()->create();
        $user->llmSettings()->create([
            'provider' => 'gemini',
            'api_key' => 'test',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('user_llm_settings', ['provider' => 'gemini']);

        $response = $this->actingAs($user)->delete(route('profile.llm-settings.destroy', 'gemini'));

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('user_llm_settings', ['provider' => 'gemini']);
    }
}
