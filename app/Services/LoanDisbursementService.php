<?php

namespace App\Services;

use App\Models\Cuenta;
use App\Models\Transaccion;
use App\Models\Categoria;
use Carbon\Carbon;

class LoanDisbursementService
{
    /**
     * Disburse loan funds to a destination account.
     * Creates an income transaction in the destination account.
     */
    public function disburse(Cuenta $loan, ?Cuenta $destination, int $amount): ?Transaccion
    {
        if ($loan->tipo !== 'prestamo' && $loan->tipo !== 'credito_personal') {
            return null;
        }

        if ($amount <= 0) {
            return null;
        }

        // Update loan account with disbursement info
        $loan->monto_desembolsado = $amount;
        $loan->cuenta_destino_id = $destination?->id;
        $loan->save();

        // If no destination, it's cash - just record the info
        if (!$destination) {
            // For cash, we may want to create an informative transaction
            // but not affect any account balance
            return null;
        }

        // Find income category for the project
        $categoria = Categoria::where('proyecto_id', $destination->propietario_id)
            ->where('tipo', 'ingreso')
            ->first();

        // Create income transaction in destination account
        $transaccion = Transaccion::create([
            'proyecto_id' => $destination->propietario_id,
            'cuenta_id' => $destination->id,
            'categoria_id' => $categoria?->id,
            'user_id' => null, // System generated
            'monto' => $amount, // Positive = income
            'descripcion' => 'Desembolso de crédito: ' . $loan->nombre,
            'fecha' => Carbon::now()->toDateString(),
            'status' => 'completed',
            'notas' => 'Generado automáticamente al crear cuenta de préstamo',
        ]);

        // Update destination account balance
        $destination->saldo_actual += $amount;
        $destination->save();

        return $transaccion;
    }
}
