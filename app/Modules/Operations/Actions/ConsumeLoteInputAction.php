<?php

declare(strict_types=1);

namespace App\Modules\Operations\Actions;

use App\Modules\Operations\DTOs\ConsumeLoteInputDTO;
use App\Modules\Operations\Models\LoteInsumo;
use Exception;

class ConsumeLoteInputAction
{
    /**
     * @throws Exception
     */
    public function execute(ConsumeLoteInputDTO $dto): LoteInsumo
    {
        $input = $dto->input;

        if ($input->lote_produccion_id !== $dto->lote->id) {
            throw new Exception('Acceso denegado: El insumo no pertenece a este lote.');
        }

        if ($input->status === 'consumed') {
            throw new Exception('El insumo ya ha sido consumido.');
        }

        $quantity = $dto->quantity;
        $totalCost = $quantity * ($input->product->cost_price ?? 0);

        $input->update([
            'status' => 'consumed',
            'quantity' => $quantity,
            'total_cost' => $totalCost,
            'consumed_at' => now(),
        ]);

        \App\Modules\Operations\Events\InputConsumed::dispatch($input);

        return $input;
    }
}
