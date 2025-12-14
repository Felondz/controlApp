<?php

namespace Tests\Feature\Modules\Inventory;

use App\Models\Proyecto;
use App\Models\User;
use App\Modules\Inventory\Models\InventoryItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryItemApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Proyecto $project;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->project = Proyecto::factory()->create([
            'user_id' => $this->user->id,
        ]);
        
        // Attach user as admin
        $this->project->miembros()->attach($this->user->id, ['rol' => 'admin']);
    }

    public function test_can_list_inventory_items(): void
    {
        // Create some items
        InventoryItem::factory()->count(3)->create([
            'proyecto_id' => $this->project->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('inventory.items.index', ['proyecto' => $this->project->id]));

        $response->assertStatus(200);
    }

    public function test_can_create_inventory_item(): void
    {
        $itemData = [
            'name' => 'Test Item',
            'sku' => 'TEST-001',
            'type' => 'raw_material',
            'unit' => 'unit',
            'min_stock_level' => 10,
            'sale_price' => 99.99,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('inventory.items.store', ['proyecto' => $this->project->id]), $itemData);

        $response->assertStatus(302); // Redirect after success

        $this->assertDatabaseHas('inventory_items', [
            'proyecto_id' => $this->project->id,
            'name' => 'Test Item',
            'sku' => 'TEST-001',
        ]);
    }

    public function test_unauthenticated_user_cannot_access_inventory(): void
    {
        $response = $this->get(route('inventory.items.index', ['proyecto' => $this->project->id]));

        $response->assertRedirect(route('login'));
    }
}
