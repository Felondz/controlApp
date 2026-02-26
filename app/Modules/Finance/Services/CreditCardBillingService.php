<?php

namespace App\Modules\Finance\Services;

use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Transaccion;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class CreditCardBillingService
{
    /**
     * Convert EA (Effective Annual) rate to monthly rate.
     * Formula: Monthly Rate = (1 + EA)^(1/12) - 1
     */
    public function getMonthlyRate(float $tasaEA): float
    {
        return pow(1 + ($tasaEA / 100), 1 / 12) - 1;
    }

    /**
     * Get the billing cycle string for a given date and cutoff day.
     * Format: "YYYY-MM"
     */
    public function getBillingCycle(Carbon $date, int $diaCorte): string
    {
        // If we're past the cutoff day, it belongs to next month's bill
        if ($date->day > $diaCorte) {
            return $date->copy()->addMonth()->format('Y-m');
        }
        return $date->format('Y-m');
    }

    /**
     * Get the upcoming credit card bill for an account.
     * Returns details including minimum and total payment.
     *
     * @return array<string, mixed>
     */
    public function getUpcomingBill(Cuenta $cuenta): array
    {
        if ($cuenta->tipo !== 'credito') {
            return [
                'cuenta_id' => $cuenta->id,
                'es_tarjeta' => false,
                'total' => 0,
            ];
        }

        $now = Carbon::now();
        $diaCorte = $cuenta->dia_corte ?? 1;
        $diaPago = $cuenta->dia_pago ?? ($diaCorte + 20 > 28 ? $diaCorte + 20 - 30 : $diaCorte + 20);
        $tasaEA = $cuenta->tasa_interes_anual ?? 0;
        $monthlyRate = $this->getMonthlyRate((float) $tasaEA);

        // Calculate relevant billing cycle
        // Determine which cycle to show: the one just closed (if within payment window) or the current open one

        // Reference dates
        $cutoffThisMonth = $now->copy()->day($diaCorte);
        $paymentThisMonth = $this->calculatePaymentDate($diaPago, $cutoffThisMonth);

        $cutoffLastMonth = $now->copy()->subMonth()->day($diaCorte);
        $paymentLastMonth = $this->calculatePaymentDate($diaPago, $cutoffLastMonth);

        // Logic to select target cycle
        $targetCycle = '';
        $targetCutoff = null;
        $targetPayment = null;

        if ($now->gt($cutoffThisMonth)) {
            // We are past this month's cutoff (e.g. today 7th, cutoff 5th)
            if ($now->lte($paymentThisMonth)) {
                // Within payment window of the just-closed cycle -> Show This Month's Bill
                $targetCycle = $cutoffThisMonth->format('Y-m');
                $targetCutoff = $cutoffThisMonth;
                $targetPayment = $paymentThisMonth;
            } else {
                // Payment date passed -> Show Next Month's Accumulation
                $cutoffNextMonth = $now->copy()->addMonth()->day($diaCorte);
                $targetCycle = $cutoffNextMonth->format('Y-m');
                $targetCutoff = $cutoffNextMonth;
                $targetPayment = $this->calculatePaymentDate($diaPago, $cutoffNextMonth);
            }
        } else {
            // We are before this month's cutoff (e.g. today 4th, cutoff 5th)
            if ($now->lte($paymentLastMonth)) {
                // Still within payment window of LAST month's bill -> Show Last Month's Bill
                $targetCycle = $cutoffLastMonth->format('Y-m');
                $targetCutoff = $cutoffLastMonth;
                $targetPayment = $paymentLastMonth;
            } else {
                // Last month paid/expired -> Show accumulation for This Month
                $targetCycle = $cutoffThisMonth->format('Y-m');
                $targetCutoff = $cutoffThisMonth;
                $targetPayment = $paymentThisMonth;
            }
        }

        // Get transactions for the target cycle
        $transactions = $cuenta->transacciones()
            ->where('status', 'completed')
            ->where('monto', '<', 0) // Only expenses
            ->where('ciclo_facturacion', $targetCycle)
            ->orWhere(function ($query) use ($cuenta, $targetCycle) {
                // Include transactions without cycle if they fall in range? 
                // Better to just rely on cycle for now to avoid duplicates, 
                // or assume null cycle belongs to current if date matches.
                // For safety, let's stick to strict cycle match + manual fix command if needed
                // But we keep the original OR logic slightly modified for safety
                $query->where('cuenta_id', $cuenta->id)
                    ->where('monto', '<', 0)
                    ->whereNull('ciclo_facturacion')
                    // Logic to check if date falls in cycle would be complex here, simplifying:
                    ->whereMonth('fecha', Carbon::parse($targetCycle . '-01')->month)
                    ->whereYear('fecha', Carbon::parse($targetCycle . '-01')->year);
            })
            ->get();

        // Calculate amounts
        $oneInstallmentTotal = 0;
        $deferredDetails = [];

        foreach ($transactions as $trans) {
            $cuotas = $trans->cuotas ?? 1;
            $absAmount = abs($trans->monto);

            if ($cuotas == 1) {
                // 1 installment = full amount, no interest
                $oneInstallmentTotal += $absAmount;
            } else {
                // Multiple installments = portion + interest on remaining
                $cuotaActual = $trans->cuota_actual ?? 1;
                $montoPorCuota = $absAmount / $cuotas;
                $deudaPendiente = $absAmount - ($montoPorCuota * ($cuotaActual - 1));
                $interesMensual = $deudaPendiente * $monthlyRate;

                $deferredDetails[] = [
                    'transaccion_id' => $trans->id,
                    'descripcion' => $trans->descripcion,
                    'monto_original' => $absAmount,
                    'cuotas' => $cuotas,
                    'cuota_actual' => $cuotaActual,
                    'monto_cuota' => $montoPorCuota,
                    'deuda_pendiente' => $deudaPendiente,
                    'interes' => $interesMensual,
                    'pago_cuota' => $montoPorCuota + $interesMensual,
                ];
            }
        }

        // Calculate totals
        $deferredInstallmentsTotal = array_sum(array_column($deferredDetails, 'monto_cuota'));
        $deferredInterestTotal = array_sum(array_column($deferredDetails, 'interes'));

        $pagoMinimo = $oneInstallmentTotal + $deferredInstallmentsTotal + $deferredInterestTotal;
        $deudaTotal = $oneInstallmentTotal + array_sum(array_column($deferredDetails, 'deuda_pendiente'));

        // Deduct payments/credits made in the billing period (from start of cycle to payment date)
        // Start date: Cutoff date of PREVIOUS month + 1 day
        // End date: Target Payment Date (to include payments made during grace period)
        $cycleStartDate = $targetCutoff->copy()->subMonth()->addDay();
        // If target payment is in past, use now? No, stick to payment window.

        $credits = $cuenta->transacciones()
            ->where('status', 'completed')
            ->where('monto', '>', 0) // Positive = Payment/Credit
            ->whereBetween('fecha', [$cycleStartDate, $targetPayment])
            ->sum('monto');

        $pagoMinimo = max(0, $pagoMinimo - $credits);
        $deudaTotal = max(0, $deudaTotal - $credits);

        return [
            'cuenta_id' => $cuenta->id,
            'cuenta_nombre' => $cuenta->nombre,
            'es_tarjeta' => true,
            'ciclo' => $targetCycle,
            'fecha_corte' => $targetCutoff->toDateString(),
            'fecha_pago' => $targetPayment->toDateString(),
            'dias_para_pago' => $now->diffInDays($targetPayment, false),
            'compras_1_cuota' => $oneInstallmentTotal,
            'cuotas_diferidas' => $deferredInstallmentsTotal,
            'intereses' => $deferredInterestTotal,
            'pago_minimo' => round($pagoMinimo),
            'pago_total' => round($deudaTotal),
            'detalle_diferidos' => $deferredDetails,
            'tasa_ea' => $tasaEA,
            'tasa_mensual' => round($monthlyRate * 100, 4),
        ];
    }

    /**
     * Get the next cutoff date based on day of month.
     * @codeCoverageIgnore Reserved for future use
     */
    public function getNextCutoffDate(int $diaCorte): Carbon
    {
        $now = Carbon::now();
        $cutoff = $now->copy()->day($diaCorte);

        if ($now->day >= $diaCorte) {
            $cutoff->addMonth();
        }

        return $cutoff;
    }

    /**
     * Calculate payment date based on payment day and cutoff reference date.
     */
    public function calculatePaymentDate(int $diaPago, Carbon $cutoffDate): Carbon
    {
        $payment = $cutoffDate->copy()->day($diaPago);

        // Payment date is after cutoff, usually in the next month if payment day < cutoff day
        if ($diaPago < $cutoffDate->day) {
            $payment->addMonth();
        }

        return $payment;
    }
}
