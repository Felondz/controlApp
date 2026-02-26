<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserLlmSetting;

class LlmSettingsService
{
    /**
     * Upsert an LLM setting for a user.
     *
     * @param User $user
     * @param string $provider
     * @param string $apiKey
     * @param string|null $defaultModel
     * @param bool $isActive
     * @return UserLlmSetting
     */
    public function upsertSetting(User $user, string $provider, ?string $apiKey = null, ?string $defaultModel = null, bool $isActive = true): UserLlmSetting
    {
        $attributes = [
            'default_model' => $defaultModel,
            'is_active' => $isActive,
        ];

        if ($apiKey !== null) {
            $attributes['api_key'] = $apiKey;
        }

        return $user->llmSettings()->updateOrCreate(
            ['provider' => $provider],
            $attributes
        );
    }

    /**
     * Delete a provider setting for a user.
     *
     * @param User $user
     * @param string $provider
     * @return bool
     */
    public function deleteSetting(User $user, string $provider): bool
    {
        return $user->llmSettings()->where('provider', $provider)->delete() > 0;
    }
}
