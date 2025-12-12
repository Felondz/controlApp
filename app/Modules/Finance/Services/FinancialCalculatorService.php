<?php

namespace App\Modules\Finance\Services;

class FinancialCalculatorService
{
    /**
     * Calculate loan amortization schedule and summary.
     *
     * @param float $amount
     * @param float $rate
     * @param int $term
     * @param string $termType 'months' or 'years'
     * @param string $rateType 'EA', 'NAMV', 'PM'
     * @param float $insurance Monthly insurance cost
     * @return array
     */
    public function calculateLoan(
        float $amount,
        float $rate,
        int $term,
        string $termType = 'months',
        string $rateType = 'EA',
        float $insurance = 0
    ): array {
        $monthlyRate = 0;

        // Rate Conversion Logic
        if ($rateType === 'PM') {
            $monthlyRate = $rate / 100;
        } elseif ($rateType === 'NAMV') {
            $monthlyRate = ($rate / 100) / 12;
        } else {
            // Default: EA (Efectiva Anual) -> Monthly
            // Formula: (1 + EA)^(1/12) - 1
            $monthlyRate = pow(1 + ($rate / 100), 1 / 12) - 1;
        }

        $totalMonths = $termType === 'years' ? $term * 12 : $term;

        // Amortization Formula
        // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
        if ($monthlyRate > 0) {
            $x = pow(1 + $monthlyRate, $totalMonths);
            $monthlyPrincipalAndInterest = ($amount * $x * $monthlyRate) / ($x - 1);
        } else {
            $monthlyPrincipalAndInterest = $amount / $totalMonths;
        }

        $totalMonthlyPayment = $monthlyPrincipalAndInterest + $insurance;

        $balance = $amount;
        $schedule = [];
        $totalInterest = 0;

        for ($i = 1; $i <= $totalMonths; $i++) {
            $interestPayment = $balance * $monthlyRate;
            $principalPayment = $monthlyPrincipalAndInterest - $interestPayment;

            // Adjust last payment to avoid negative balance or tiny remainders
            if ($i == $totalMonths) {
                $principalPayment = $balance;
                $monthlyPrincipalAndInterest = $principalPayment + $interestPayment;
                $totalMonthlyPayment = $monthlyPrincipalAndInterest + $insurance;
            }

            $balance -= $principalPayment;
            if ($balance < 0)
                $balance = 0;

            $totalInterest += $interestPayment;

            $schedule[] = [
                'month' => $i,
                'payment' => $totalMonthlyPayment,
                'principal' => $principalPayment,
                'interest' => $interestPayment,
                'balance' => $balance
            ];
        }

        return [
            'monthlyPayment' => $schedule[0]['payment'], // First payment (usually constant)
            'principalAmount' => $amount,
            'totalInterest' => $totalInterest,
            'totalPayment' => ($amount + $totalInterest + ($insurance * $totalMonths)),
            'schedule' => $schedule,
            'inputs' => [
                'amount' => $amount,
                'rate' => $rate,
                'term' => $term,
                'termType' => $termType,
                'rateType' => $rateType,
                'insurance' => $insurance
            ]
        ];
    }
}
