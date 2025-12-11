<?php

namespace App\Modules\Operations\Events;

use App\Modules\Operations\Models\LoteProduccion;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LoteFinished
{
    use Dispatchable, SerializesModels;

    public $lote;

    /**
     * Create a new event instance.
     *
     * @param LoteProduccion $lote
     */
    public function __construct(LoteProduccion $lote)
    {
        $this->lote = $lote;
    }
}
