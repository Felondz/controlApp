<?php

namespace App\Modules\Operations\Events;

use App\Modules\Operations\Models\LoteProduccion;
use Illuminate\Broadcasting\InteractsWithSockets;

use Illuminate\Queue\SerializesModels;

class LoteInputAdded extends \App\Core\Events\BaseModuleEvent
{
    use InteractsWithSockets, SerializesModels;

    public LoteProduccion $lote;
    /** @var array<string, mixed> */
    public array $inputData;

    /**
     * @param array<string, mixed> $inputData
     */
    public function __construct(LoteProduccion $lote, array $inputData)
    {
        $this->lote = $lote;
        $this->inputData = $inputData;
        parent::__construct(
            'operations',
            $inputData,
            $lote->proyecto_id
        );
    }

    public function getName(): string
    {
        return 'operations.lote.input_added';
    }
}
