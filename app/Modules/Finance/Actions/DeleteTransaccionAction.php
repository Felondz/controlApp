<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Transaccion;

class DeleteTransaccionAction
{
    public function execute(Transaccion $transaccion): void
    {
        // Revert balance before deleting
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $cuenta = Cuenta::find($transaccion->cuenta_id);
            if ($cuenta) {
                $cuenta->saldo_actual -= (int) $transaccion->monto;
                $cuenta->save();
            }
        }

        $transaccion->delete();
    }
}
