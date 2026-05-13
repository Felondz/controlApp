<?php

namespace App\Modules\Tasks\Events;

use App\Core\Events\BaseModuleEvent;
use App\Modules\Tasks\Models\Task;

/**
 * TaskCreated Event
 * 
 * Dispatched when a new task is created.
 */
class TaskCreated extends BaseModuleEvent
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
            'status' => $task->status,
            'priority' => $task->priority,
            'due_date' => $task->due_date,
            'assignee_id' => $task->assignee_id,
            'is_financial' => $task->is_financial,
            'amount' => $task->amount,
            'category_id' => $task->category_id,
        ], (string) $task->project_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'tasks.task.created';
    }
}
