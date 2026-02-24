<?php declare(strict_types=1);

namespace App\Mcp\Servers;

use App\Mcp\Tools\ListTasksTool;
use App\Mcp\Tools\CreateTaskTool;
use App\Mcp\Tools\UpdateTaskTool;
use App\Mcp\Tools\TaskSummaryTool;
use Laravel\Mcp\Server;

class TasksServer extends Server
{
    protected string $name = 'ControlApp-Tasks';

    protected string $version = '1.0.0';

    protected string $instructions = <<<'MARKDOWN'
        Use these tools to manage project tasks in ControlApp.
        Tasks have: status (todo, in_progress, done), priority (low, medium, high), optional due_date.
        When providing `proyecto_id`, this is the project context.
    MARKDOWN;

    /**
     * @return array<int, class-string>
     */
    protected function tools(): array
    {
        return [
            ListTasksTool::class,
            CreateTaskTool::class,
            UpdateTaskTool::class,
            TaskSummaryTool::class,
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
