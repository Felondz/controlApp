<?php

namespace App\Modules\Inventory\Listeners;

use App\Modules\Inventory\Events\InventoryLowStock;
use App\Models\Task;
use Illuminate\Support\Facades\Log;

class CreateReplenishmentTask
{
    /**
     * Handle the event.
     *
     * @param  InventoryLowStock  $event
     * @return void
     */
    public function handle(InventoryLowStock $event)
    {
        $item = $event->item;
        $currentStock = $event->currentStock;

        Log::info("Generating Replenishment Task for Item {$item->sku} (Stock: {$currentStock})");

        // 1. Check if there is already a PENDING task for this item replenishment to avoid duplicates
        // Polymorphic search on tasks table?
        // Or string search in title?
        // Let's use polymorphic relationship if possible, but Task `related` is polymorphic.
        // We can link the task to the InventoryItem.

        $existingTask = Task::where('related_type', get_class($item))
            ->where('related_id', $item->id)
            ->where('status', 'pending')
            ->where('title', 'like', 'Reponer%') // Simple heuristic
            ->first();

        if ($existingTask) {
            Log::info("Pending replenishment task already exists for {$item->sku}. Skipping.");
            return;
        }

        // 2. Create Task
        Task::create([
            'proyecto_id' => $item->proyecto_id, // InventoryItem doesn't have projeto_id? Yes it does, added in migration?
            // Let's check InventoryItem model.
            // If InventoryItem is global or linked to project? Migration said `proyectos` constrained.
            'title' => "Reponer Stock: {$item->name} ({$item->sku})",
            'description' => "El stock actual es {$currentStock} {$item->unit}. El nivel mínimo es {$item->min_stock_level}.\n\nPor favor iniciar compra o producción.",
            'status' => 'pending',
            'priority' => 'high',
            'due_date' => now()->addDays(2), // Urgent

            // Polymorphic link to the item
            'related_type' => get_class($item),
            'related_id' => $item->id,

            // Assign to? Maybe null (unassigned) or project admin.
            'assigned_to' => null,
        ]);

        Log::info("Replenishment task created for {$item->sku}");
    }
}
