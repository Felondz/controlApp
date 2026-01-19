<?php

namespace App\Modules\Operations\Listeners;

use App\Modules\Operations\Events\InputConsumed;
use App\Modules\Inventory\Models\InventoryTransaction;

class HandleInputConsumed
{
    public function handle(InputConsumed $event)
    {
        // DEPRECATED: Logic moved to Inventory Module (DeductInventoryUsage)
        \Illuminate\Support\Facades\Log::warning("HandleInputConsumed (Operations) called but is depreciated. Skipping.");
        return;
        
        /*
        $input = $event->input;
        $item = $input->product;

        if ($item) {
            // Create Inventory Transaction
            InventoryTransaction::create([
                'proyecto_id' => $input->lote->proyecto_id,
                'inventory_item_id' => $item->id,
                'user_id' => auth()->id() ?? $input->lote->assigned_to,
                'type' => 'production_out', // Consumption is an output from inventory
                'quantity' => -$input->quantity,
                'unit_price' => $input->unit_cost,
                'total_amount' => $input->total_cost,
                'reference_type' => get_class($input->lote),
                'reference_id' => $input->lote->id,
                'status' => 'confirmed',
                'transaction_date' => now(),
            ]);

            // Decrement Stock
            $oldStock = $item->current_stock;
            $item->decrement('current_stock', $input->quantity);
            
            \Illuminate\Support\Facades\Log::info("HandleInputConsumed: Deducting {$input->quantity} from item {$item->id}. OldStock: {$oldStock}, NewStock: {$item->fresh()->current_stock}");
        }
        */
    }
}
