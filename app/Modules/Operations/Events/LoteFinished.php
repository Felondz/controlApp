<?php

namespace App\Modules\Operations\Events;

use App\Core\Events\BaseModuleEvent;
use App\Modules\Operations\Models\LoteProduccion;
use Carbon\Carbon;

/**
 * LoteFinished Event
 * 
 * Dispatched when a production batch is completed.
 */
class LoteFinished extends BaseModuleEvent
{
    /**
     * The finished batch.
     */
    public LoteProduccion $lote;

    /**
     * Create a new event instance.
     *
     * @param LoteProduccion $lote
     */
    public function __construct(LoteProduccion $lote)
    {
        $this->lote = $lote;

        parent::__construct('operations', [
            'lote_id' => $lote->id,
            'lote_code' => $lote->code,
            'inventory_item_id' => $lote->inventory_item_id,
            'current_quantity' => $lote->current_quantity,
            'assigned_to' => $lote->assigned_to,
            'finished_at' => Carbon::now()->toIso8601String(),
        ], $lote->proyecto_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'operations.lote.finished';
    }
}
