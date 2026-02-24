<?php

namespace App\Modules\Finance\Services;

use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Transaccion;
use App\Modules\Finance\Models\Categoria;
use Carbon\Carbon;

class InvestmentInterestService
{
    /**
     * Calculate and create monthly interest income for investment accounts.
     */
    public function calculateMonthlyInterest(Cuenta $cuenta): ?Transaccion
    {
        if (!in_array($cuenta->tipo, ['inversion', 'ahorro'])) {
            return null;
        }

        $tasaAnual = $cuenta->tasa_interes ?? $cuenta->tasa_interes_anual ?? 0;
        if ($tasaAnual <= 0) {
            return null;
        }

        // Convert annual rate to monthly: (1 + EA)^(1/12) - 1
        $monthlyRate = pow(1 + ($tasaAnual / 100), 1 / 12) - 1;

        // Calculate interest on current balance
        $balance = abs($cuenta->saldo_actual); // In cents
        $interestAmount = round($balance * $monthlyRate);

        if ($interestAmount <= 0) {
            return null;
        }

        // Find or create "Investment Interest" category
        $categoria = Categoria::where('proyecto_id', $cuenta->propietario_id)
            ->where('nombre', 'like', '%Intereses%')
            ->where('tipo', 'ingreso')
            ->first();

        // If no category found, try to find any income category
        if (!$categoria) {
            $categoria = Categoria::where('proyecto_id', $cuenta->propietario_id)
                ->where('tipo', 'ingreso')
                ->first();
        }

        // Create the interest transaction
        $transaccion = Transaccion::create([
            'proyecto_id' => $cuenta->propietario_id,
            'cuenta_id' => $cuenta->id,
            'categoria_id' => $categoria?->id,
            'user_id' => null, // System generated
            'monto' => $interestAmount, // Positive = income
            'descripcion' => 'Intereses de ' . $cuenta->nombre,
            'fecha' => Carbon::now()->toDateString(),
            'status' => 'completed',
        ]);

        // Update account balance
        $cuenta->saldo_actual = (int) ($cuenta->saldo_actual + $interestAmount);
        $cuenta->save();

        return $transaccion;
    }

    /**
     * Get projected investment interest for upcoming payments widget.
     *
     * @return array<string, mixed>
     */
    public function getProjectedInterest(Cuenta $cuenta): array
    {
        if (!in_array($cuenta->tipo, ['inversion', 'ahorro'])) {
            return [];
        }

        $tasaAnual = $cuenta->tasa_interes ?? $cuenta->tasa_interes_anual ?? 0;
        if ($tasaAnual <= 0) {
            return [];
        }

        $monthlyRate = pow(1 + ($tasaAnual / 100), 1 / 12) - 1;
        $balance = abs($cuenta->saldo_actual);
        $interestAmount = round($balance * $monthlyRate);

        // Interest date (usually end of month or specific date)
        $interestDate = $cuenta->fecha_interes
            ? Carbon::parse($cuenta->fecha_interes)
            : Carbon::now()->endOfMonth();

        return [
            'cuenta_id' => $cuenta->id,
            'cuenta_nombre' => $cuenta->nombre,
            'tipo' => 'ingreso',
            'monto' => $interestAmount,
            'fecha' => $interestDate->toDateString(),
            'descripcion' => 'Intereses de Inversión',
            'tasa_anual' => $tasaAnual,
            'tasa_mensual' => round($monthlyRate * 100, 4),
        ];
    }
}
