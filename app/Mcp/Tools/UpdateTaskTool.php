<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Modules\Tasks\Actions\UpdateTaskAction;
use App\Modules\Tasks\DTOs\UpdateTaskDTO;
use App\Modules\Tasks\Models\Task;

class UpdateTaskTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Updates an existing task. Can change status, priority, title, description, or due date.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $taskId = (int) $request->get('task_id');

        /** @var Task|null $task */
        $task = Task::find($taskId);
        if (!$task) {
            return Response::text("Task with ID {$taskId} not found.");
        }

        $data = [];
        if ($request->get('title')) {
            $data['title'] = (string) $request->get('title');
        }
        if ($request->get('status')) {
            $data['status'] = (string) $request->get('status');
        }
        if ($request->get('priority')) {
            $data['priority'] = (string) $request->get('priority');
        }
        if ($request->get('description') !== null) {
            $data['description'] = (string) $request->get('description');
        }
        if ($request->get('due_date') !== null) {
            $data['due_date'] = (string) $request->get('due_date');
        }

        $dto = new UpdateTaskDTO(task: $task, data: $data);
        $updated = app(UpdateTaskAction::class)->execute($dto);

        return Response::text("Success: Task '{$updated->title}' updated. Status: {$updated->status}, Priority: {$updated->priority}.");
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'task_id' => $schema->integer()->description('The ID of the task to update.'),
            'title' => $schema->string()->description('Optional new title.'),
            'status' => $schema->string()->description('Optional: todo, in_progress, done.'),
            'priority' => $schema->string()->description('Optional: low, medium, high.'),
            'description' => $schema->string()->description('Optional new description.'),
            'due_date' => $schema->string()->description('Optional new due date (YYYY-MM-DD).'),
        ];
        return $properties;
    }
}
