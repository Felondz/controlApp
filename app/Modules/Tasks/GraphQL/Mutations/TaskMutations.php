<?php declare(strict_types=1);

namespace App\Modules\Tasks\GraphQL\Mutations;

use App\Models\Proyecto;
use App\Modules\Tasks\Actions\CreateTaskAction;
use App\Modules\Tasks\Actions\UpdateTaskAction;
use App\Modules\Tasks\Actions\CreateTaskCommentAction;
use App\Modules\Tasks\DTOs\CreateTaskDTO;
use App\Modules\Tasks\DTOs\UpdateTaskDTO;
use App\Modules\Tasks\Models\Task;
use App\Modules\Tasks\Models\TaskComment;
use Illuminate\Support\Facades\Auth;

class TaskMutations
{
    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function createTask(mixed $_, array $args): Task
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['project_id']);

        $dto = new CreateTaskDTO(
            proyecto: $proyecto,
            title: (string) $args['title'],
            status: $args['status'] ?? 'todo',
            priority: $args['priority'] ?? 'medium',
            description: $args['description'] ?? null,
            dueDate: $args['due_date'] ?? null,
            assignees: isset($args['assignees']) ? array_map('intval', $args['assignees']) : null,
            relatedType: $args['related_type'] ?? null,
            relatedId: $args['related_id'] ?? null
        );

        return app(CreateTaskAction::class)->execute($dto);
    }

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function updateTask(mixed $_, array $args): Task
    {
        /** @var Task $task */
        $task = Task::findOrFail($args['id']);
        
        $data = collect($args)->except('id', 'assignees')->toArray();

        $dto = new UpdateTaskDTO(
            task: $task,
            data: $data,
            assignees: isset($args['assignees']) ? array_map('intval', $args['assignees']) : null
        );

        return app(UpdateTaskAction::class)->execute($dto);
    }

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function createTaskComment(mixed $_, array $args): TaskComment
    {
        /** @var Task $task */
        $task = Task::findOrFail($args['task_id']);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        return app(CreateTaskCommentAction::class)->execute(
            $task,
            $user,
            (string) $args['content']
        );
    }
}
