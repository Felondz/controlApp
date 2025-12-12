<?php

namespace App\Modules\Tasks\Events;

use App\Core\Events\BaseModuleEvent;
use App\Modules\Tasks\Models\Task;

/**
 * FinancialTaskCreated Event
 * 
 * Dispatched when a financial task is created.
 */
class FinancialTaskCreated extends BaseModuleEvent
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
            'amount' => $task->amount,
            'category_id' => $task->category_id,
            'due_date' => $task->due_date,
        ], $task->project_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'tasks.financial_task.created';
    }
}
