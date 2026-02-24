<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\DTOs\UpdateTransaccionDTO;
use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Transaccion;

class UpdateTransaccionAction
{
    public function execute(UpdateTransaccionDTO $dto): Transaccion
    {
        $transaccion = $dto->transaccion;

        // Revert old balance
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $oldCuenta = Cuenta::find($transaccion->cuenta_id);
            if ($oldCuenta) {
                $oldCuenta->saldo_actual -= (int) $transaccion->monto;
                $oldCuenta->save();
            }
        }

        $transaccion->update($dto->data);

        // Apply new balance
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $newCuenta = Cuenta::find($transaccion->cuenta_id);
            if ($newCuenta) {
                $newCuenta->saldo_actual += (int) $transaccion->monto;
                $newCuenta->save();
            }
        }

        return $transaccion;
    }
}
