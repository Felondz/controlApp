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
// use App\Modules\Operations\Events\LoteFinished; 

class LoteProduccionFlowTest extends TestCase
{
    use RefreshDatabase, WithFaker;

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

        $payload = [
            'codigo' => 'LOT-001',
            'production_process_id' => $this->process->id,
            'initial_quantity' => 100,
            'start_date' => now()->toDateString(),
        ];

        $response = $this->postJson(route('api.operations.lotes.store', $this->proyecto), $payload);

        $response->assertStatus(201);
        
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

        $payload = [
            'stage_id' => $this->stage2->id,
        ];

        $response = $this->putJson(route('api.operations.lotes.update-stage', [$this->proyecto, $lote]), $payload);

        $response->assertStatus(200);
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

        $payload = [
            'inventory_item_id' => $item->id,
            'quantity' => 5,
            'notes' => 'Adding sugar'
        ];

        $response = $this->postJson(route('api.operations.lotes.add-input', [$this->proyecto, $lote]), $payload);

        $response->assertStatus(201);
        
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

        $response = $this->putJson(route('api.operations.lotes.discard', [$this->proyecto, $lote]), [
            'reason' => 'Quality fail'
        ]);

        $response->assertStatus(200);
        $this->assertEquals('discarded', $lote->fresh()->status);
    }
}
