<?php declare(strict_types=1);

namespace App\Modules\Tasks\Actions;

use App\Modules\Tasks\DTOs\UpdateTaskDTO;
use App\Modules\Tasks\Models\Task;

class UpdateTaskAction
{
    public function execute(UpdateTaskDTO $dto): Task
    {
        $dto->task->update($dto->data);

        if ($dto->assignees !== null) {
            $dto->task->users()->sync($dto->assignees);
        }

        return $dto->task;
    }
}
