<?php

namespace App\Modules\Operations\Listeners;

use App\Modules\Operations\Events\LoteCreated;
use App\Modules\Operations\Models\StageInputTemplate;
use App\Modules\Operations\Models\LoteInsumo;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log; // Useful for verify if it runs

class HandleLoteCreated
{
    public function handle(LoteCreated $event)
    {
        $lote = $event->lote;
        
        // Find inputs for the initial stage (lote->stage_id)
        $templates = StageInputTemplate::where('etapa_proceso_id', $lote->stage_id)->get();

        foreach ($templates as $template) {
            $quantity = $template->quantity > 0 ? $template->quantity : 0;
            $isAutoConsume = $quantity > 0;

            $insumo = LoteInsumo::create([
                'lote_produccion_id' => $lote->id,
                'inventory_item_id' => $template->inventory_item_id,
                'quantity' => $quantity,
                'unit_cost' => $template->item->cost_price ?? 0,
                'total_cost' => $quantity * ($template->item->cost_price ?? 0),
                'status' => $isAutoConsume ? 'consumed' : 'pending',
                'consumed_at' => $isAutoConsume ? Carbon::now() : null,
                'stage_id' => $lote->stage_id, // Ensure stage_id is saved
                'notes' => 'Auto-generated from Recipe (Start)',
            ]);

            if ($isAutoConsume) {
                // Dispatch event to decrement inventory via Inventory module
                \App\Modules\Operations\Events\InputConsumed::dispatch($insumo);
            }
        }
    }
}
