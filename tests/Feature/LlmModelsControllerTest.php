<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class LlmModelsControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_fetches_openai_models_successfully(): void
    {
        $user = User::factory()->create();

        Http::fake([
            'api.openai.com/v1/models' => Http::response([
                'data' => [
                    ['id' => 'gpt-4o', 'object' => 'model'],
                    ['id' => 'gpt-3.5-turbo', 'object' => 'model'],
                    ['id' => 'text-embedding-3-small', 'object' => 'model'], // Should be filtered out
                    ['id' => 'o1-mini', 'object' => 'model'],
                    ['id' => 'whisper-1', 'object' => 'model'], // Should be filtered out
                ]
            ], 200),
        ]);

        $response = $this->actingAs($user)->postJson(route('profile.llm-settings.fetch-models'), [
            'provider' => 'openai',
            'api_key' => 'fake-key',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $models = $response->json('models');
        $this->assertCount(3, $models);
        $this->assertEquals('gpt-3.5-turbo', $models[0]['id']); 
        $this->assertEquals('gpt-4o', $models[1]['id']);
        $this->assertEquals('o1-mini', $models[2]['id']);
    }

    #[Test]
    public function it_uses_stored_api_key_if_none_provided(): void
    {
        $user = User::factory()->create();
        $user->llmSettings()->create([
            'provider' => 'gemini',
            'api_key' => 'stored-secret-key',
            'is_active' => true,
        ]);

        Http::fake([
            'generativelanguage.googleapis.com/v1beta/models*' => Http::response([
                'models' => [
                    ['name' => 'models/gemini-pro', 'displayName' => 'Gemini Pro', 'supportedGenerationMethods' => ['generateContent']],
                    ['name' => 'models/embedding-001', 'displayName' => 'Embedding', 'supportedGenerationMethods' => ['embedText']], // Filtered
                ]
            ], 200),
        ]);

        $response = $this->actingAs($user)->postJson(route('profile.llm-settings.fetch-models'), [
            'provider' => 'gemini',
            'api_key' => '', // Empty key, should fallback to stored
        ]);

        // Verifying the request was caught and therefore used the key implicitly
        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'key=stored-secret-key');
        });

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('models'));
        $this->assertEquals('gemini-pro', $response->json('models.0.id'));
    }

    #[Test]
    public function it_returns_error_if_no_key_available(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(route('profile.llm-settings.fetch-models'), [
            'provider' => 'anthropic',
            'api_key' => '',
        ]);

        $response->assertStatus(400);
        $response->assertJson([
            'success' => false,
            'message' => 'No se puede consultar modelos. API Key faltante o proveedor no soportado.',
        ]);
    }
}
