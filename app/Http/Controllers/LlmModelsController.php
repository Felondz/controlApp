<?php

namespace App\Http\Controllers;

use App\Services\LlmSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LlmModelsController extends Controller
{
    public function __construct(private LlmSettingsService $llmSettingsService) {}

    /**
     * Fetch available models from an LLM provider dynamically.
     */
    public function fetchModels(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'provider' => ['required', 'string', 'in:openai,anthropic,gemini,test_sprite,custom'],
            'api_key' => ['nullable', 'string'],
        ]);

        $provider = $validated['provider'];
        $apiKey = trim($validated['api_key'] ?? '');

        // If no key provided, look up existing user settings (decrypted automatically by model cast)
        if (empty($apiKey)) {
            $setting = $request->user()->llmSettings()->where('provider', $provider)->first();
            if ($setting) {
                $apiKey = $setting->api_key;
            }
        }

        // We can't query external providers with an empty key or the 'custom' / 'test_sprite' dummy endpoints easily
        if (empty($apiKey) || in_array($provider, ['custom', 'test_sprite'])) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede consultar modelos. API Key faltante o proveedor no soportado.',
                'models' => [],
            ], 400);
        }

        try {
            $models = match ($provider) {
                'openai' => $this->fetchOpenAiModels($apiKey),
                'anthropic' => $this->fetchAnthropicModels($apiKey),
                'gemini' => $this->fetchGeminiModels($apiKey),
                default => [],
            };

            return response()->json([
                'success' => true,
                'message' => 'Modelos cargados exitosamente.',
                'models' => $models,
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to fetch $provider models: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al contactar al proveedor. Verifica tu API Key.',
                'models' => [],
            ], 500);
        }
    }

    /**
     * Fetch models silently for internal backend use (like fallbacks).
     */
    public function fetchModelsSilently(string $provider, string $apiKey): array
    {
        if (empty($apiKey) || in_array($provider, ['custom', 'test_sprite'])) {
            return [];
        }

        try {
            return match ($provider) {
                'openai' => $this->fetchOpenAiModels($apiKey),
                'anthropic' => $this->fetchAnthropicModels($apiKey),
                'gemini' => $this->fetchGeminiModels($apiKey),
                default => [],
            };
        } catch (\Exception $e) {
            Log::error("Failed to fetch $provider models silently: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Fetch all available models across all active providers for the user.
     * Used by the AI Chat Widget to display a dropdown.
     */
    public function availableModels(Request $request): JsonResponse
    {
        $user = $request->user();
        $settings = $user->llmSettings()->where('is_active', true)->get();

        $available = [];

        foreach ($settings as $setting) {
            $provider = $setting->provider;
            $apiKey = $setting->api_key;
            
            if (empty($apiKey) || in_array($provider, ['custom', 'test_sprite'])) {
                continue;
            }

            try {
                $models = match ($provider) {
                    'openai' => $this->fetchOpenAiModels($apiKey),
                    'anthropic' => $this->fetchAnthropicModels($apiKey),
                    'gemini' => $this->fetchGeminiModels($apiKey),
                    default => [],
                };

                if (!empty($models)) {
                    $available[] = [
                        'provider' => $provider,
                        'name' => match ($provider) {
                            'openai' => 'OpenAI',
                            'anthropic' => 'Anthropic',
                            'gemini' => 'Google Gemini',
                            default => ucfirst($provider)
                        },
                        'models' => $models,
                    ];
                }
            } catch (\Exception $e) {
                // If one provider fails (e.g., bad API key, rate limit on fetch), 
                // we just skip it so the widget still loads the other providers.
                Log::warning("Failed to fetch $provider models for user {$user->id}: " . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'data' => $available,
        ]);
    }


    private function fetchOpenAiModels(string $apiKey): array
    {
        $cacheKey = 'llm_models_openai_' . md5($apiKey);

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, \Carbon\Carbon::now()->addDays(7), function () use ($apiKey) {
            $response = Http::withToken($apiKey)->get('https://api.openai.com/v1/models');
            $response->throw();

            // Filter out whispering, embedding, and dall-e models to only keep conversational/chat ones roughly
            $allowedPrefixes = ['gpt-', 'o1-', 'o3-'];
            
            $models = collect($response->json('data'))
                ->filter(function ($model) use ($allowedPrefixes) {
                    foreach ($allowedPrefixes as $prefix) {
                        if (str_starts_with($model['id'], $prefix) && !str_contains($model['id'], 'audio') && !str_contains($model['id'], 'realtime')) {
                            return true;
                        }
                    }
                    return false;
                })
                ->sortBy('id', SORT_NATURAL | SORT_FLAG_CASE)
                ->map(fn ($model) => [
                    'id' => $model['id'],
                    'name' => $model['id'],
                ])
                ->values()
                ->toArray();
                
            return count($models) > 0 ? $models : [['id' => 'gpt-4o', 'name' => 'gpt-4o']];
        });
    }

    private function fetchAnthropicModels(string $apiKey): array
    {
        $cacheKey = 'llm_models_anthropic_' . md5($apiKey);

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, \Carbon\Carbon::now()->addDays(7), function () use ($apiKey) {
            // Anthropic models API was launched very recently. If it fails, we provide sane defaults.
            $response = Http::withHeaders([
                'x-api-key' => $apiKey,
                'anthropic-version' => '2023-06-01'
            ])->get('https://api.anthropic.com/v1/models');
            
            if ($response->successful()) {
                return collect($response->json('data'))
                    ->filter(fn ($model) => $model['type'] === 'model')
                    ->map(fn ($model) => [
                        'id' => $model['id'],
                        'name' => $model['display_name'] ?? $model['id']
                    ])
                    ->values()
                    ->toArray();
            }

            // Fallback default list if API doesn't support generic /models endpoint standardly for the user's tier
            return [
                ['id' => 'claude-3-7-sonnet-latest', 'name' => 'Claude 3.7 Sonnet (Latest)'],
                ['id' => 'claude-3-5-sonnet-latest', 'name' => 'Claude 3.5 Sonnet'],
                ['id' => 'claude-3-5-haiku-latest', 'name' => 'Claude 3.5 Haiku'],
                ['id' => 'claude-3-opus-latest', 'name' => 'Claude 3 Opus'],
            ];
        });
    }

    private function fetchGeminiModels(string $apiKey): array
    {
        $cacheKey = 'llm_models_gemini_' . md5($apiKey);

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, \Carbon\Carbon::now()->addDays(7), function () use ($apiKey) {
            $response = Http::get("https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}");
            $response->throw();

            return collect($response->json('models'))
                ->filter(function ($model) {
                    // Ensure supportedGenerationMethods is an array, then check if generateContent is inside
                    $methods = array_map('strtolower', $model['supportedGenerationMethods'] ?? []);
                    return str_contains(strtolower($model['name']), 'gemini') && in_array('generatecontent', $methods);
                })
                ->map(function ($model) {
                    // Remove 'models/' prefix
                    $id = str_replace('models/', '', $model['name']);
                    return [
                        'id' => $id,
                        'name' => $model['displayName'] ?? $id,
                    ];
                })
                ->values()
                ->toArray();
        });
    }
}
