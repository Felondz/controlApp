<?php

namespace Tests\Feature\Modules\Operations;

use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Modules\Operations\Models\ProductionProcess;
use App\Modules\Operations\Models\EtapaProceso;
use App\Modules\Inventory\Models\InventoryItem;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;

class ProductionProcessTest extends TestCase
{
    use RefreshDatabase, WithFaker, MakesGraphQLRequests;

    protected $user;
    protected $proyecto;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->proyecto = Proyecto::factory()->create();
        $this->proyecto->miembros()->attach($this->user->id, ['rol' => 'admin']);
    }

    public function test_admin_can_create_production_process()
    {
        $this->actingAs($this->user);

        $outputItem = InventoryItem::factory()->create(['proyecto_id' => $this->proyecto->id]);

        $query = '
            mutation CreateProductionProcess($proyecto_id: ID!, $name: String!, $description: String, $inventory_item_id: ID) {
                createProductionProcess(proyecto_id: $proyecto_id, name: $name, description: $description, inventory_item_id: $inventory_item_id) {
                    id
                    name
                }
            }
        ';

        $response = $this->graphQL($query, [
            'proyecto_id' => $this->proyecto->id,
            'name' => 'Café Lavado',
            'description' => 'Proceso estándar para café lavado',
            'inventory_item_id' => $outputItem->id,
        ]);

        $response->assertJsonStructure(['data' => ['createProductionProcess' => ['id', 'name']]]);

        $this->assertDatabaseHas('production_processes', [
            'name' => 'Café Lavado',
            'proyecto_id' => $this->proyecto->id
        ]);
    }

    public function test_process_can_have_stages_and_templates()
    {
        $this->actingAs($this->user);

        // 1. Create Process
        $process = ProductionProcess::factory()->create(['proyecto_id' => $this->proyecto->id]);

        // 2. Add Stages (via API or Factory? Let's assume API for full flow or Factory for logic)
        // Since we want to test hierarchy, let's use the Factory relationship logic from the implementation plan
        // But here we test the model/relationship integrity if API endpoints for stages aren't separate.
        // Assuming there is an endpoint or we test the model logic.
        // Let's test the Model integrity first as per plan "CRUD and Hierarchy".
        
        $stage1 = EtapaProceso::factory()->create([
            'production_process_id' => $process->id,
            'name' => 'Fermentación',
            'order' => 1
        ]);

        $stage2 = EtapaProceso::factory()->create([
            'production_process_id' => $process->id,
            'name' => 'Secado',
            'order' => 2
        ]);

        $this->assertCount(2, $process->etapas);
        $this->assertEquals('Fermentación', $process->etapas->first()->name);
    }

    public function test_can_update_production_process()
    {
        $this->actingAs($this->user);

        $process = ProductionProcess::factory()->create(['proyecto_id' => $this->proyecto->id]);

        $query = '
            mutation UpdateProductionProcess($id: ID!, $proyecto_id: ID!, $name: String!) {
                updateProductionProcess(id: $id, proyecto_id: $proyecto_id, name: $name) {
                    id
                    name
                }
            }
        ';

        $response = $this->graphQL($query, [
            'id' => $process->id,
            'proyecto_id' => $this->proyecto->id,
            'name' => 'Proceso Actualizado',
        ]);

        $response->assertJsonStructure(['data' => ['updateProductionProcess' => ['id']]]);
        $this->assertDatabaseHas('production_processes', ['name' => 'Proceso Actualizado']);
    }

    public function test_can_delete_production_process()
    {
        $this->actingAs($this->user);

        $process = ProductionProcess::factory()->create(['proyecto_id' => $this->proyecto->id]);

        $query = '
            mutation DeleteProductionProcess($id: ID!, $proyecto_id: ID!) {
                deleteProductionProcess(id: $id, proyecto_id: $proyecto_id)
            }
        ';

        $response = $this->graphQL($query, [
            'id' => $process->id,
            'proyecto_id' => $this->proyecto->id,
        ]);

        $response->assertJsonStructure(['data' => ['deleteProductionProcess']]);
        $this->assertSoftDeleted($process);
    }
}
