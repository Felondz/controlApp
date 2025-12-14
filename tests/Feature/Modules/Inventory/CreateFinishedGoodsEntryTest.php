<?php

namespace Tests\Feature\Modules\Inventory;

use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Modules\Inventory\Models\InventoryItem;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Events\LoteFinished;
use App\Modules\Inventory\Listeners\CreateFinishedGoodsEntry;
use App\Modules\Inventory\Services\InventoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

class CreateFinishedGoodsEntryTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_inventory_transaction_when_lote_finished()
    {
        // Arrange
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create();
        
        $item = InventoryItem::factory()->create([
            'proyecto_id' => $proyecto->id,
            'cost_price' => 100,
        ]);

        try {
            $lote = LoteProduccion::factory()->create([
                'proyecto_id' => $proyecto->id,
                'inventory_item_id' => $item->id,
                'current_quantity' => 50,
                'code' => 'TEST-LOTE-001',
                'assigned_to' => $user->id,
            ]);
        } catch (\Exception $e) {
            fwrite(STDERR, "FACTORY ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            throw $e;
        }

        // Mock Service? No, let's test integration nicely or just assert side effects
        // Using real service to verify data persistence
        $service = new InventoryService();
        $listener = new CreateFinishedGoodsEntry($service);

        // Act
        $event = new LoteFinished($lote);
        $listener->handle($event);

        // Assert
        $this->assertDatabaseHas('inventory_transactions', [
            'proyecto_id' => $proyecto->id,
            'inventory_item_id' => $item->id,
            'type' => 'production_in',
            'quantity' => 50,
            'reference_type' => get_class($lote),
            'reference_id' => $lote->id,
            'unit_price' => 100,
            'total_amount' => 5000, // 50 * 100
        ]);
    }
}
