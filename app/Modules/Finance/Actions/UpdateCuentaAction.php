<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\DTOs\UpdateCuentaDTO;
use App\Modules\Finance\Models\Cuenta;

class UpdateCuentaAction
{
    public function execute(UpdateCuentaDTO $dto): Cuenta
    {
        $data = $dto->data;

        // If updating saldo_inicial and no transactions exist, sync saldo_actual
        if (isset($data['saldo_inicial']) && !$dto->cuenta->transacciones()->exists()) {
            $data['saldo_actual'] = $data['saldo_inicial'];
        }

        $dto->cuenta->update($data);

        return $dto->cuenta;
    }
}
