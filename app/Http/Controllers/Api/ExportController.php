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

        $callback = function () use ($proyecto, $type, $validated, $request) {
            \App\Jobs\ExportProjectData::dispatch(
                $proyecto,
                $request->user(),
                'csv',
                $validated
            );
        };

        return response()->json([
            'message' => 'El proceso de exportación CSV ha comenzado. Se te notificará cuando esté listo.',
            'status' => 'processing'
        ]);
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

        \App\Jobs\ExportProjectData::dispatch(
            $proyecto,
            $request->user(),
            'pdf',
            $validated
        );

        return response()->json([
            'message' => 'El reporte PDF se está generando en segundo plano. Podrás descargarlo pronto.',
            'status' => 'processing'
        ]);
    }
}
