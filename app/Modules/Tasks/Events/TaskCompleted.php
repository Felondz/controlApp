<?php

namespace App\Modules\Tasks\Events;

use App\Core\Events\BaseModuleEvent;
use App\Modules\Tasks\Models\Task;

/**
 * TaskCompleted Event
 * 
 * Dispatched when a task is marked as completed.
 */
class TaskCompleted extends BaseModuleEvent
{
    /**
     * Create a new event instance.
     *
     * @param Task $task
     */
    public function __construct(Task $task)
    {
        parent::__construct('tasks', [
            'task_id' => $task->id,
            'title' => $task->title,
            'is_financial' => $task->is_financial,
            'amount' => $task->amount,
            'category_id' => $task->category_id,
            'completed_at' => now()->toIso8601String(),
        ], $task->project_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'tasks.task.completed';
    }
}
