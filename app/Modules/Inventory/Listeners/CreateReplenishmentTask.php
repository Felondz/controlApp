<?php

namespace App\Modules\Inventory\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Inventory\Events\InventoryLowStock;
use App\Modules\Inventory\Models\InventoryItem;
use App\Modules\Tasks\Models\Task;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * CreateReplenishmentTask Listener
 * 
 * Creates a high-priority task when inventory falls below minimum threshold.
 * Runs asynchronously via Redis queue.
 */
class CreateReplenishmentTask implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The name of the connection the job should be sent to.
     *
     * @var string|null
     */
    public $connection = 'redis';

    /**
     * Handle the event.
     *
     * @param ModuleEvent $event
     * @return void
     */
    public function handle(ModuleEvent $event): void
    {
        // Only handle inventory.stock.low
        if ($event->getName() !== 'inventory.stock.low') {
            return;
        }

        // Get data from event
        if ($event instanceof InventoryLowStock) {
            $item = $event->item;
            $currentStock = $event->currentStock;
        } else {
            // Fallback: load from payload
            $itemId = $event->get('item_id');
            $currentStock = $event->get('current_stock', 0);
            
            /** @var InventoryItem|null $item */
            $item = InventoryItem::find($itemId);
            
            if (!$item) {
                Log::channel('modules')->warning("CreateReplenishmentTask: Could not find item", [
                    'item_id' => $itemId,
                ]);
                return;
            }
        }

        Log::channel('modules')->info("CreateReplenishmentTask: Generating Replenishment Task for Item {$item->sku} (Stock: {$currentStock})");

        // 1. Check if there is already a PENDING task for this item replenishment to avoid duplicates
        $existingTask = Task::where('related_type', get_class($item))
            ->where('related_id', $item->id)
            ->where('status', 'pending')
            ->where('title', 'like', 'Reponer%')
            ->first();

        if ($existingTask) {
            Log::channel('modules')->info("CreateReplenishmentTask: Pending replenishment task already exists for {$item->sku}. Skipping.");
            return;
        }

        // 2. Create Task
        Task::create([
            'project_id' => $item->proyecto_id,
            'title' => "Reponer Stock: {$item->name} ({$item->sku})",
            'description' => "El stock actual es {$currentStock} {$item->unit}. El nivel mínimo es {$item->min_stock_level}.\n\nPor favor iniciar compra o producción.",
            'status' => 'pending',
            'priority' => 'high',
            'due_date' => Carbon::now()->addDays(2), // Urgent

            // Polymorphic link to the item
            'related_type' => get_class($item),
            'related_id' => $item->id,

            // Assign to? Maybe null (unassigned) or project admin.
            'assigned_to' => null,
        ]);

        Log::channel('modules')->info("CreateReplenishmentTask: Replenishment task created for {$item->sku}");
    }
}
