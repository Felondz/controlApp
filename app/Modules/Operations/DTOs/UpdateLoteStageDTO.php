<?php

declare(strict_types=1);

namespace App\Modules\Operations\DTOs;

use App\Modules\Operations\Models\LoteProduccion;

readonly class UpdateLoteStageDTO
{
    public function __construct(
        public LoteProduccion $lote,
        public string $newStageId,
        public bool $forceConsumeInputs,
    ) {}
}
