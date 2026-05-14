<?php declare(strict_types=1);

namespace App\Modules\Tasks\Actions;

use App\Modules\Tasks\DTOs\UpdateTaskDTO;
use App\Modules\Tasks\Models\Task;
use Illuminate\Support\Facades\Storage;

class UpdateTaskAction
{
    public function execute(UpdateTaskDTO $dto): Task
    {
        $data = $dto->data;

        if ($dto->image) {
            // Delete old image
            if ($dto->task->image_path) {
                Storage::disk('local')->delete($dto->task->image_path);
            }

            $path = (new \App\Actions\SanitizeImageAction())->execute($dto->image, 'tasks/' . $dto->task->project_id, 'local');
            $data['image_path'] = $path;
        }

        $dto->task->update($data);

        // Multiple images
        if (!empty($dto->images)) {
            foreach ($dto->images as $img) {
                $path = (new \App\Actions\SanitizeImageAction())->execute($img, 'tasks/' . $dto->task->project_id . '/gallery', 'local');
                $dto->task->images()->create(['image_path' => $path]);
            }
        }

        if ($dto->assignees !== null) {
            $dto->task->users()->sync($dto->assignees);
        }

        return $dto->task;
    }
}
