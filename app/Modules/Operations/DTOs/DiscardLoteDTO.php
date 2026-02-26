<?php

declare(strict_types=1);

namespace App\Modules\Operations\DTOs;

use App\Modules\Operations\Models\LoteProduccion;

readonly class DiscardLoteDTO
{
    public function __construct(
        public LoteProduccion $lote,
        public string $reason,
    ) {}
}
