<?php

declare(strict_types=1);

namespace App\Modules\Operations\DTOs;

use App\Models\Proyecto;

readonly class CreateProductionProcessDTO
{
    /**
     * @param array<int, array{name: string, description?: string|null}> $stages
     */
    public function __construct(
        public Proyecto $proyecto,
        public string $name,
        public ?string $description,
        public ?int $inventoryItemId,
        public array $stages,
    ) {}
}
