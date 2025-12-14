<?php

namespace Tests\Feature\Modules\Tasks;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Proyecto;
use App\Models\User;
use App\Modules\Operations\Models\EtapaProceso;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Models\StageTaskTemplate;
use App\Modules\Operations\Events\StageChanged;
use App\Modules\Tasks\Models\Task;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;

class GenerateStageTasksTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_generates_tasks_when_stage_changed_listener_handle_is_called()
    {
        // 1. Setup - Create dependencies strictly
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create(); // Searchable might trigger here, usually safe alone
        
        $stage = EtapaProceso::factory()->create(['proyecto_id' => $proyecto->id, 'name' => 'Siowing']);
        
        $template = StageTaskTemplate::factory()->create([
            'proyecto_id' => $proyecto->id,
            'etapa_proceso_id' => $stage->id,
            'name' => 'Check Soil Moisture',
            'days_due_offset' => 5,
        ]);
        
        // Manual Lote creation to avoid Factory recursion/overhead
        $lote = new LoteProduccion();
        $lote->proyecto_id = $proyecto->id;
        $lote->stage_id = $stage->id;
        $lote->assigned_to = $user->id;
        $lote->code = 'LOTE-MANUAL-001';
        $lote->status = 'active';
        $lote->initial_quantity = 100;
        $lote->current_quantity = 100;
        $lote->start_date = now();
        
        // Prevent Observers/Scout from crashing
        LoteProduccion::flushEventListeners();
        $lote->save();

        // 2. Instantiate Listener
        $listener = new \App\Modules\Tasks\Listeners\GenerateStageTasks();

        // 3. Create Event
        $event = new StageChanged($lote, null, $stage);

        // 4. Act
        $listener->handle($event);

        // 5. Assert
        $this->assertDatabaseHas('tasks', [
            'project_id' => $proyecto->id,
            'title' => 'Check Soil Moisture',
            'related_id' => $lote->id,
            'related_type' => get_class($lote),
            'assigned_to' => $user->id,
            'status' => 'pending',
        ]);
    }
}
