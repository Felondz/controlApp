<?php declare(strict_types=1);

namespace App\Modules\Finance\DTOs;

use App\Modules\Finance\Models\Cuenta;

readonly class UpdateCuentaEstadoDTO
{
    public function __construct(
        public Cuenta $cuenta,
        public string $estado,
    ) {}
}
