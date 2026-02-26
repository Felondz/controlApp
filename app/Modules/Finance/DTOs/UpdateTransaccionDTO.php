<?php declare(strict_types=1);

namespace App\Modules\Finance\DTOs;

use App\Modules\Finance\Models\Transaccion;

readonly class UpdateTransaccionDTO
{
    /**
     * @param array<string, mixed> $data
     */
    public function __construct(
        public Transaccion $transaccion,
        public array $data,
    ) {}
}
