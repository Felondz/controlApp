<?php

namespace App\Modules\Operations\Events;

use App\Modules\Operations\Models\LoteProduccion;
use Illuminate\Broadcasting\InteractsWithSockets;

use Illuminate\Queue\SerializesModels;

class LoteCreated extends \App\Core\Events\BaseModuleEvent
{
    use InteractsWithSockets, SerializesModels;

    public $lote;

    /**
     * Create a new event instance.
     *
     * @param LoteProduccion $lote
     */
    public function __construct(LoteProduccion $lote)
    {
        $this->lote = $lote;
        parent::__construct(
            'operations',
            ['lote_id' => $lote->id],
            $lote->proyecto_id
        );
    }

    public function getName(): string
    {
        return 'operations.lote.created';
    }
}
