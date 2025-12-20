<?php

namespace App\Modules\Operations\Listeners;

use App\Modules\Operations\Events\LoteFinished;
use App\Modules\Inventory\Models\InventoryItem;
use Carbon\Carbon;

class HandleLoteFinish
{
    public function handle(LoteFinished $event)
    {
        \Illuminate\Support\Facades\Log::info("HandleLoteFinish running for Lote {$event->lote->id}");

        $lote = $event->lote;
        $data = $event->finishData;

        // Update Lote Status

        // Update Lote Status
        $lote->update([
            'status' => 'finished',
            'actual_end_date' => Carbon::now(),
            'final_quantity' => $data['final_quantity']
        ]);

        // Increase Inventory for Output Product
        if (!empty($data['inventory_item_id'])) {
            $item = InventoryItem::find($data['inventory_item_id']);
            if ($item) {
                // Create Inventory Transaction
                \App\Modules\Inventory\Models\InventoryTransaction::create([
                    'proyecto_id' => $lote->proyecto_id,
                    'inventory_item_id' => $item->id,
                    'user_id' => $lote->assigned_to ?? auth()->id(),
                    'type' => 'production_in',
                    'quantity' => $lote->final_quantity,
                    'unit_price' => $item->cost_price, // Or calculated cost
                    'total_amount' => $lote->final_quantity * $item->cost_price,
                    'reference_type' => get_class($lote),
                    'reference_id' => $lote->id,
                    'status' => 'confirmed',
                    'transaction_date' => now(),
                ]);

                $item->increment('current_stock', $lote->final_quantity);
                \Illuminate\Support\Facades\Log::info("Stock incremented for item {$item->id}. Added: {$lote->final_quantity}. New stock: {$item->current_stock}");
            } else {
                 \Illuminate\Support\Facades\Log::warning("HandleLoteFinish: Item not found for ID {$data['inventory_item_id']}");
            }
        } else {
             \Illuminate\Support\Facades\Log::warning("HandleLoteFinish: Empty inventory_item_id in event data");
        }
    }
}
