<?php

declare(strict_types=1);

namespace App\Modules\Operations\DTOs;

use App\Modules\Operations\Models\LoteProduccion;

readonly class UpdateLoteDTO
{
    public function __construct(
        public LoteProduccion $lote,
        public ?string $notes,
        public ?int $assignedTo,
    ) {}
}
