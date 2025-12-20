<?php

namespace App\Modules\Operations\Listeners;

use App\Modules\Operations\Events\LoteCreated;
// Remove unnecessary imports
use Illuminate\Support\Facades\Log;

class HydrateLoteInputs
{
    // Removing ShouldQueue to ensure inputs are ready immediately for UI

    /**
     * Handle the event.
     *
     * @param LoteCreated $event
     * @return void
     */
    public function handle(LoteCreated $event)
    {
        $lote = $event->lote;
        $lote->load('productionProcess.etapas.inputTemplates.item');

        Log::info("Hydrating inputs for Lote: {$lote->code} (ID: {$lote->id}) from Process: {$lote->productionProcess->name}");

        foreach ($lote->productionProcess->etapas as $stage) {
            foreach ($stage->inputTemplates as $template) {
                // IDEMPOTENCY: Check if input already exists (e.g. created by HandleLoteCreated for first stage)
                $exists = $lote->inputs()
                    ->where('inventory_item_id', $template->inventory_item_id)
                    ->where('stage_id', $stage->id)
                    ->exists();

                if ($exists) continue;

                // Determine unit cost (use current cost price of the item)
                $unitCost = $template->item->cost_price ?? 0;
                
                // Create the planned input
                $lote->inputs()->create([
                    'inventory_item_id' => $template->inventory_item_id,
                    'stage_id' => $stage->id,
                    'quantity' => $template->quantity,
                    'unit_cost' => $unitCost,
                    'total_cost' => $template->quantity * $unitCost,
                    'status' => 'pending', 
                    'notes' => $template->notes,
                ]);
            }
        }
    }
}
