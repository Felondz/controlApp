<?php

namespace App\Modules\Operations\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Operations\Events\StageChanged;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Models\EtapaProceso;
use App\Modules\Tasks\Models\Task;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * GenerateStageTasks Listener
 * 
 * Creates tasks from stage templates when a production batch moves to a new stage.
 * Runs asynchronously via Redis queue.
 */
class GenerateStageTasks implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The name of the connection the job should be sent to.
     *
     * @var string|null
     */
    public $connection = 'redis';

    /**
     * Handle the event.
     *
     * @param ModuleEvent $event
     * @return void
     */
    public function handle(ModuleEvent $event): void
    {
        // Only handle operations.lote.stage_changed
        if ($event->getName() !== 'operations.lote.stage_changed') {
            return;
        }

        // Get data from event - check if it's StageChanged with public props
        if ($event instanceof StageChanged) {
            $lote = $event->lote;
            $stage = $event->newStage;
        } else {
            // Fallback: load from payload
            $loteId = $event->get('lote_id');
            $stageId = $event->get('new_stage_id');
            
            /** @var LoteProduccion|null $lote */
            $lote = LoteProduccion::find($loteId);
            /** @var EtapaProceso|null $stage */
            $stage = EtapaProceso::find($stageId);
            
            if (!$lote || !$stage) {
                Log::channel('modules')->warning("GenerateStageTasks: Could not find lote or stage", [
                    'lote_id' => $loteId,
                    'stage_id' => $stageId,
                ]);
                return;
            }
        }

        Log::channel('modules')->info("GenerateStageTasks: Generating tasks for Lote {$lote->code} entering Stage {$stage->name}");

        // 1. Get templates for this stage
        $templates = $stage->taskTemplates;

        if ($templates->isEmpty()) {
            Log::channel('modules')->debug("GenerateStageTasks: No templates for stage {$stage->name}");
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

        Log::channel('modules')->info("GenerateStageTasks: Created {$templates->count()} tasks for Lote {$lote->code}");
    }
}
