<?php

namespace App\Modules\Inventory\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Operations\Events\LoteFinished;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Inventory\Services\InventoryService;
use App\Modules\Inventory\Models\InventoryTransaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * CreateFinishedGoodsEntry Listener
 * 
 * Creates inventory entries for finished goods when a production batch completes.
 * Runs asynchronously via Redis queue.
 */
class CreateFinishedGoodsEntry implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The name of the connection the job should be sent to.
     *
     * @var string|null
     */
    public $connection = 'redis';

    protected $inventoryService;

    /**
     * Create the event listener.
     */
    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Handle the event.
     *
     * @param ModuleEvent $event
     * @return void
     */
    public function handle(ModuleEvent $event): void
    {
        // Only handle operations.lote.finished
        if ($event->getName() !== 'operations.lote.finished') {
            return;
        }

        // Get data from event
        if ($event instanceof LoteFinished) {
            $lote = $event->lote;
        } else {
            // Fallback: load from payload
            $loteId = $event->get('lote_id');
            
            $lote = LoteProduccion::find($loteId);
            
            if (!$lote) {
                Log::channel('modules')->warning("CreateFinishedGoodsEntry: Could not find lote", [
                    'lote_id' => $loteId,
                ]);
                return;
            }
        }

        if (!$lote->inventory_item_id) {
            Log::channel('modules')->warning("CreateFinishedGoodsEntry: Lote {$lote->code} finished but has no product (inventory_item_id) defined. Skipping stock entry.");
            return;
        }

        // Qty to add is current_quantity (yield)
        $qty = $lote->current_quantity;

        if ($qty <= 0) {
            Log::channel('modules')->warning("CreateFinishedGoodsEntry: Lote {$lote->code} finished with zero quantity. Skipping stock entry.");
            return;
        }

        Log::channel('modules')->info("CreateFinishedGoodsEntry: Lote Finished [{$lote->code}]. Adding {$qty} to Inventory Item {$lote->inventory_item_id}");

        // Estimate logic cost
        $unitPrice = 0;
        if ($lote->product && $lote->product->cost_price > 0) {
            $unitPrice = $lote->product->cost_price;
        }

        try {
            $this->inventoryService->registerTransaction(
                $lote->proyecto_id,
                $lote->inventory_item_id,
                'production_in',
                $qty,
                $unitPrice,
                get_class($lote),
                $lote->id,
                "Finished Goods from Lote: {$lote->code}",
                $lote->assigned_to // User who finished it? Or system? Using assigned_to as proxy.
            );
    
            Log::channel('modules')->info("CreateFinishedGoodsEntry: Stock entry created for Lote {$lote->code}");
        } catch (\Exception $e) {
            Log::channel('modules')->error("CreateFinishedGoodsEntry: Failed to register transaction: " . $e->getMessage());
            $this->fail($e);
        }
    }
}
