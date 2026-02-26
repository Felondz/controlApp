<?php declare(strict_types=1);

namespace App\Mcp\Servers;

use App\Mcp\Tools\SendMessageTool;
use App\Mcp\Tools\ListMessagesTool;
use Laravel\Mcp\Server;

class ChatServer extends Server
{
    protected string $name = 'ControlApp-Chat';

    protected string $version = '1.0.0';

    protected string $instructions = <<<'MARKDOWN'
        Use these tools to send and read chat messages within a ControlApp project.
        Messages can be public (visible to all members) or private (to a specific recipient).
    MARKDOWN;

    /**
     * @return array<int, class-string>
     */
    protected function tools(): array
    {
        return [
            SendMessageTool::class,
            ListMessagesTool::class,
        ];
    }

    /**
     * @return array<int, class-string>
     */
    protected function prompts(): array
    {
        return [];
    }
}
