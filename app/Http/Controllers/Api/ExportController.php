<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportController extends Controller
{
    /**
     * Export project transactions to CSV.
     */
    public function csv(Request $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para exportar datos de este proyecto.');

        $validated = $request->validate([
            'type' => 'nullable|in:transactions,accounts,categories,all',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
        ]);

        $type = $validated['type'] ?? 'transactions';

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=export-{$type}.csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($proyecto, $type, $validated) {
            $file = fopen('php://output', 'w');

            if ($type === 'transactions') {
                fputcsv($file, ['Fecha', 'Descripcion', 'Monto', 'Categoria', 'Cuenta', 'Tipo']);

                $query = $proyecto->transacciones()->with(['categoria', 'cuenta']);

                if (!empty($validated['from'])) {
                    $query->where('fecha', '>=', $validated['from']);
                }
                if (!empty($validated['to'])) {
                    $query->where('fecha', '<=', $validated['to']);
                }

                foreach ($query->get() as $t) {
                    fputcsv($file, [
                        $t->fecha,
                        $t->descripcion,
                        $t->monto / 100, // Convert from cents
                        $t->categoria->nombre ?? 'Sin categoría',
                        $t->cuenta->nombre ?? 'Sin cuenta',
                        $t->monto > 0 ? 'Ingreso' : 'Gasto',
                    ]);
                }
            } elseif ($type === 'accounts') {
                fputcsv($file, ['Nombre', 'Tipo', 'Saldo', 'Moneda', 'Estado']);

                foreach ($proyecto->cuentas as $cuenta) {
                    fputcsv($file, [
                        $cuenta->nombre,
                        $cuenta->tipo,
                        $cuenta->saldo,
                        $cuenta->moneda ?? $proyecto->moneda_default,
                        $cuenta->estado,
                    ]);
                }
            } elseif ($type === 'categories') {
                fputcsv($file, ['Nombre', 'Tipo', 'Icono', 'Color']);

                foreach ($proyecto->categorias as $cat) {
                    fputcsv($file, [
                        $cat->nombre,
                        $cat->tipo,
                        $cat->icono ?? '',
                        $cat->color ?? '',
                    ]);
                }
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export project data to PDF.
     */
    public function pdf(Request $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para exportar datos de este proyecto.');

        $validated = $request->validate([
            'type' => 'nullable|in:transactions,summary,all',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
        ]);

        $type = $validated['type'] ?? 'summary';

        $query = $proyecto->transacciones()->with(['categoria', 'cuenta']);

        if (!empty($validated['from'])) {
            $query->where('fecha', '>=', $validated['from']);
        }
        if (!empty($validated['to'])) {
            $query->where('fecha', '<=', $validated['to']);
        }

        $transactions = $query->get();
        $accounts = $proyecto->cuentas;
        $categories = $proyecto->categorias;

        // Calculate summary
        $totalIncome = $transactions->where('monto', '>', 0)->sum('monto') / 100;
        $totalExpenses = abs($transactions->where('monto', '<', 0)->sum('monto')) / 100;
        $balance = $totalIncome - $totalExpenses;

        $pdf = Pdf::loadView('exports.project-pdf', [
            'proyecto' => $proyecto,
            'transactions' => $transactions,
            'accounts' => $accounts,
            'categories' => $categories,
            'type' => $type,
            'totalIncome' => $totalIncome,
            'totalExpenses' => $totalExpenses,
            'balance' => $balance,
            'from' => $validated['from'] ?? null,
            'to' => $validated['to'] ?? null,
        ]);

        return $pdf->download("proyecto-{$proyecto->id}-{$type}.pdf");
    }
}
