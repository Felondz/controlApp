<?php declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiAgentService
{
    public function __construct(
        protected McpToolRegistryService $toolRegistry
    ) {}

    /**
     * @param string $provider 'openai', 'anthropic', 'gemini'
     * @param string $apiKey
     * @param string $model
     * @param array $messages Array of messages like [['role' => 'system', 'content' => '...'], ['role' => 'user', 'content' => '...']]
     * @param array $availableModels List of models available for this provider to use as fallbacks
     */
    public function runLoop(string $provider, string $apiKey, string $model, array $messages, array $availableModels = []): string
    {
        $maxTurns = 5;
        $turn = 0;

        while ($turn < $maxTurns) {
            $response = null;
            $currentModel = $model;
            $modelsToTry = [$currentModel];

            // Add fallback models excluding the currently selected one
            foreach ($availableModels as $m) {
                if ($m['id'] !== $currentModel) {
                    $modelsToTry[] = $m['id'];
                }
            }

            foreach ($modelsToTry as $index => $attemptModel) {
                try {
                    $response = match ($provider) {
                        'openai' => $this->askOpenAi($apiKey, $attemptModel, $messages),
                        'anthropic' => $this->askAnthropic($apiKey, $attemptModel, $messages),
                        'gemini' => $this->askGemini($apiKey, $attemptModel, $messages),
                        default => throw new \Exception('Provider unsupported.'),
                    };
                    
                    // If successful, update the main model reference so future turns in the loop use the working model
                    $model = $attemptModel;
                    break; // Break the attempt loop
                } catch (\Exception $e) {
                    $isRateLimit = str_contains($e->getMessage(), '429');
                    
                    if ($isRateLimit && $index < count($modelsToTry) - 1) {
                        Log::warning("Model {$attemptModel} on {$provider} hit rate limit (429). Falling back to next model...");
                        continue; // Try the next model in the fallback array
                    }
                    
                    throw $e; // Throw if not rate limit, or if no models left to try
                }
            }

            if ($response['type'] === 'text') {
                return $response['content'];
            }

            if ($response['type'] === 'tool_calls') {
                // OpenAI can return multiple tool calls
                $messages[] = $response['assistant_message'];

                foreach ($response['calls'] as $call) {
                    $toolName = $call['name'];
                    // Gemini maps names with underscores, we must map them back or handle them
                    $toolArgs = $call['args'];
                    
                    Log::info("Tool triggered: {$toolName}", $toolArgs);

                    $toolOutput = $this->executeTool($toolName, $toolArgs);

                    if ($provider === 'openai') {
                        $messages[] = [
                            'role' => 'tool',
                            'tool_call_id' => $call['id'],
                            'content' => $toolOutput,
                        ];
                    } elseif ($provider === 'anthropic') {
                        $messages[] = [
                            'role' => 'user',
                            'content' => [
                                [
                                    'type' => 'tool_result',
                                    'tool_use_id' => $call['id'],
                                    'content' => $toolOutput,
                                ]
                            ]
                        ];
                    } elseif ($provider === 'gemini') {
                        $messages[] = [
                            'role' => 'function', // Gemini requires 'function' role for results
                            'parts' => [
                                [
                                    'functionResponse' => [
                                        'name' => $toolName,
                                        'response' => [
                                            // Gemini expects a JSON object inside response
                                            'result' => $toolOutput
                                        ]
                                    ]
                                ]
                            ]
                        ];
                    }
                }
            }
            $turn++;
        }

        return "El agente alcanzó el límite de turnos sin entregar una respuesta final.";
    }

    protected function executeTool(string $name, array $args): string
    {
        $allTools = $this->toolRegistry->getAvailableTools();
        $targetTool = null;
        
        foreach ($allTools as $tool) {
            $tName = $tool->name();
            if ($name === $tName || str_replace('-', '_', $tName) === $name) {
                $targetTool = $tool;
                break;
            }
        }

        if (!$targetTool) {
            return "Error: Tool {$name} not found.";
        }

        try {
            $request = new \Laravel\Mcp\Request($args);
            /** @var \Laravel\Mcp\Response $response */
            $response = $targetTool->handle($request);
            
            // The Content object inside Response implements toArray() in this package
            $respArray = $response->content()->toArray();
            
            // Check if it's text
            if (isset($respArray['text'])) {
                return (string) $respArray['text'];
            }
            
            // Or if deeply nested, though Text just returns ['type' => 'text', 'text' => '...']
            return json_encode($respArray);
        } catch (\Exception $e) {
            Log::error("Tool execution failed: " . $e->getMessage());
            return "Error ejecutando la herramienta {$name}: " . $e->getMessage();
        }
    }

    private function askOpenAi(string $apiKey, string $model, array $messages): array
    {
        $tools = $this->toolRegistry->getOpenAiTools();
        
        $payload = [
            'model' => $model,
            'messages' => $messages,
        ];

        if (!empty($tools)) {
            $payload['tools'] = $tools;
            $payload['tool_choice'] = 'auto';
        }

        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::withToken($apiKey)
            ->timeout(60)
            ->post('https://api.openai.com/v1/chat/completions', $payload);

        if ($response->failed()) {
            throw new \Exception('OpenAI API request failed: ' . $response->body());
        }

        $message = $response->json('choices.0.message');
        
        if (!empty($message['tool_calls'])) {
            $calls = [];
            foreach ($message['tool_calls'] as $call) {
                $calls[] = [
                    'id' => $call['id'],
                    'name' => $call['function']['name'],
                    'args' => json_decode($call['function']['arguments'], true) ?? [],
                ];
            }
            return [
                'type' => 'tool_calls',
                'assistant_message' => $message,
                'calls' => $calls,
            ];
        }

        return ['type' => 'text', 'content' => $message['content'] ?? '...'];
    }

    private function askAnthropic(string $apiKey, string $model, array $messages): array
    {
        $systemPrompts = [];
        $regularMessages = [];
        
        // Anthropic expects system prompt at the top level, separated from messages array
        foreach ($messages as $msg) {
            if ($msg['role'] === 'system') {
                $systemPrompts[] = $msg['content'];
            } else {
                $regularMessages[] = $msg;
            }
        }

        $tools = $this->toolRegistry->getAnthropicTools();
        
        $payload = [
            'model' => $model,
            'max_tokens' => 1024,
            'messages' => $regularMessages,
        ];
        
        if (!empty($systemPrompts)) {
            $payload['system'] = implode("\n", $systemPrompts);
        }

        if (!empty($tools)) {
            $payload['tools'] = $tools;
        }

        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::withHeaders([
            'x-api-key' => $apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])->timeout(60)->post('https://api.anthropic.com/v1/messages', $payload);

        if ($response->failed()) {
            throw new \Exception('Anthropic API request failed: ' . $response->body());
        }

        $stopReason = $response->json('stop_reason');
        $content = $response->json('content');

        if ($stopReason === 'tool_use') {
            $calls = [];
            foreach ($content as $block) {
                if ($block['type'] === 'tool_use') {
                    $calls[] = [
                        'id' => $block['id'],
                        'name' => $block['name'],
                        'args' => $block['input'] ?? [],
                    ];
                }
            }
            return [
                'type' => 'tool_calls',
                // For Anthropic, we must append the exact assistant response block back as 'assistant'
                'assistant_message' => [
                    'role' => 'assistant',
                    'content' => $content,
                ],
                'calls' => $calls,
            ];
        }

        // Just find the text block
        $text = '';
        foreach ($content as $block) {
            if ($block['type'] === 'text') {
                $text .= $block['text'];
            }
        }

        return ['type' => 'text', 'content' => $text ?: '...'];
    }

    private function askGemini(string $apiKey, string $model, array $messages): array
    {
        $systemInstructions = [];
        $geminiMessages = [];
        
        // Map standard messages array to Gemini format
        foreach ($messages as $msg) {
            if ($msg['role'] === 'system') {
                $systemInstructions[] = ['text' => $msg['content']];
            } elseif ($msg['role'] === 'function') {
                 // Already Gemini formatted function response from our loop, just add directly
                 $geminiMessages[] = $msg;
            } else {
                $role = $msg['role'] === 'assistant' ? 'model' : 'user';
                $parts = [];
                
                // If the message contains tool calls (Gemini formatting)
                if (isset($msg['functionCall'])) {
                    $parts[] = ['functionCall' => $msg['functionCall']];
                } elseif (isset($msg['content'])) {
                    $parts[] = ['text' => $msg['content']];
                }
                
                $geminiMessages[] = [
                    'role' => $role,
                    'parts' => $parts,
                ];
            }
        }

        $payload = [
            'contents' => $geminiMessages,
        ];
        
        if (!empty($systemInstructions)) {
            $payload['system_instruction'] = ['parts' => $systemInstructions];
        }

        $tools = $this->toolRegistry->getGeminiTools();
        if (!empty($tools[0]['functionDeclarations'])) {
            $payload['tools'] = $tools;
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";
        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::timeout(60)->post($url, $payload);

        if ($response->failed()) {
            throw new \Exception('Gemini API request failed: ' . $response->body());
        }

        $part = $response->json('candidates.0.content.parts.0');

        if (isset($part['functionCall'])) {
            $call = $part['functionCall'];
            return [
                'type' => 'tool_calls',
                'assistant_message' => [
                    'role' => 'assistant', // Mapped to 'model' internally later
                    'functionCall' => $call,
                ],
                'calls' => [
                    [
                        'id' => 'gemini-call', // Gemini doesn't use IDs natively like this
                        'name' => $call['name'],
                        'args' => $call['args'] ?? [],
                    ]
                ],
            ];
        }

        return ['type' => 'text', 'content' => $part['text'] ?? '...'];
    }
}
