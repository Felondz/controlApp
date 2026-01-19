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
class CreateFinishedGoodsEntry
{
    // use InteractsWithQueue; // Not queueing for now to ensure synchronous execution

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

        $qty = 0;
        $lote = null;

        // Get data from event
        if ($event instanceof LoteFinished) {
            $lote = $event->lote;
            // Use finishData if available, as the model might not be refreshed yet
            $qty = $event->finishData['final_quantity'] ?? $lote->final_quantity;
        } else {
            // Fallback: load from payload
            $loteId = $event->get('lote_id');
            $lote = LoteProduccion::find($loteId);
            
            if ($lote) {
                // Determine qty from payload or model
                $qty = $event->get('final_quantity') ?? $lote->final_quantity;
            }
        }

        if (!$lote) {
            Log::channel('modules')->warning("CreateFinishedGoodsEntry: Could not find lote");
            return;
        }

        if (!$lote->inventory_item_id) {
            Log::channel('modules')->warning("CreateFinishedGoodsEntry: Lote {$lote->code} finished but has no product (inventory_item_id) defined. Skipping stock entry.");
            return;
        }

        // Make sure we have a valid quantity
        if (!$qty || $qty <= 0) {
            // Try to fetch fresh from DB just in case
            $lote->refresh();
            $qty = $lote->final_quantity;
            
            if (!$qty || $qty <= 0) {
                Log::channel('modules')->warning("CreateFinishedGoodsEntry: Lote {$lote->code} finished with zero quantity ({$qty}). Skipping stock entry.");
                return;
            }
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
                $lote->assigned_to
            );
    
            Log::channel('modules')->info("CreateFinishedGoodsEntry: Stock entry created for Lote {$lote->code}");
        } catch (\Exception $e) {
            Log::channel('modules')->error("CreateFinishedGoodsEntry: Failed to register transaction: " . $e->getMessage());
            // Since we are not queuing, we don't fail() the job. We just log.
        }
    }
}
