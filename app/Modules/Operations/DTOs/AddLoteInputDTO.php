<?php

declare(strict_types=1);

namespace App\Modules\Operations\DTOs;

use App\Modules\Operations\Models\LoteProduccion;

readonly class AddLoteInputDTO
{
    public function __construct(
        public LoteProduccion $lote,
        public int $inventoryItemId,
        public float $quantity,
        public ?string $notes,
    ) {}
}
