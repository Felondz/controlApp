<?php

namespace App\Modules\Operations\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Proyecto;

use App\Modules\Operations\Models\ProductionProcess;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Models\EtapaProceso;
use App\Modules\Operations\Events\StageChanged;
use Illuminate\Support\Facades\DB;

class LoteController extends Controller
{
    public function index(Request $request, Proyecto $proyecto)
    {
        $processes = ProductionProcess::where('proyecto_id', $proyecto->id)
            ->where('is_active', true)
            ->get(['id', 'name']);

        $selectedProcessId = $request->input('process_id') ?? $processes->first()?->id;

        $stages = [];
        $lotes = [];

        if ($selectedProcessId) {
            $stages = EtapaProceso::where('production_process_id', $selectedProcessId)
                ->orderBy('order')
                ->get(['id', 'name', 'order']);

            $lotes = LoteProduccion::where('proyecto_id', $proyecto->id)
                ->where('production_process_id', $selectedProcessId)
                ->with(['assignedUser:id,name,email'])
                ->get();
        }

        // Fetch members for the modal
        $members = $proyecto->miembros()->get(['users.id', 'users.name']);

        return Inertia::render('Operations/Lotes/Index', [
            'proyecto' => $proyecto,
            'processes' => $processes,
            'selectedProcessId' => (int)$selectedProcessId,
            'stages' => $stages,
            'lotes' => $lotes,
            'members' => $members,
        ]);
    }

    public function storeProcess(Request $request, Proyecto $proyecto)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'stages' => 'required|array|min:1',
            'stages.*.name' => 'required|string|max:100',
            'stages.*.description' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($proyecto, $validated) {
            $process = ProductionProcess::create([
                'proyecto_id' => $proyecto->id,
                'name' => $validated['name'],
                'description' => $validated['description'],
                'is_active' => true,
            ]);

            // Create configured stages
            foreach ($validated['stages'] as $index => $stageData) {
                EtapaProceso::create([
                    'proyecto_id' => $proyecto->id,
                    'production_process_id' => $process->id,
                    'name' => $stageData['name'],
                    'description' => $stageData['description'] ?? null,
                    'order' => $index + 1, // Order based on array index
                ]);
            }
        });

        return back()->with('success', 'Proceso productivo creado con ' . count($validated['stages']) . ' etapas.');
    }

    public function store(Request $request, Proyecto $proyecto)
    {
        $validated = $request->validate([
            'production_process_id' => 'required|exists:production_processes,id',
            'code' => 'required|string|max:50|unique:lotes_produccion,code,NULL,id,proyecto_id,' . $proyecto->id,
            'initial_quantity' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'assigned_user_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $process = ProductionProcess::findOrFail($validated['production_process_id']);
        $firstStage = $process->etapas()->orderBy('order')->firstOrFail();

        $lote = LoteProduccion::create([
            'proyecto_id' => $proyecto->id,
            'production_process_id' => $validated['production_process_id'],
            'stage_id' => $firstStage->id, // Start at the first stage
            'code' => $validated['code'],
            'initial_quantity' => $validated['initial_quantity'],
            'current_quantity' => $validated['initial_quantity'], // Starts full
            'start_date' => $validated['start_date'],
            'assigned_user_id' => $validated['assigned_user_id'],
            'notes' => $validated['notes'],
        ]);

        return redirect()->route('operations.lotes.index', $proyecto->id)
            ->with('success', 'Lote creado exitosamente.');
    }

    public function updateStage(Request $request, Proyecto $proyecto, LoteProduccion $lote)
    {
        $request->validate([
            'stage_id' => 'required|exists:etapas_proceso,id',
        ]);

        $newStage = EtapaProceso::findOrFail($request->stage_id);
        $oldStage = $lote->stage; // Assuming relationship is 'stage'

        if ($lote->stage_id === $newStage->id) {
            return back();
        }

        DB::transaction(function () use ($lote, $newStage, $oldStage) {
            $lote->stage_id = $newStage->id;
            $lote->save();

            event(new StageChanged($lote, $oldStage, $newStage));
        });

        return back()->with('success', 'Lote movido a ' . $newStage->name);
    }
    public function show(Request $request, Proyecto $proyecto, LoteProduccion $lote)
    {
        $lote->load(['assignedUser', 'stage', 'productionProcess', 'tasks.assignedTo']); // Eager load relationships

        return Inertia::render('Operations/Lotes/Show', [
            'proyecto' => $proyecto,
            'lote' => $lote,
        ]);
    }
}
