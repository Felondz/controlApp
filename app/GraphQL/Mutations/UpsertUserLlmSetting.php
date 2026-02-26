<?php

namespace App\GraphQL\Mutations;

use App\Services\LlmSettingsService;
use Exception;
use Illuminate\Support\Facades\Auth;

final class UpsertUserLlmSetting
{
    public function __construct(private LlmSettingsService $llmSettingsService) {}

    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $user = Auth::user();

        if (!$user) {
            throw new Exception("Unauthenticated");
        }

        $provider = $args['provider'];
        
        // Basic provider validation
        if (!in_array($provider, ['openai', 'anthropic', 'gemini', 'test_sprite', 'custom'])) {
            throw new Exception("Invalid provider specified.");
        }

        $apiKey = $args['api_key'] ?? null;
        $isActive = $args['is_active'] ?? true;
        $existing = $user->llmSettings()->where('provider', $provider)->first();

        // Require API Key if no existing setting is found AND the user wants the provider to be active
        if (!$existing && empty($apiKey) && $isActive) {
            throw new Exception("API Key is required to activate this provider.");
        }

        return $this->llmSettingsService->upsertSetting(
            $user,
            $provider,
            empty($apiKey) ? null : $apiKey,
            $args['default_model'] ?? null,
            $isActive
        );
    }
}
