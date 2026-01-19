<?php

namespace App\Modules\Operations\Events;

use App\Modules\Operations\Models\LoteProduccion;
use Illuminate\Broadcasting\InteractsWithSockets;

use Illuminate\Queue\SerializesModels;

class LoteDiscarded extends \App\Core\Events\BaseModuleEvent
{
    use InteractsWithSockets, SerializesModels;

    public $lote;
    public $reason;

    public function __construct(LoteProduccion $lote, string $reason)
    {
        $this->lote = $lote;
        $this->reason = $reason;
        parent::__construct(
            'operations',
            ['lote_id' => $lote->id, 'reason' => $reason],
            $lote->proyecto_id
        );
    }

    public function getName(): string
    {
        return 'operations.lote.discarded';
    }
}
