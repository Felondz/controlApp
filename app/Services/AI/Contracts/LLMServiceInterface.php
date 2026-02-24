<?php declare(strict_types=1);

namespace App\Services\AI\Contracts;

interface LLMServiceInterface
{
    /**
     * Set the API key for the service instance (resolved dynamically per user).
     */
    public function setApiKey(string $apiKey): self;

    /**
     * Send a prompt to the LLM and return the response text.
     *
     * @param array<string, mixed> $options
     */
    public function generateText(string $prompt, array $options = []): string;
    
    /**
     * Execute a specific set of tools (Actions) exposed to the LLM
     *
     * @param array<mixed> $tools
     */
    public function executeWithTools(string $prompt, array $tools = []): string;
}
