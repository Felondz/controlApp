<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Modules\Tasks\Models\Task;

class TaskSummaryTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Gets task status counters for a project: todo, in_progress, done, and overdue counts.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        $tasks = Task::where('project_id', $proyectoId)->get();

        $todo = $tasks->where('status', 'todo')->count();
        $inProgress = $tasks->where('status', 'in_progress')->count();
        $done = $tasks->where('status', 'done')->count();
        $overdue = $tasks->where('due_date', '<', now())->where('status', '!=', 'done')->count();

        return Response::text(
            "Task Summary for Project {$proyectoId}:\n" .
            "- Todo: {$todo}\n" .
            "- In Progress: {$inProgress}\n" .
            "- Done: {$done}\n" .
            "- Overdue: {$overdue}\n" .
            "- Total: " . $tasks->count()
        );
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project.'),
        ];
        return $properties;
    }
}
