<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\DTOs\PayCreditCardBillDTO;
use App\Modules\Finance\Models\Categoria;
use App\Modules\Finance\Models\Transaccion;
use Exception;

class PayCreditCardBillAction
{
    /**
     * @return array{transaccion: Transaccion, nuevo_saldo_origen: int, nuevo_saldo_tc: int}
     * @throws Exception
     */
    public function execute(PayCreditCardBillDTO $dto): array
    {
        if ($dto->creditCard->tipo !== 'credito') {
            throw new Exception('Esta cuenta no es una tarjeta de crédito.');
        }

        if ($dto->sourceAccount->saldo_actual < $dto->monto) {
            throw new Exception('Saldo insuficiente en la cuenta de origen.');
        }

        $categoryId = $this->getDefaultPaymentCategory($dto->proyecto);

        // Create payment transaction (expense from origin account)
        Transaccion::create([
            'proyecto_id' => $dto->proyecto->id,
            'cuenta_id' => $dto->sourceAccount->id,
            'categoria_id' => $categoryId,
            'user_id' => $dto->userId,
            'monto' => -$dto->monto,
            'descripcion' => "Pago factura TC: {$dto->creditCard->nombre} ({$dto->tipoPago})",
            'fecha' => now(),
            'status' => 'completed',
        ]);

        // Create transaction in Credit Card (positive = payment)
        $transaccionDestino = Transaccion::create([
            'proyecto_id' => $dto->proyecto->id,
            'cuenta_id' => $dto->creditCard->id,
            'categoria_id' => $categoryId,
            'user_id' => $dto->userId,
            'monto' => $dto->monto,
            'descripcion' => "Abono pago factura: {$dto->tipoPago}",
            'fecha' => now(),
            'status' => 'completed',
        ]);

        // Update balances
        $dto->sourceAccount->saldo_actual -= $dto->monto;
        $dto->sourceAccount->save();

        $dto->creditCard->saldo_actual += $dto->monto;
        $dto->creditCard->save();

        return [
            'transaccion' => $transaccionDestino,
            'nuevo_saldo_origen' => $dto->sourceAccount->saldo_actual,
            'nuevo_saldo_tc' => $dto->creditCard->saldo_actual,
        ];
    }

    private function getDefaultPaymentCategory(\App\Models\Proyecto $proyecto): int
    {
        $categoria = $proyecto->categorias()
            ->where('nombre', 'Pagos de Tarjeta')
            ->first();

        if ($categoria) {
            return $categoria->id;
        }

        $categoria = $proyecto->categorias()
            ->where('nombre', 'like', '%factura%')
            ->orWhere('nombre', 'like', '%bill%')
            ->orWhere('nombre', 'like', '%credit card%')
            ->first();

        if ($categoria) {
            return $categoria->id;
        }

        $newCat = Categoria::create([
            'proyecto_id' => $proyecto->id,
            'nombre' => 'Pagos de Tarjeta',
            'tipo' => 'expense',
        ]);

        return $newCat->id;
    }
}
