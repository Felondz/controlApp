<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Transaccion;
use Exception;

class PayBillDirectlyAction
{
    /**
     * @throws Exception
     */
    public function execute(Transaccion $transaccion): Transaccion
    {
        if (!$transaccion->cuenta_predeterminada_id) {
            throw new Exception(__('finance.error_no_default_account'));
        }

        if ($transaccion->status !== 'pending') {
            throw new Exception(__('finance.error_already_paid'));
        }

        $transaccion->update([
            'cuenta_id' => $transaccion->cuenta_predeterminada_id,
            'status' => 'completed',
            'fecha_pago' => now(),
            'descripcion' => "Pago de factura: {$transaccion->descripcion}",
        ]);

        $cuenta = Cuenta::find($transaccion->cuenta_id);
        if ($cuenta) {
            $cuenta->saldo_actual += (int) $transaccion->monto;
            $cuenta->save();
        }

        return $transaccion;
    }
}
