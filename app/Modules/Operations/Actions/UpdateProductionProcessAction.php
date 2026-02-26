<?php

declare(strict_types=1);

namespace App\Modules\Operations\Actions;

use App\Modules\Operations\DTOs\UpdateProductionProcessDTO;
use App\Modules\Operations\Models\ProductionProcess;

class UpdateProductionProcessAction
{
    public function execute(UpdateProductionProcessDTO $dto): ProductionProcess
    {
        // Business logic constraints (if any) could be validated here
        // Currently it just performs the update safely
        
        $dto->process->update([
            'name' => $dto->name,
            'description' => $dto->description,
            'inventory_item_id' => $dto->inventoryItemId,
            'is_active' => $dto->isActive,
        ]);

        return $dto->process;
    }
}
