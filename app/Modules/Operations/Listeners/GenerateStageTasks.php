<?php

namespace App\Modules\Operations\Listeners;

use App\Modules\Operations\Events\StageChanged;
use App\Modules\Tasks\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GenerateStageTasks
{
    /**
     * Handle the event.
     *
     * @param  StageChanged  $event
     * @return void
     */
    public function handle(StageChanged $event)
    {
        $lote = $event->lote;
        $stage = $event->newStage;

        Log::info("Generating tasks for Lote {$lote->code} entering Stage {$stage->name}");

        // 1. Get templates for this stage
        $templates = $stage->taskTemplates;

        if ($templates->isEmpty()) {
            return;
        }

        // 2. Create tasks based on templates
        foreach ($templates as $template) {
            $dueDate = null;
            if ($template->days_due_offset >= 0) {
                $dueDate = Carbon::now()->addDays($template->days_due_offset);
            }

            Task::create([
                'proyecto_id' => $lote->proyecto_id,
                'title' => "[{$stage->name}] {$template->name}",
                'description' => $template->description . "\n\n(Generated automatically from stage template)",
                'status' => 'pending',
                'priority' => $template->priority,
                'due_date' => $dueDate,

                // Polymorphic relation to Lote
                'related_type' => get_class($lote),
                'related_id' => $lote->id,

                // Assigned to the user responsible for the Lote by default, or unassigned
                'assigned_to' => $lote->assigned_to,
            ]);
        }
    }
}
