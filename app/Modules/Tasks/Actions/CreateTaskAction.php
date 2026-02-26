<?php declare(strict_types=1);

namespace App\Modules\Tasks\Actions;

use App\Modules\Tasks\DTOs\CreateTaskDTO;
use App\Modules\Tasks\Models\Task;

class CreateTaskAction
{
    public function execute(CreateTaskDTO $dto): Task
    {
        $project = $dto->proyecto;
        $data = [
            'title' => $dto->title,
            'project_id' => $project->id, 
            'user_id' => $dto->assignees[0] ?? null, // Using first assignee as creator if not specified
            'due_date' => $dto->dueDate,
            'related_type' => $dto->relatedType,
            'related_id' => $dto->relatedId,
            'description' => $dto->description,
            'status' => $dto->status,
            'priority' => $dto->priority,
        ];

        /** @var \App\Modules\Tasks\Models\Task $task */
        $task = $project->tasks()->create($data);

        // Map assigned_user_ids or assignees from DTO if they exist
        $assignees = $dto->assigned_user_ids ?? $dto->assignees ?? [];
        if (!empty($assignees)) {
            $task->users()->sync($assignees);
        }

        return $task;
    }
}
