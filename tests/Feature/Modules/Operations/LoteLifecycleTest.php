<?php

namespace Tests\Feature\Modules\Operations;

use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Modules\Operations\Models\ProductionProcess;
use App\Modules\Operations\Models\EtapaProceso;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Inventory\Models\InventoryItem;
use App\Modules\Operations\Events\LoteFinished;
use App\Modules\Operations\Events\LoteDiscarded;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Inertia\Testing\AssertableInertia as Assert;

class LoteLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_finish_lote_in_last_stage()
    {
        // Setup
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create();
        $user->proyectos()->attach($proyecto->id, ['rol' => 'admin']);
        $this->actingAs($user);

        $item = InventoryItem::factory()->create(['proyecto_id' => $proyecto->id]);

        $process = ProductionProcess::factory()->create(['proyecto_id' => $proyecto->id, 'inventory_item_id' => $item->id]);
        $stage1 = EtapaProceso::create(['proyecto_id' => $proyecto->id, 'production_process_id' => $process->id, 'name' => 'S1', 'order' => 1]);
        $stage2 = EtapaProceso::create(['proyecto_id' => $proyecto->id, 'production_process_id' => $process->id, 'name' => 'S2', 'order' => 2]); // Last Stage

        $lote = LoteProduccion::create([
            'proyecto_id' => $proyecto->id,
            'production_process_id' => $process->id,
            'stage_id' => $stage2->id,
            'inventory_item_id' => $item->id,
            'code' => 'LOTE-FIN-001',
            'status' => 'active',
        ]);



        // Act
        $response = $this->post(route('operations.lotes.finish', [$proyecto, $lote]), [
            'final_quantity' => 100,
            'inventory_item_id' => $item->id,
        ]);

        // Assert
        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Note: Status update happens via listener (Async usually), but if LoteFinished event is faked,
        // the listener won't run unless we manually assert or if the controller does status update directly (which it doesn't, it dispatches event).
        // Wait, looking at LoteController::finish, it dispatches event.
        // If we fake the event, the listeners WON'T run, so the DB won't update if logic is inside listener.
        // Let's NOT fake the event if we want to check DB side effects, OR we trust the event is dispatched.
        // The user wants to verify "Lifecycle", which implies state change.
        // If logic is in listener, we should likely NOT fake it, or manually trigger logic.
        // However, `LoteFinished` event dispatch is what we primarily control in Controller.
        
        $this->assertEquals('finished', $lote->refresh()->status);
    }



    public function test_can_discard_lote()
    {
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create();
        $user->proyectos()->attach($proyecto->id, ['rol' => 'admin']);
        $this->actingAs($user);

        $lote = LoteProduccion::factory()->create([
            'proyecto_id' => $proyecto->id,
            'status' => 'active'
        ]);



        $response = $this->put(route('operations.lotes.discard', [$proyecto, $lote]), [
            'reason' => 'Bad quality'
        ]);

        $response->assertRedirect();
        $this->assertEquals('discarded', $lote->refresh()->status);
    }

    public function test_history_page_renders_and_filters()
    {
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create();
        $user->proyectos()->attach($proyecto->id, ['rol' => 'admin']);
        $this->actingAs($user);

        $finishedLote = LoteProduccion::factory()->create([
            'proyecto_id' => $proyecto->id,
            'status' => 'finished',
            'code' => 'FIN-123'
        ]);

        $activeLote = LoteProduccion::factory()->create([
            'proyecto_id' => $proyecto->id,
            'status' => 'active',
            'code' => 'ACT-456'
        ]);

        // Visit History
        $response = $this->get(route('operations.lotes.history', ['proyecto' => $proyecto]));

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Operations/Lotes/History')
                ->has('lotes.data', 2)
            );

        // Filter by Status Finished
        $response = $this->get(route('operations.lotes.history', [
            'proyecto' => $proyecto,
            'status' => 'finished'
        ]));

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Operations/Lotes/History')
                ->has('lotes.data', 1)
                ->where('lotes.data.0.code', 'FIN-123')
            );
    }
}
