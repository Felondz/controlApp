<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\DTOs\CreateCuentaDTO;
use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Services\LoanDisbursementService;

class CreateCuentaAction
{
    public function execute(CreateCuentaDTO $dto): Cuenta
    {
        $data = $dto->data;
        $data['saldo_actual'] = $data['saldo_inicial'];
        $data['estado'] = $data['estado'] ?? 'activa';

        if ($dto->proyecto->esPersonal()) {
            /** @var \App\Models\User $user */
            $user = \App\Models\User::findOrFail($dto->userId);
            /** @var Cuenta $cuenta */
            $cuenta = $user->cuentas()->create($data);
            $dto->proyecto->cuentasAsociadas()->attach($cuenta->id);
        } else {
            /** @var Cuenta $cuenta */
            $cuenta = $dto->proyecto->cuentas()->create($data);
        }

        // Handle Loan Disbursement
        if ($cuenta->tipo === 'prestamo' && !empty($data['monto_desembolsado']) && $data['monto_desembolsado'] > 0) {
            $service = new \App\Modules\Finance\Services\LoanDisbursementService();

            $destination = null;
            if (!empty($data['cuenta_destino_id'])) {
                /** @var \App\Modules\Finance\Models\Cuenta|null $destination */
                $destination = Cuenta::find($data['cuenta_destino_id']);
            }

            $service->disburse($cuenta, $destination, (int) $data['monto_desembolsado']);
            $cuenta->refresh();
        }

        return $cuenta;
    }
}
