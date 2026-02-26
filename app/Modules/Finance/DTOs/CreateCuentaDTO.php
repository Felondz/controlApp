<?php declare(strict_types=1);

namespace App\Modules\Finance\DTOs;

use App\Models\Proyecto;

readonly class CreateCuentaDTO
{
    /**
     * @param array<string, mixed> $data All validated account fields
     */
    public function __construct(
        public Proyecto $proyecto,
        public int $userId,
        public array $data,
    ) {}
}
