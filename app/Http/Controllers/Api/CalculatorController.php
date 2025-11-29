<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FinancialCalculatorService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CalculatorController extends Controller
{
    protected $calculatorService;

    public function __construct(FinancialCalculatorService $calculatorService)
    {
        $this->calculatorService = $calculatorService;
    }

    /**
     * Calculate loan amortization schedule.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'rate' => 'required|numeric|min:0',
            'term' => 'required|numeric|min:1',
            'termType' => 'required|in:months,years',
            'rateType' => 'required|in:EA,NAMV,PM',
            'insurance' => 'nullable|numeric|min:0',
        ]);

        $results = $this->calculatorService->calculateLoan(
            $validated['amount'],
            $validated['rate'],
            $validated['term'],
            $validated['termType'],
            $validated['rateType'],
            $validated['insurance'] ?? 0
        );

        return response()->json($results);
    }
}
