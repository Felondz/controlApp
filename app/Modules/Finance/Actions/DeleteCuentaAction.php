<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\Models\Cuenta;
use Exception;

class DeleteCuentaAction
{
    /**
     * @throws Exception
     */
    public function execute(Cuenta $cuenta): void
    {
        if ($cuenta->saldo_actual != 0) {
            throw new Exception('No se puede eliminar una cuenta con saldo. Ajusta el saldo a cero primero.');
        }

        if ($cuenta->transacciones()->exists()) {
            $cuenta->update(['estado' => 'inactiva']);
            return;
        }

        $cuenta->delete();
    }
}
