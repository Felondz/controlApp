<?php

namespace App\Modules\Operations\Events;

use App\Modules\Operations\Models\LoteInsumo;
use Illuminate\Broadcasting\InteractsWithSockets;

use Illuminate\Queue\SerializesModels;

class InputConsumed extends \App\Core\Events\BaseModuleEvent
{
    use InteractsWithSockets, SerializesModels;

    public $input;

    public function __construct(LoteInsumo $input)
    {
        $this->input = $input;
        parent::__construct(
            'operations',
            ['input_id' => $input->id],
            $input->lote->proyecto_id ?? null
        );
    }

    public function getName(): string
    {
        return 'operations.input.consumed';
    }
}
