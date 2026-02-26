<?php declare(strict_types=1);

namespace App\Services\AI\Providers;

use App\Services\AI\Contracts\LLMServiceInterface;

class OpenAIService implements LLMServiceInterface
{
    private string $apiKey;

    public function setApiKey(string $apiKey): self
    {
        $this->apiKey = $apiKey;
        return $this;
    }

    /**
     * @param array<string, mixed> $options
     */
    public function generateText(string $prompt, array $options = []): string
    {
        // Example implementation, we would use an HTTP client or SDK here
        // For example: Http::withToken($this->apiKey)->post('https://api.openai.com/...
        return "Respuesta simulada de OpenAI: " . $prompt . " usando key: " . substr($this->apiKey, 0, 5) . "...";
    }

    /**
     * @param array<mixed> $tools
     */
    public function executeWithTools(string $prompt, array $tools = []): string
    {
        // Implementation for the function calling / tool usage
        return "Simulación de ejecución con tools usando key: " . substr($this->apiKey, 0, 5) . "...";
    }
}
