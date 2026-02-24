<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\DTOs\UpdateCuentaEstadoDTO;
use App\Modules\Finance\Models\Cuenta;

class UpdateCuentaEstadoAction
{
    public function execute(UpdateCuentaEstadoDTO $dto): Cuenta
    {
        $dto->cuenta->update(['estado' => $dto->estado]);

        return $dto->cuenta;
    }
}
