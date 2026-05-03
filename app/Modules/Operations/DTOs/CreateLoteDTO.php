<?php

declare(strict_types=1);

namespace App\Modules\Operations\DTOs;

use App\Models\Proyecto;

readonly class CreateLoteDTO
{
    public function __construct(
        public Proyecto $proyecto,
        public string $productionProcessId,
        public string $startDate,
        public ?int $assignedTo,
        public ?string $notes,
    ) {}
}
