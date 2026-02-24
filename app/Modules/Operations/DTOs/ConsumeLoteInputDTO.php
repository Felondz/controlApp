<?php

declare(strict_types=1);

namespace App\Modules\Operations\DTOs;

use App\Modules\Operations\Models\LoteInsumo;
use App\Modules\Operations\Models\LoteProduccion;

readonly class ConsumeLoteInputDTO
{
    public function __construct(
        public LoteProduccion $lote,
        public LoteInsumo $input,
        public float $quantity,
    ) {}
}
