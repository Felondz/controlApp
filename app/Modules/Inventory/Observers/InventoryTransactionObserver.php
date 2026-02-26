<?php

namespace App\Modules\Inventory\Observers;

use App\Modules\Inventory\Models\InventoryTransaction;
use App\Modules\Inventory\Models\InventoryItem;
use App\Modules\Inventory\Events\InventoryLowStock;
use Illuminate\Support\Facades\Log;

class InventoryTransactionObserver
{
    /**
     * Handle the InventoryTransaction "created" event.
     *
     * @param  InventoryTransaction  $transaction
     * @return void
     */
    public function created(InventoryTransaction $transaction)
    {
        // Only affect stock if confirmed (not draft)
        // Actually, schema implies transactions are the source of truth, 
        // but 'draft' shouldn't count yet.
        if ($transaction->status !== 'confirmed') {
            return;
        }

        $this->updateStock($transaction);
    }

    /**
     * Handle the InventoryTransaction "updated" event.
     *
     * @param  InventoryTransaction  $transaction
     * @return void
     */
    public function updated(InventoryTransaction $transaction)
    {
        // If status changed to confirmed, process it.
        if ($transaction->wasChanged('status') && $transaction->status === 'confirmed') {
            $this->updateStock($transaction);
        }
    }

    protected function updateStock(InventoryTransaction $transaction): void
    {
        $item = $transaction->item;
        if (!$item)
            return;

        $previousStock = $item->current_stock;

        // Recalculate stock? Or just add/subtract?
        // Safest is to sum all confirmed transactions for this item to ensure consistency, 
        // considering concurrency. But for now, incremental update.
        // Wait, 'current_stock' in InventoryItem is a cache column.

        // Let's do a full sum recalculation to be safe against race conditions / manual edits
        $newStock = InventoryTransaction::where('inventory_item_id', $item->id)
            ->where('status', 'confirmed')
            ->sum('quantity');

        $item->update(['current_stock' => $newStock]);

        Log::info("Stock Updated for Item {$item->sku}: {$previousStock} -> {$newStock}");

        // Dispatch public event for other modules (Finance)
        \App\Modules\Inventory\Events\InventoryTransactionConfirmed::dispatch($transaction);

        // Check for Low Stock
        if ($item->min_stock_level > 0 && $newStock <= $item->min_stock_level) {
            // Trigger alert only if it wasn't already low (to prevent spam)
            // Or if we want persistent nagging?
            // Simple logic: if new stock is low, fire event. Listener handles spam logic (e.g. check open tasks).

            Log::warning("Low Stock Alert: Item {$item->sku} is at {$newStock} (Min: {$item->min_stock_level})");
            InventoryLowStock::dispatch($item, (float) $newStock);
        }
    }
}
