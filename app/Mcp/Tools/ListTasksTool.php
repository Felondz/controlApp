<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Modules\Tasks\Models\Task;

class ListTasksTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Lists tasks for a project. Optionally filter by status (todo, in_progress, done).
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');
        $status = $request->get('status') ? (string) $request->get('status') : null;

        $query = Task::where('project_id', $proyectoId)->with(['users', 'category']);

        if ($status) {
            $query->where('status', $status);
        }

        $tasks = $query->orderByDesc('created_at')->limit(30)->get();

        if ($tasks->isEmpty()) {
            return Response::text("No tasks found for project {$proyectoId}.");
        }

        $result = "Tasks:\n";
        foreach ($tasks as $task) {
            $assignees = $task->users->pluck('name')->join(', ') ?: 'Unassigned';
            $due = $task->due_date ? $task->due_date->format('Y-m-d') : 'No due date';
            $result .= "- [{$task->id}] [{$task->status}] [{$task->priority}] {$task->title} | Due: {$due} | Assigned: {$assignees}\n";
        }

        return Response::text($result);
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project.'),
            'status' => $schema->string()->description('Optional: todo, in_progress, done.'),
        ];
        return $properties;
    }
}
