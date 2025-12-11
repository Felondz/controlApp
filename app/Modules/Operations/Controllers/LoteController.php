<?php

namespace App\Modules\Operations\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Models\ProductionProcess;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoteController extends Controller
{
    public function index(Request $request, Proyecto $proyecto)
    {
        $query = LoteProduccion::where('proyecto_id', $proyecto->id)
            ->with(['process', 'currentStage']);

        // Filter by Process
        if ($request->has('process_id')) {
            $query->where('production_process_id', $request->process_id);
        }

        // Filter by Stage
        if ($request->has('stage_id')) {
            $query->where('current_stage_id', $request->stage_id);
        }

        $lotes = $query->latest()->paginate(20);

        $processes = ProductionProcess::where('proyecto_id', $proyecto->id)->with('stages')->get();

        return Inertia::render('Operations/Lotes/Index', [
            'proyecto' => $proyecto,
            'lotes' => $lotes,
            'processes' => $processes,
            'filters' => $request->only(['process_id', 'stage_id']),
        ]);
    }

    public function create(Proyecto $proyecto)
    {
        $processes = ProductionProcess::where('proyecto_id', $proyecto->id)
            ->where('is_active', true)
            ->with('stages')
            ->get();

        return Inertia::render('Operations/Lotes/Create', [
            'proyecto' => $proyecto,
            'processes' => $processes,
        ]);
    }

    public function store(Request $request, Proyecto $proyecto)
    {
        // Validations
        $validated = $request->validate([
            'production_process_id' => 'required|exists:production_processes,id',
            'code' => 'required|string|max:50|unique:lotes_produccion,code,NULL,id,proyecto_id,' . $proyecto->id,
            'initial_quantity' => 'required|numeric|min:0',
            'start_date' => 'required|date',
        ]);

        // Auto-assign first stage of the process
        $process = ProductionProcess::with('stages')->find($request->production_process_id);
        $firstStage = $process->stages()->orderBy('order')->first();

        if (!$firstStage) {
            return redirect()->back()->with('error', 'El proceso seleccionado no tiene etapas definidas.');
        }

        $lote = LoteProduccion::create([
            'proyecto_id' => $proyecto->id,
            'production_process_id' => $validated['production_process_id'],
            'current_stage_id' => $firstStage->id,
            'code' => $validated['code'],
            'initial_quantity' => $validated['initial_quantity'],
            'current_quantity' => $validated['initial_quantity'],
            'start_date' => $validated['start_date'],
            'status' => 'active',
            'assigned_to' => auth()->id(),
        ]);

        return redirect()->route('operations.lotes.index', $proyecto->id)->with('success', 'Lote de producción iniciado.');
    }
}
