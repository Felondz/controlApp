<?php

namespace App\Modules\Operations\Listeners;

use App\Modules\Operations\Events\LoteFinished;
use App\Modules\Inventory\Models\InventoryItem;
use Carbon\Carbon;

class HandleLoteFinish
{
    public function handle(LoteFinished $event)
    {
        \Illuminate\Support\Facades\Log::info("HandleLoteFinish: Caught event for Lote {$event->lote->id}");

        $lote = $event->lote;
        $data = $event->finishData;

        // Update Lote Status
        $lote->update([
            'status' => 'finished',
            'actual_end_date' => now(),
            'final_quantity' => $data['final_quantity']
        ]);
        
        \Illuminate\Support\Facades\Log::info("HandleLoteFinish: Lote {$lote->id} marked as finished.");
    }
}
