<?php declare(strict_types=1);

namespace App\Modules\Tasks\Actions;

use App\Modules\Tasks\DTOs\CreateTaskDTO;
use App\Modules\Tasks\Models\Task;

class CreateTaskAction
{
    public function execute(CreateTaskDTO $dto): Task
    {
        $project = $dto->proyecto;
        
        $imagePath = null;
        if ($dto->image) {
            $imagePath = (new \App\Actions\SanitizeImageAction())->execute($dto->image, 'tasks/' . $project->id, 'local');
        }

        $data = [
            'title' => $dto->title,
            'project_id' => $project->id, 
            'user_id' => auth()->id(),
            'due_date' => $dto->dueDate,
            'related_type' => $dto->relatedType,
            'related_id' => $dto->relatedId,
            'description' => $dto->description,
            'status' => $dto->status,
            'priority' => $dto->priority,
            'image_path' => $imagePath,
        ];

        /** @var \App\Modules\Tasks\Models\Task $task */
        $task = $project->tasks()->create($data);

        // Multiple images
        if (!empty($dto->images)) {
            foreach ($dto->images as $img) {
                $path = (new \App\Actions\SanitizeImageAction())->execute($img, 'tasks/' . $project->id . '/gallery', 'local');
                $task->images()->create(['image_path' => $path]);
            }
        }

        // Map assignees from DTO if they exist
        $assignees = $dto->assignees ?? [];
        if (!empty($assignees)) {
            $task->users()->sync($assignees);
        }

        return $task;
    }
}
