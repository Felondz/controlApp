<?php

namespace App\Modules\Inventory\Listeners;

use App\Modules\Operations\Events\LoteFinished;
use App\Modules\Inventory\Models\InventoryTransaction;
use Illuminate\Support\Facades\Log;

class CreateFinishedGoodsEntry
{
    /**
     * Handle the event.
     *
     * @param  LoteFinished  $event
     * @return void
     */
    public function handle(LoteFinished $event)
    {
        $lote = $event->lote;

        if (!$lote->inventory_item_id) {
            Log::warning("Lote {$lote->code} finished but has no product (inventory_item_id) defined. Skipping stock entry.");
            return;
        }

        // Qty to add is current_quantity (yield)
        $qty = $lote->current_quantity;

        if ($qty <= 0) {
            Log::warning("Lote {$lote->code} finished with zero quantity. Skipping stock entry.");
            return;
        }

        Log::info("Lote Finished [{$lote->code}]. Adding {$qty} to Inventory Item {$lote->inventory_item_id}");

        // Estimate logic cost? 
        // For simple implementations, maybe 0 or standard cost? 
        // We leave unit_price as 0 or current cost for now as we don't have full cost accounting yet.
        $unitPrice = 0;
        if ($lote->product && $lote->product->cost_price > 0) {
            $unitPrice = $lote->product->cost_price;
        }

        InventoryTransaction::create([
            'proyecto_id' => $lote->proyecto_id,
            'inventory_item_id' => $lote->inventory_item_id,
            'user_id' => $lote->assigned_to, // Or auth id if available, but event usually asynchronous
            'type' => 'production_in',
            'quantity' => $qty,
            'unit_price' => $unitPrice,
            'total_amount' => $qty * $unitPrice,

            // Reference the Lote
            'reference_type' => get_class($lote),
            'reference_id' => $lote->id,

            'status' => 'confirmed', // Production is done, stock is real
            'notes' => "Finished Goods from Lote: {$lote->code}",
            'transaction_date' => now(),
        ]);
    }
}
