<?php

declare(strict_types=1);

namespace App\Modules\Operations\Actions;

use App\Modules\Operations\DTOs\UpdateLoteDTO;
use App\Modules\Operations\Models\LoteProduccion;

class UpdateLoteAction
{
    public function execute(UpdateLoteDTO $dto): LoteProduccion
    {
        $dto->lote->update([
            'notes' => $dto->notes,
            'assigned_to' => $dto->assignedTo,
        ]);

        return $dto->lote;
    }
}
