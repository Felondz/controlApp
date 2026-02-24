<?php

namespace Tests\Feature\Modules\Operations;

use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Modules\Operations\Models\ProductionProcess;
use App\Modules\Operations\Models\EtapaProceso;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Inventory\Models\InventoryItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;
use App\Modules\Operations\Events\LoteCreated;
use App\Modules\Operations\Events\StageChanged;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;

class LoteProduccionFlowTest extends TestCase
{
    use RefreshDatabase, WithFaker, MakesGraphQLRequests;

    protected $user;
    protected $proyecto;
    protected $process;
    protected $stage1;
    protected $stage2;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->proyecto = Proyecto::factory()->create();
        $this->proyecto->miembros()->attach($this->user->id, ['rol' => 'admin']);

        // Setup Process with Stages
        $this->process = ProductionProcess::factory()->create(['proyecto_id' => $this->proyecto->id]);
        $this->stage1 = EtapaProceso::factory()->create([
            'production_process_id' => $this->process->id,
            'name' => 'Inicio',
            'order' => 1
        ]);
        $this->stage2 = EtapaProceso::factory()->create([
            'production_process_id' => $this->process->id,
            'name' => 'Final',
            'order' => 2
        ]);
    }

    public function test_can_create_lote_from_process()
    {
        $this->actingAs($this->user);

        // Spy on ModuleEventBus
        $busSpy = $this->spy(\App\Core\Events\ModuleEventBus::class);

        $query = '
            mutation CreateLote($proyecto_id: ID!, $production_process_id: ID!, $start_date: DateTime!) {
                createLote(proyecto_id: $proyecto_id, production_process_id: $production_process_id, start_date: $start_date) {
                    id
                    stage_id
                }
            }
        ';

        $response = $this->graphQL($query, [
            'proyecto_id' => $this->proyecto->id,
            'production_process_id' => $this->process->id,
            'start_date' => now()->toDateTimeString(),
        ]);

        $response->assertJsonStructure(['data' => ['createLote' => ['id', 'stage_id']]]);
        
        $lote = LoteProduccion::where('production_process_id', $this->process->id)->first();
        $this->assertNotNull($lote);
        $this->assertEquals($this->stage1->id, $lote->stage_id);

        // Verify LoteCreated event was dispatched
        $busSpy->shouldHaveReceived('dispatch')->withArgs(function ($event) {
            return $event instanceof LoteCreated;
        })->once();
    }

    public function test_can_advance_lote_stage()
    {
        $this->actingAs($this->user);
        
        $busSpy = $this->spy(\App\Core\Events\ModuleEventBus::class);

        $lote = LoteProduccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'production_process_id' => $this->process->id,
            'stage_id' => $this->stage1->id,
            'initial_quantity' => 100,
            'current_quantity' => 100,
            'start_date' => now()->toDateString(),
            'status' => 'active',
        ]);

        $query = '
            mutation UpdateLoteStage($id: ID!, $proyecto_id: ID!, $stage_id: ID!) {
                updateLoteStage(id: $id, proyecto_id: $proyecto_id, stage_id: $stage_id) {
                    id
                    stage_id
                }
            }
        ';

        $response = $this->graphQL($query, [
            'id' => $lote->id,
            'proyecto_id' => $this->proyecto->id,
            'stage_id' => $this->stage2->id,
        ]);

        $response->assertJsonStructure(['data' => ['updateLoteStage' => ['id']]]);
        $this->assertEquals($this->stage2->id, $lote->fresh()->stage_id);

        // Verify StageChanged event was dispatched
        $busSpy->shouldHaveReceived('dispatch')->withArgs(function ($event) {
            return $event instanceof StageChanged;
        })->once();
    }

    public function test_can_add_input_to_lote()
    {
        $this->actingAs($this->user);

        $lote = LoteProduccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'production_process_id' => $this->process->id
        ]);

        $item = InventoryItem::factory()->create(['proyecto_id' => $this->proyecto->id]);

        $query = '
            mutation AddLoteInput($id: ID!, $proyecto_id: ID!, $inventory_item_id: ID!, $quantity: Float!, $notes: String) {
                addLoteInput(id: $id, proyecto_id: $proyecto_id, inventory_item_id: $inventory_item_id, quantity: $quantity, notes: $notes) {
                    id
                }
            }
        ';

        $response = $this->graphQL($query, [
            'id' => $lote->id,
            'proyecto_id' => $this->proyecto->id,
            'inventory_item_id' => $item->id,
            'quantity' => 5,
            'notes' => 'Adding sugar'
        ]);

        $response->assertJsonStructure(['data' => ['addLoteInput' => ['id']]]);
        
        $this->assertDatabaseHas('lote_insumos', [
            'lote_produccion_id' => $lote->id,
            'inventory_item_id' => $item->id,
            'quantity' => 5
        ]);
    }

    public function test_can_discard_lote()
    {
        $this->actingAs($this->user);

        $lote = LoteProduccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'status' => 'active'
        ]);

        $query = '
            mutation DiscardLote($id: ID!, $proyecto_id: ID!, $reason: String!) {
                discardLote(id: $id, proyecto_id: $proyecto_id, reason: $reason) {
                    id
                    status
                }
            }
        ';

        $response = $this->graphQL($query, [
            'id' => $lote->id,
            'proyecto_id' => $this->proyecto->id,
            'reason' => 'Quality fail'
        ]);

        $response->assertJsonStructure(['data' => ['discardLote' => ['id']]]);
        $this->assertEquals('discarded', $lote->fresh()->status);
    }
}
