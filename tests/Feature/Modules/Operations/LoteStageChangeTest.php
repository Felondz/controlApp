<?php

namespace Tests\Feature\Modules\Operations;

use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Modules\Operations\Models\ProductionProcess;
use App\Modules\Operations\Models\EtapaProceso;
use App\Modules\Operations\Models\StageInputTemplate;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Inventory\Models\InventoryItem;
use App\Modules\Operations\Events\InputConsumed;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

class LoteStageChangeTest extends TestCase
{
    use RefreshDatabase;

    public function test_changing_stage_consumes_inventory_inputs_automatically()
    {
        // 1. Setup
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create();
        $user->proyectos()->attach($proyecto->id, ['rol' => 'admin']);

        // Inventory Item
        $item = InventoryItem::create([
            'proyecto_id' => $proyecto->id,
            'name' => 'Raw Material A',
            'current_stock' => 100,
            'unit' => 'kg',
            'cost_price' => 10,
            'is_active' => true,
        ]);

        // Process with 2 stages
        $process = ProductionProcess::create([
            'proyecto_id' => $proyecto->id,
            'name' => 'Test Process',
            'is_active' => true,
        ]);

        $stage1 = EtapaProceso::create([
            'proyecto_id' => $proyecto->id,
            'production_process_id' => $process->id,
            'name' => 'Stage 1',
            'order' => 1,
        ]);

        $stage2 = EtapaProceso::create([
            'proyecto_id' => $proyecto->id,
            'production_process_id' => $process->id,
            'name' => 'Stage 2',
            'order' => 2,
        ]);

        // Stage 2 has Input Template
        StageInputTemplate::create([
            'etapa_proceso_id' => $stage2->id,
            'inventory_item_id' => $item->id,
            'quantity' => 10, // Should auto-consume
        ]);

        // Lote at Stage 1
        $lote = LoteProduccion::create([
            'proyecto_id' => $proyecto->id,
            'production_process_id' => $process->id,
            'stage_id' => $stage1->id,
            'code' => 'LOTE-TEST-001',
            'status' => 'active',
        ]);



        // 2. Act - Move to Stage 2
        $response = $this->actingAs($user)
            ->put(route('operations.lotes.update-stage', [
                'proyecto' => $proyecto->id,
                'lote' => $lote->id
            ]), [
                'stage_id' => $stage2->id,
                'consume_inputs' => true,
            ]);

        // 3. Assert
        $response->assertSessionHasNoErrors();

        // Reload lote to check stage
        $lote->refresh();
        $this->assertEquals($stage2->id, $lote->stage_id);

        // Check Input created
        $this->assertDatabaseHas('lote_insumos', [
            'lote_produccion_id' => $lote->id,
            'inventory_item_id' => $item->id,
            'quantity' => 10,
            'status' => 'consumed', // This is what the user implies is NOT happening or partially happening
        ]);

        // Check Input created and consumed
        $this->assertDatabaseHas('lote_insumos', [
            'lote_produccion_id' => $lote->id,
            'inventory_item_id' => $item->id,
            'quantity' => 10,
            'status' => 'consumed',
        ]);
    }
}
