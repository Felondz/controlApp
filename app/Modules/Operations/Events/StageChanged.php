<?php

namespace App\Modules\Operations\Events;

use App\Core\Events\BaseModuleEvent;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Models\EtapaProceso;

/**
 * StageChanged Event
 * 
 * Dispatched when a production batch moves to a new stage.
 */
class StageChanged extends BaseModuleEvent
{
    /**
     * The batch that changed stages.
     */
    public LoteProduccion $lote;

    /**
     * The previous stage (null if first stage).
     */
    public ?EtapaProceso $oldStage;

    /**
     * The new stage.
     */
    public EtapaProceso $newStage;

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

        parent::__construct('operations', [
            'lote_id' => $lote->id,
            'lote_code' => $lote->code,
            'old_stage_id' => $oldStage?->id,
            'old_stage_name' => $oldStage?->name,
            'new_stage_id' => $newStage->id,
            'new_stage_name' => $newStage->name,
            'assigned_to' => $lote->assigned_to,
        ], $lote->proyecto_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'operations.lote.stage_changed';
    }
}
