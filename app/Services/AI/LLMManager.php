<?php declare(strict_types=1);

namespace App\Services\AI;

use App\Models\User;
use App\Models\UserLLMSetting;
use App\Services\AI\Contracts\LLMServiceInterface;
use App\Services\AI\Providers\OpenAIService;
use Exception;

class LLMManager
{
    /**
     * Resolves the configured LLM service for the given user.
     * 
     * @throws Exception If no active LLM setting is found for the user.
     */
    public function resolveForUser(User $user, ?string $provider = null): LLMServiceInterface
    {
        $query = UserLLMSetting::where('user_id', $user->id)->where('is_active', true);
        
        if ($provider) {
            $query->where('provider', $provider);
        }
        
        $setting = $query->first();

        if (!$setting) {
            throw new Exception("No active LLM configuration found for this user.");
        }

        return $this->buildService($setting->provider, $setting->api_key);
    }

    /**
     * Instantiates the correct service provider class.
     */
    private function buildService(string $provider, mixed $apiKey): LLMServiceInterface
    {
        // Enforcing string cast here because we use the 'encrypted' cast on Model which returns an EncryptedString object
        $decryptedKey = (string) $apiKey;
        
        $service = match (strtolower($provider)) {
            'openai' => app(OpenAIService::class),
            // 'anthropic' => app(AnthropicService::class),
            default => throw new Exception("Unsupported LLM provider: {$provider}"),
        };

        return $service->setApiKey($decryptedKey);
    }
}
