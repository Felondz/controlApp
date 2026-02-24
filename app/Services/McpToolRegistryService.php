<?php declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\File;
use Laravel\Mcp\Server\Tool;
use Illuminate\JsonSchema\JsonSchema as JsonSchemaFactory;

class McpToolRegistryService
{
    /**
     * @var array<string, Tool>|null
     */
    protected ?array $tools = null;

    /**
     * Get all available tools from all registered MCP Servers.
     * 
     * @return array<string, Tool> Array mapped by fully qualified class name or tool name.
     */
    public function getAvailableTools(): array
    {
        if ($this->tools !== null) {
            return $this->tools;
        }

        $this->tools = [];
        $serverPath = app_path('Mcp/Servers');

        if (!File::isDirectory($serverPath)) {
            return $this->tools;
        }

        $serverFiles = File::files($serverPath);

        foreach ($serverFiles as $file) {
            $class = 'App\\Mcp\\Servers\\' . $file->getFilenameWithoutExtension();
            if (class_exists($class) && is_subclass_of($class, \Laravel\Mcp\Server::class)) {
                 try {
                     // We need a dummy transport to instantiate the server to read tools if protected.
                     // A better way is to use Reflection if servers define tools protected.
                     $reflection = new \ReflectionClass($class);
                     if ($reflection->hasMethod('tools')) {
                         $method = $reflection->getMethod('tools');
                         $method->setAccessible(true);
                         
                         // Create a fake server instance without a real transport just to get tools array
                         if ($reflection->isAbstract()) continue;
                         $serverInstance = $reflection->newInstanceWithoutConstructor();

                         $toolClasses = $method->invoke($serverInstance);
                         
                         if (is_array($toolClasses)) {
                             foreach ($toolClasses as $toolClass) {
                                 if (class_exists($toolClass) && is_subclass_of($toolClass, Tool::class)) {
                                     /** @var Tool $tool */
                                     $tool = app($toolClass);
                                     $this->tools[$tool->name()] = $tool;
                                 }
                             }
                         }
                     }
                 } catch (\Exception $e) {
                     \Illuminate\Support\Facades\Log::warning("Failed to load tools from MCP server {$class}: " . $e->getMessage());
                 }
            }
        }

        return $this->tools;
    }

    /**
     * Get tools formatted for OpenAI function calling.
     */
    public function getOpenAiTools(): array
    {
        $payload = [];
        foreach ($this->getAvailableTools() as $tool) {
            $toolArray = $tool->toArray();
            
            $payload[] = [
                'type' => 'function',
                'function' => [
                    'name' => $toolArray['name'],
                    'description' => $toolArray['description'] ?? '',
                    'parameters' => $toolArray['inputSchema'] ?? ['type' => 'object', 'properties' => (object)[]],
                ]
            ];
        }
        return $payload;
    }

    /**
     * Get tools formatted for Anthropic function calling.
     */
    public function getAnthropicTools(): array
    {
        $payload = [];
        foreach ($this->getAvailableTools() as $tool) {
            $toolArray = $tool->toArray();
            
            $payload[] = [
                'name' => $toolArray['name'],
                'description' => $toolArray['description'] ?? '',
                'input_schema' => $toolArray['inputSchema'] ?? ['type' => 'object', 'properties' => (object)[]],
            ];
        }
        return $payload;
    }

    /**
     * Get tools formatted for Gemini function calling.
     */
    public function getGeminiTools(): array
    {
        $functionDeclarations = [];
        foreach ($this->getAvailableTools() as $tool) {
            $toolArray = $tool->toArray();
            
            $functionDeclarations[] = [
                'name' => str_replace('-', '_', $toolArray['name']), // Gemini strictly uses snake_case or camelCase, no dashes
                'description' => $toolArray['description'] ?? '',
                'parameters' => $toolArray['inputSchema'] ?? ['type' => 'OBJECT', 'properties' => (object)[]],
            ];
        }
        
        // Gemini expects top level "functionDeclarations"
        return [
            ['functionDeclarations' => $functionDeclarations]
        ];
    }
}
