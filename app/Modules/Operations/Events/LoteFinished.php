<?php

namespace App\Modules\Operations\Events;

use App\Modules\Operations\Models\LoteProduccion;
use Illuminate\Broadcasting\InteractsWithSockets;

use Illuminate\Queue\SerializesModels;

class LoteFinished extends \App\Core\Events\BaseModuleEvent
{
    use InteractsWithSockets, SerializesModels;

    public LoteProduccion $lote;
    /** @var array<string, mixed> */
    public array $finishData;

    /**
     * @param array<string, mixed> $finishData
     */
    public function __construct(LoteProduccion $lote, array $finishData)
    {
        $this->lote = $lote;
        $this->finishData = $finishData;
        parent::__construct(
            'operations',
            array_merge(['lote_id' => $lote->id], $finishData),
            $lote->proyecto_id
        );
    }

    public function getName(): string
    {
        return 'operations.lote.finished';
    }
}
