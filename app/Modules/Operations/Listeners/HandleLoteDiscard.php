<?php

namespace App\Modules\Operations\Listeners;

use App\Modules\Operations\Events\LoteDiscarded;
use Carbon\Carbon;

class HandleLoteDiscard
{
    public function handle(LoteDiscarded $event): void
    {
        $lote = $event->lote;
        
        // Mark as discarded (or cancelled)
        // Mark as discarded
        $lote->update([
            'status' => 'discarded',
            'discarded_at' => Carbon::now(),
            'discard_reason' => $event->reason,
            'actual_end_date' => Carbon::now()
        ]);
    }
}
