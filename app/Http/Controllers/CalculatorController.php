<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FinancialCalculatorService;
use Illuminate\Support\Facades\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class CalculatorController extends Controller
{
    protected $calculatorService;

    public function __construct(FinancialCalculatorService $calculatorService)
    {
        $this->calculatorService = $calculatorService;
    }

    public function calculate(Request $request)
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

    public function exportCsv(Request $request)
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

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=amortizacion.csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($results) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Mes', 'Cuota', 'Capital', 'Interes', 'Saldo']);

            foreach ($results['schedule'] as $row) {
                fputcsv($file, [
                    $row['month'],
                    round($row['payment'], 2),
                    round($row['principal'], 2),
                    round($row['interest'], 2),
                    round($row['balance'], 2)
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportPdf(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'rate' => 'required|numeric|min:0',
            'term' => 'required|numeric|min:1',
            'termType' => 'required|in:months,years',
            'rateType' => 'required|in:EA,NAMV,PM',
            'insurance' => 'nullable|numeric|min:0',
            'chartImage' => 'nullable|string',
        ]);

        $results = $this->calculatorService->calculateLoan(
            $validated['amount'],
            $validated['rate'],
            $validated['term'],
            $validated['termType'],
            $validated['rateType'],
            $validated['insurance'] ?? 0
        );

        $chartImage = $validated['chartImage'] ?? null;

        $pdf = Pdf::loadView('exports.calculator-pdf', [
            'results' => $results,
            'chartImage' => $chartImage
        ]);

        return $pdf->download('proyeccion-credito.pdf');
    }
}
