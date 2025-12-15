<?php

namespace App\Modules\Tasks\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Tasks\Models\Task;
use Illuminate\Support\Facades\Log;

/**
 * FinanceEventListener
 * 
 * Listens to finance-related events from the Finance module.
 */
class FinanceEventListener
{
    /**
     * Handle transaction created event.
     *
     * @param ModuleEvent $event
     * @return void
     */
    public function handleTransactionCreated(ModuleEvent $event): void
    {
        $taskId = $event->get('task_id');

        if (!$taskId) {
            return; // Transaction not linked to a task
        }

        $task = Task::find($taskId);

        if (!$task || !$task->is_financial) {
            return;
        }

        Log::info("Transaction created for financial task", [
            'task_id' => $taskId,
            'transaction_id' => $event->get('transaction_id'),
            'amount' => $event->get('amount'),
        ]);

        // Task is already marked as 'done' by TransaccionController
        // This listener is for additional processing if needed

        // Future: Could dispatch a notification event
        // Future: Could update project budget tracking
    }
}
