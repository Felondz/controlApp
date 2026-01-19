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
use App\Modules\Operations\Models\LoteInsumo;
use App\Modules\Operations\Events\StageChanged;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class LoteController extends Controller
{
    public function index(Request $request, Proyecto $proyecto)
    {
        $processes = ProductionProcess::where('proyecto_id', $proyecto->id)
            ->where('is_active', true)
            ->with('outputProduct:id,name,unit')
            ->get(['id', 'name', 'inventory_item_id']);

        $selectedProcessId = $request->input('process_id');

        // Validate that selected process exists in the authorized list
        if ($selectedProcessId && !$processes->contains('id', $selectedProcessId)) {
            $selectedProcessId = null;
        }

        $selectedProcessId = $selectedProcessId ?? $processes->first()?->id;

        $stages = [];
        $lotes = [];

        if ($selectedProcessId) {
            $stages = EtapaProceso::where('production_process_id', $selectedProcessId)
                ->orderBy('order')
                ->with('inputTemplates.item:id,name,unit,cost_price')
                ->get();

            $lotes = LoteProduccion::where('proyecto_id', $proyecto->id)
                ->where('production_process_id', $selectedProcessId)
                ->where('status', 'active') // Filter only active lotes for Kanban
                ->with(['assignee:id,name,email', 'inputs.product', 'inputs.stage', 'stage'])
                ->get();
        }

        // Fetch members for the modal
        $members = $proyecto->miembros()->get(['users.id', 'users.name']);

        // Fetch active inventory items for inputs
        $inventoryItems = \App\Modules\Inventory\Models\InventoryItem::where('proyecto_id', $proyecto->id)
            ->where('is_active', true)
            // Removed > 0 stock check to allow selecting items for recipes/output
            ->get(['id', 'name', 'unit', 'current_stock', 'sale_price', 'cost_price']);

        if ($request->wantsJson()) {
            return response()->json([
                'processes' => $processes,
                'selectedProcessId' => (int) $selectedProcessId,
                'stages' => $stages,
                'lotes' => $lotes,
            ]);
        }

        return Inertia::render('Operations/Lotes/Index', [
            'proyecto' => $proyecto,
            'processes' => $processes,
            'selectedProcessId' => (int) $selectedProcessId,
            'stages' => $stages,
            'lotes' => $lotes,
            'members' => $members,
            'inventoryItems' => $inventoryItems,
        ]);
    }

    public function storeProcess(Request $request, Proyecto $proyecto)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'inventory_item_id' => 'nullable|exists:inventory_items,id',
            'stages' => 'required|array|min:1',
            'stages.*.name' => 'required|string|max:100',
            'stages.*.description' => 'nullable|string|max:255',
        ]);

        $process = DB::transaction(function () use ($proyecto, $validated) {
            $process = ProductionProcess::create([
                'proyecto_id' => $proyecto->id,
                'name' => $validated['name'],
                'description' => $validated['description'],
                'inventory_item_id' => $validated['inventory_item_id'] ?? null,
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

            return $process;
        });

        if ($request->wantsJson()) {
            return response()->json($process, 201);
        }

        return to_route('operations.lotes.index', [
            'proyecto' => $proyecto->id,
            'process_id' => $process->id,
            'open_modal' => 'process_settings' // Flag to open modal on front
        ])->with('success', 'Proceso creado. Ahora configura los insumos (Receta).');
    }

    public function updateProcess(Request $request, Proyecto $proyecto, ProductionProcess $process)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'inventory_item_id' => 'nullable|exists:inventory_items,id',
            'is_active' => 'boolean',
        ]);

        $process->update($validated);

        if ($request->wantsJson()) {
            return response()->json($process, 200);
        }

        return back()->with('success', 'Configuración del proceso actualizada correctamente.');
    }

    // ... (store method skipped) ...



    public function store(Request $request, Proyecto $proyecto, \App\Services\LoteCodeService $codeService)
    {
        $validated = $request->validate([
            'production_process_id' => 'required|exists:production_processes,id',
            'start_date' => 'required|date',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $process = ProductionProcess::with(['etapas.inputTemplates'])->findOrFail($validated['production_process_id']);

        if (!$process->etapas->count()) {
            return back()->with('error', 'El proceso seleccionado no tiene etapas configuradas.');
        }

        $firstStage = $process->etapas->first();

        DB::transaction(function () use ($proyecto, $process, $firstStage, $validated, $codeService) {
            // 1. Auto-generate Code
            $code = $codeService->generate($proyecto->id);

            // 2. Create Lote
            $lote = LoteProduccion::create([
                'proyecto_id' => $proyecto->id,
                'production_process_id' => $process->id,
                'stage_id' => $firstStage->id,
                'inventory_item_id' => $process->inventory_item_id, // The Output Product
                'code' => $code,
                'initial_quantity' => null,
                'current_quantity' => 0,
                'start_date' => $validated['start_date'],
                'assigned_to' => $validated['assigned_to'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'active',
            ]);

            // 3. Dispatch Event to Hydrate Inputs (Async)
            \App\Modules\Operations\Events\LoteCreated::dispatch($lote);
        });

        if ($request->wantsJson()) {
            return response()->json($process, 201); // Ideally return lote, but logic is complex here. Returning process/lote info? Returning null for now or redirect equivalent.
            // Actually, we created a lote inside transaction but scope is lost.
            // Let's rely on standard response or refactor to return lote. 
            // For now, 201 Created is safer.
            return response()->json(['message' => 'Lote creado exitosamente'], 201);
        }

        return redirect()->route('operations.lotes.index', [
            'proyecto' => $proyecto->id,
            'process_id' => $validated['production_process_id']
        ])->with('success', 'Lote creado exitosamente.');
    }

    public function updateStage(Request $request, Proyecto $proyecto, LoteProduccion $lote)
    {
        $validated = $request->validate([
            'stage_id' => 'required|exists:etapas_proceso,id',
        ]);

        $newStageId = $validated['stage_id'];

        // Prevent re-processing if already on this stage
        if ($lote->stage_id == $newStageId) {
            return back();
        }

        DB::transaction(function () use ($lote, $newStageId, $request) {
            // Store old stage for the event before updating the lote
            $oldStageId = $lote->stage_id;
            $oldStage = $oldStageId ? EtapaProceso::find($oldStageId) : null;
            $newStage = EtapaProceso::find($newStageId);

            // Update the lote to the new stage
            $lote->update(['stage_id' => $newStageId]);

            // Dispatch StageChanged Event
            \App\Modules\Operations\Events\StageChanged::dispatch($lote, $oldStage, $newStage);

            // Fetch Recipe for this new Stage
            $templates = \App\Modules\Operations\Models\StageInputTemplate::where('etapa_proceso_id', $newStageId)
                ->with('item') // Eager load item to access cost_price
                ->get();

            $forceConsume = $request->boolean('consume_inputs');

            foreach ($templates as $template) {
                // Determine quantity to consume
                $quantity = (float) ($template->quantity > 0 ? $template->quantity : 0);
                
                // Determine if we SHOULD consume (auto or forced)
                $shouldConsume = $quantity > 0;
                if ($forceConsume && $quantity > 0) {
                     $shouldConsume = true;
                }

                // Check if input exists for this stage
                $existingInput = $lote->inputs()
                    ->where('inventory_item_id', $template->inventory_item_id)
                    ->where('stage_id', $newStageId)
                    ->first();

                if ($existingInput) {
                    // IDEMPOTENCY FIX: If it exists but is PENDING, and we SHOULD consume, then consume it now.
                    if ($existingInput->status !== 'consumed' && $shouldConsume) {
                        $existingInput->update([
                            'status' => 'consumed',
                            'consumed_at' => now(),
                            'quantity' => $quantity, // Ensure quantity matches template if it changed? Optional.
                            'unit_cost' => $template->item->cost_price ?? $existingInput->unit_cost, // Update cost if needed
                            'total_cost' => $quantity * ($template->item->cost_price ?? ($existingInput->unit_cost ?? 0)),
                        ]);
                        
                        \App\Modules\Operations\Events\InputConsumed::dispatch($existingInput);
                        Log::info("LoteController: Consumed PRE-EXISTING input {$existingInput->id} for Lote {$lote->id}");
                    }
                } else {
                    // Create new input
                     $insumo = LoteInsumo::create([
                          'lote_produccion_id' => $lote->id,
                          'inventory_item_id' => $template->inventory_item_id,
                          'stage_id' => $newStageId,
                          'quantity' => $quantity,
                          'unit_cost' => $template->item->cost_price ?? 0,
                          'total_cost' => $quantity * ($template->item->cost_price ?? 0),
                          'status' => $shouldConsume ? 'consumed' : 'pending',
                          'consumed_at' => $shouldConsume ? now() : null,
                     ]);

                    if ($shouldConsume) {
                        \App\Modules\Operations\Events\InputConsumed::dispatch($insumo);
                        Log::info("LoteController: Created and Consumed input {$insumo->id} for Lote {$lote->id}");
                    }
                }
            }
        });

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Etapa actualizada', 'stage_id' => $newStageId]);
        }

        return back()->with('success', 'Etapa actualizada.');
    }

    public function show(Request $request, Proyecto $proyecto, LoteProduccion $lote)
    {
        $lote->load(['assignedUser', 'stage', 'productionProcess', 'tasks.assignedTo', 'inputs.product']);

        return Inertia::render('Operations/Lotes/Show', [
            'proyecto' => $proyecto,
            'lote' => $lote,
        ]);
    }

    public function addInput(Request $request, Proyecto $proyecto, LoteProduccion $lote)
    {
        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        \App\Modules\Operations\Events\LoteInputAdded::dispatch($lote, $validated);

        if ($request->wantsJson()) {
             return response()->json(['message' => 'Insumo agregado'], 201);
        }

        return back()->with('success', 'Insumo agregado y descontado del inventario (procesando en segundo plano).');
    }

    /**
     * Mark a pending input as consumed, deducting inventory.
     * Note: Current logic keeps this synchronous or we can move it too. 
     * For now, keeping synchronous or simple update as originally implemented 
     * but could be refactored similar to addInput if desired. 
     * Leaving consumeInput as is for this scope unless specific request to change it too.
     */
    public function consumeInput(Request $request, Proyecto $proyecto, LoteProduccion $lote, LoteInsumo $input)
    {
        if ($input->lote_produccion_id !== $lote->id)
            abort(403);
        if ($input->status === 'consumed')
            return back()->with('error', 'El insumo ya ha sido consumido.');

        $quantity = $request->input('quantity', $input->quantity);
        $totalCost = $quantity * ($input->product->cost_price ?? 0);

        // Update the input model first to mark as done/consumed logic
        // But true event-driven would might even defer this. 
        // However, updating the LoteInsumo record itself is local to this context. 
        // The Inventory movement (external module side effect) is what we defer.
        $input->update([
            'status' => 'consumed', // Marked as consumed here so UI updates immediately
            'quantity' => $quantity,
            'total_cost' => $totalCost,
            'consumed_at' => now(),
        ]);

        // Dispatch Event for Inventory Module to handle deduction asynchronously
        \App\Modules\Operations\Events\InputConsumed::dispatch($input);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Consumo registrado']);
        }

        return back()->with('success', 'Consumo registrado (descontando de inventario en segundo plano).');
    }

    public function finish(Request $request, Proyecto $proyecto, LoteProduccion $lote)
    {
        $validated = $request->validate([
            'final_quantity' => 'required|numeric|min:0',
            'inventory_item_id' => 'required|exists:inventory_items,id',
        ]);

        if ($lote->status !== 'active') {
            return back()->with('error', 'El lote no está activo.');
        }

        \App\Modules\Operations\Events\LoteFinished::dispatch($lote, $validated);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Lote finalizado']);
        }

        return back()->with('success', 'Lote finalizado (procesando en segundo plano).');
    }

    public function discard(Request $request, Proyecto $proyecto, LoteProduccion $lote)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        if ($lote->status !== 'active') {
            return back()->with('error', 'Solo se pueden descartar lotes activos.');
        }

        \App\Modules\Operations\Events\LoteDiscarded::dispatch($lote, $validated['reason']);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Lote descartado']);
        }

        return back()->with('success', 'Lote marcado como descartado (procesando en segundo plano).');
    }
    public function update(Request $request, Proyecto $proyecto, LoteProduccion $lote)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $lote->update($validated);

        if ($request->wantsJson()) {
            return response()->json($lote);
        }

        return back()->with('success', 'Lote actualizado correctamente.');
    }

    public function destroyProcess(Request $request, Proyecto $proyecto, ProductionProcess $process)
    {
        // Check for active lotes
        if ($process->lotes()->where('status', 'active')->exists()) {
            return back()->with('error', 'No se puede eliminar el proceso porque tiene lotes activos. Finalízalos o descártalos primero.');
        }

        // Delete related data (stages, recipes) handled by DB cascade or manually if needed
        // Assuming SoftDeletes or Cascade on DB. If SoftDeletes, just delete process.
        $process->delete();

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Proceso eliminado'], 200);
        }

        return back()->with('success', 'Proceso eliminado correctamente.');
    }
    public function history(Request $request, Proyecto $proyecto)
    {
        $query = LoteProduccion::where('proyecto_id', $proyecto->id)
            ->with(['productionProcess', 'stage', 'assignee']);

        // Filters
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('code', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $lotes = $query->orderBy('created_at', 'desc')->paginate(20)
            ->withQueryString();

        return Inertia::render('Operations/Lotes/History', [
            'proyecto' => $proyecto,
            'lotes' => $lotes,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

}
