<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Tasks\Actions\CreateTaskAction;
use App\Modules\Tasks\DTOs\CreateTaskDTO;

class CreateTaskTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Creates a new task in a project. Status: todo, in_progress, done. Priority: low, medium, high.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        $dto = new CreateTaskDTO(
            proyecto: $proyecto,
            title: (string) $request->get('title'),
            status: (string) ($request->get('status') ?? 'todo'),
            priority: (string) ($request->get('priority') ?? 'medium'),
            description: $request->get('description') ? (string) $request->get('description') : null,
            dueDate: $request->get('due_date') ? (string) $request->get('due_date') : null,
        );

        $task = app(CreateTaskAction::class)->execute($dto);

        return Response::text("Success: Task '{$task->title}' created with ID {$task->id}. Status: {$task->status}, Priority: {$task->priority}.");
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project.'),
            'title' => $schema->string()->description('Title of the task.'),
            'status' => $schema->string()->description('Optional: todo (default), in_progress, done.'),
            'priority' => $schema->string()->description('Optional: low, medium (default), high.'),
            'description' => $schema->string()->description('Optional description.'),
            'due_date' => $schema->string()->description('Optional due date (YYYY-MM-DD).'),
        ];
        return $properties;
    }
}
