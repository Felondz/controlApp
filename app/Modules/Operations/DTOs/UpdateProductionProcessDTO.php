<?php

declare(strict_types=1);

namespace App\Modules\Operations\DTOs;

use App\Models\Proyecto;
use App\Modules\Operations\Models\ProductionProcess;

readonly class UpdateProductionProcessDTO
{
    public function __construct(
        public Proyecto $proyecto,
        public ProductionProcess $process,
        public string $name,
        public ?string $description,
        public ?string $inventoryItemId,
        public bool $isActive,
    ) {}
}
