<?php

declare(strict_types=1);

namespace App\Modules\Operations\Actions;

use App\Modules\Operations\DTOs\AddLoteInputDTO;

class AddLoteInputAction
{
    public function execute(AddLoteInputDTO $dto): void
    {
        // Add additional validations (e.g. check if Lote is 'active' if needed)
        // For now, mirroring existing controller logic which dispatches an async event

        \App\Modules\Operations\Events\LoteInputAdded::dispatch(
            $dto->lote, 
            [
                'inventory_item_id' => $dto->inventoryItemId,
                'quantity' => $dto->quantity,
                'notes' => $dto->notes,
            ]
        );
    }
}
