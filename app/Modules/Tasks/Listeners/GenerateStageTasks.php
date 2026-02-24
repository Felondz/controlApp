<?php

namespace App\Modules\Tasks\Listeners;

use App\Modules\Operations\Events\StageChanged;
use App\Modules\Tasks\Models\Task;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class GenerateStageTasks implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(StageChanged $event): void
    {
        Log::info("GenerateStageTasks: Processing stage change for Lote {$event->lote->code} to Stage {$event->newStage->name}");

        try {
            // Eager load templates for the new stage
            $templates = $event->newStage->taskTemplates;

            if ($templates->isEmpty()) {
                Log::info("GenerateStageTasks: No task templates found for stage {$event->newStage->name}");
                return;
            }

            foreach ($templates as $template) {
                /** @var object{days_due_offset: int|null, name: string, description: string, priority: string|null} $template */
                $daysOffset = $template->days_due_offset;
                
                $dueDate = $daysOffset !== null 
                    ? Carbon::now()->addDays((int) $daysOffset) 
                    : null;

                Task::create([
                    'project_id' => $event->lote->proyecto_id,
                    'title' => $template->name,
                    'description' => $template->description . "\n\nAuto-generated from stage: " . $event->newStage->name,
                    'status' => 'pending',
                    'priority' => $template->priority ?? 'medium',
                    'due_date' => $dueDate,
                    'assigned_to' => $event->lote->assigned_to, // Assign to batch responsible
                    'related_type' => \App\Modules\Operations\Models\LoteProduccion::class,
                    'related_id' => $event->lote->id,
                ]);

                Log::info("GenerateStageTasks: Created task '{$template->name}' for Lote {$event->lote->code}");
            }

        } catch (\Exception $e) {
            Log::error("GenerateStageTasks: Failed to generate tasks. Error: " . $e->getMessage());
        }
    }
}
