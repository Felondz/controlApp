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
            $previousAssignees = $dto->task->users()->pluck('users.id')->toArray();
            $dto->task->users()->sync($dto->assignees);

            // Find newly added assignees
            $newAssignees = array_diff($dto->assignees, $previousAssignees);

            if (!empty($newAssignees)) {
                /** @var \App\Models\User $user */
                $user = auth()->user();
                $usersToNotify = \App\Models\User::whereIn('id', $newAssignees)
                    ->where('id', '!=', $user->id)
                    ->get();

                foreach ($usersToNotify as $assignee) {
                    $assignee->notify(new \App\Notifications\TaskAssignedNotification($dto->task, $user));
                }
            }
        }

        return $dto->task;
    }
}
