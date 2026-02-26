<?php declare(strict_types=1);

namespace App\Modules\Tasks\Actions;

use App\Modules\Tasks\Models\Task;

class DeleteTaskAction
{
    public function execute(Task $task): void
    {
        $task->delete();
    }
}
