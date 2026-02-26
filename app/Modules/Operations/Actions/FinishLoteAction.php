<?php

declare(strict_types=1);

namespace App\Modules\Operations\Actions;

use App\Modules\Operations\DTOs\FinishLoteDTO;
use App\Modules\Operations\Models\LoteProduccion;
use Exception;

class FinishLoteAction
{
    /**
     * @throws Exception If lote is not active
     */
    public function execute(FinishLoteDTO $dto): LoteProduccion
    {
        $lote = $dto->lote;
        
        if ($lote->status !== 'active') {
            throw new Exception('El lote no está activo.');
        }

        \App\Modules\Operations\Events\LoteFinished::dispatch(
            $lote, 
            ['final_quantity' => $dto->finalQuantity, 'inventory_item_id' => $dto->inventoryItemId]
        );

        return $lote;
    }
}
