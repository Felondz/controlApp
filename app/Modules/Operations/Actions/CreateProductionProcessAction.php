<?php

declare(strict_types=1);

namespace App\Modules\Operations\Actions;

use App\Modules\Operations\DTOs\CreateProductionProcessDTO;
use App\Modules\Operations\Models\ProductionProcess;
use App\Modules\Operations\Models\EtapaProceso;
use Illuminate\Support\Facades\DB;

class CreateProductionProcessAction
{
    public function execute(CreateProductionProcessDTO $dto): ProductionProcess
    {
        return DB::transaction(function () use ($dto) {
            $process = ProductionProcess::create([
                'proyecto_id' => $dto->proyecto->id,
                'name' => $dto->name,
                'description' => $dto->description,
                'inventory_item_id' => $dto->inventoryItemId,
                'is_active' => true,
            ]);

            foreach ($dto->stages as $index => $stageData) {
                EtapaProceso::create([
                    'proyecto_id' => $dto->proyecto->id,
                    'production_process_id' => $process->id,
                    'name' => $stageData['name'],
                    'description' => $stageData['description'] ?? null,
                    'order' => $index + 1,
                ]);
            }

            return $process;
        });
    }
}
