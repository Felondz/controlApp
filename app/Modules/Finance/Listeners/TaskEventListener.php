<?php

namespace App\Modules\Finance\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Models\Task;
use Illuminate\Support\Facades\Log;

/**
 * TaskEventListener
 * 
 * Listens to task-related events from the Tasks module.
 */
class TaskEventListener
{
    /**
     * Handle task completed event.
     *
     * @param ModuleEvent $event
     * @return void
     */
    public function handleTaskCompleted(ModuleEvent $event): void
    {
        $taskId = $event->get('task_id');
        $task = Task::find($taskId);

        if (!$task || !$task->is_financial) {
            return;
        }

        Log::info("Financial task completed", [
            'task_id' => $taskId,
            'amount' => $task->amount,
            'project_id' => $event->getProjectId(),
        ]);

        // Future enhancement: Could dispatch a notification event
        // to suggest creating a transaction or updating budget
    }

    /**
     * Handle financial task created event.
     *
     * @param ModuleEvent $event
     * @return void
     */
    public function handleFinancialTaskCreated(ModuleEvent $event): void
    {
        $taskId = $event->get('task_id');
        $amount = $event->get('amount');
        $dueDate = $event->get('due_date');

        Log::info("New financial task created", [
            'task_id' => $taskId,
            'amount' => $amount,
            'due_date' => $dueDate,
            'project_id' => $event->getProjectId(),
        ]);

        // Future enhancement: Could create a budget alert or reminder
        // if the task amount is significant
    }
}
