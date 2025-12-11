<?php

namespace App\Modules\Operations\Events;

use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Models\EtapaProceso;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StageChanged
{
    use Dispatchable, SerializesModels;

    public $lote;
    public $oldStage;
    public $newStage;

    /**
     * Create a new event instance.
     *
     * @param LoteProduccion $lote
     * @param EtapaProceso|null $oldStage
     * @param EtapaProceso $newStage
     */
    public function __construct(LoteProduccion $lote, ?EtapaProceso $oldStage, EtapaProceso $newStage)
    {
        $this->lote = $lote;
        $this->oldStage = $oldStage;
        $this->newStage = $newStage;
    }
}
