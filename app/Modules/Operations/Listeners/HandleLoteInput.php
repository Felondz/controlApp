<?php

namespace App\Modules\Operations\Listeners;

use App\Modules\Operations\Events\LoteInputAdded;
use App\Modules\Operations\Models\LoteInsumo;
use App\Modules\Inventory\Services\InventarioService; // Assuming this exists or using Logic directly
use App\Modules\Inventory\Models\InventoryItem;

class HandleLoteInput
{
    public function handle(LoteInputAdded $event): void
    {
        $lote = $event->lote;
        $data = $event->inputData;

        // Create the consumed input record
        $input = new LoteInsumo();
        $input->lote_produccion_id = $lote->id;
        $input->inventory_item_id = $data['inventory_item_id'];
        $input->stage_id = $lote->stage_id;
        $input->quantity = $data['quantity'];
        $input->status = 'consumed';
        $input->consumed_at = now();
        
        // Calculate cost (simple approximation or fetching current cost)
        $item = InventoryItem::find($data['inventory_item_id']);
        $unitDisplayCost = $item ? $item->cost_price : 0; // Fixed column name from unit_cost to cost_price
        // If we strictly track cost layers, this might be more complex. For now, using average/current unit cost.
        $input->unit_cost = $unitDisplayCost; 
        $input->total_cost = $input->quantity * $unitDisplayCost;
        $input->notes = $data['notes'] ?? null;
        $input->save();

        \Illuminate\Support\Facades\Log::info("HandleLoteInput: Created input {$input->id}. Qty: {$input->quantity}, UnitCost: {$input->unit_cost}, Total: {$input->total_cost}");
        
        // Dispatch event for inventory deduction (Centralized logic)
        \App\Modules\Operations\Events\InputConsumed::dispatch($input);
    }
}
