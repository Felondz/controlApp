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
    public function index(Request $request, Proyecto $proyecto): \Inertia\Response|\Illuminate\Http\JsonResponse
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

    public function storeProcess(Request $request, Proyecto $proyecto, \App\Modules\Operations\Actions\CreateProductionProcessAction $action): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'inventory_item_id' => 'nullable|exists:inventory_items,id',
            'stages' => 'required|array|min:1',
            'stages.*.name' => 'required|string|max:100',
            'stages.*.description' => 'nullable|string|max:255',
        ]);

        $dto = new \App\Modules\Operations\DTOs\CreateProductionProcessDTO(
            proyecto: $proyecto,
            name: $validated['name'],
            description: $validated['description'] ?? null,
            inventoryItemId: isset($validated['inventory_item_id']) ? (int) $validated['inventory_item_id'] : null,
            stages: $validated['stages']
        );

        $process = $action->execute($dto);

        if ($request->wantsJson()) {
            return response()->json($process, 201);
        }

        return to_route('operations.lotes.index', [
            'proyecto' => $proyecto->id,
            'process_id' => $process->id,
            'open_modal' => 'process_settings' // Flag to open modal on front
        ])->with('success', 'Proceso creado. Ahora configura los insumos (Receta).');
    }

    public function updateProcess(Request $request, Proyecto $proyecto, ProductionProcess $process, \App\Modules\Operations\Actions\UpdateProductionProcessAction $action): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'inventory_item_id' => 'nullable|exists:inventory_items,id',
            'is_active' => 'boolean',
        ]);

        $dto = new \App\Modules\Operations\DTOs\UpdateProductionProcessDTO(
            proyecto: $proyecto,
            process: $process,
            name: $validated['name'],
            description: $validated['description'] ?? null,
            inventoryItemId: isset($validated['inventory_item_id']) ? (int) $validated['inventory_item_id'] : null,
            isActive: (bool) ($validated['is_active'] ?? $process->is_active)
        );

        $process = $action->execute($dto);

        if ($request->wantsJson()) {
            return response()->json($process, 200);
        }

        return back()->with('success', 'Configuración del proceso actualizada correctamente.');
    }

    // ... (store method skipped) ...



    public function store(Request $request, Proyecto $proyecto, \App\Modules\Operations\Actions\CreateLoteAction $action): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'production_process_id' => 'required|exists:production_processes,id',
            'start_date' => 'required|date',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $dto = new \App\Modules\Operations\DTOs\CreateLoteDTO(
            proyecto: $proyecto,
            productionProcessId: (int) $validated['production_process_id'],
            startDate: $validated['start_date'],
            assignedTo: isset($validated['assigned_to']) ? (int) $validated['assigned_to'] : null,
            notes: $validated['notes'] ?? null
        );

        try {
            $action->execute($dto);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Lote creado exitosamente'], 201);
        }

        return redirect()->route('operations.lotes.index', [
            'proyecto' => $proyecto->id,
            'process_id' => $validated['production_process_id']
        ])->with('success', 'Lote creado exitosamente.');
    }

    public function updateStage(Request $request, Proyecto $proyecto, LoteProduccion $lote, \App\Modules\Operations\Actions\UpdateLoteStageAction $action): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'stage_id' => 'required|exists:etapas_proceso,id',
        ]);

        $dto = new \App\Modules\Operations\DTOs\UpdateLoteStageDTO(
            lote: $lote,
            newStageId: (int) $validated['stage_id'],
            forceConsumeInputs: $request->boolean('consume_inputs')
        );

        $action->execute($dto);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Etapa actualizada', 'stage_id' => $dto->newStageId]);
        }

        return back()->with('success', 'Etapa actualizada.');
    }

    public function show(Request $request, Proyecto $proyecto, LoteProduccion $lote): \Inertia\Response|\Illuminate\Http\JsonResponse
    {
        $lote->load(['assignedUser', 'stage', 'productionProcess', 'tasks.assignedTo', 'inputs.product']);

        return Inertia::render('Operations/Lotes/Show', [
            'proyecto' => $proyecto,
            'lote' => $lote,
        ]);
    }

    public function addInput(Request $request, Proyecto $proyecto, LoteProduccion $lote, \App\Modules\Operations\Actions\AddLoteInputAction $action): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        $dto = new \App\Modules\Operations\DTOs\AddLoteInputDTO(
            lote: $lote,
            inventoryItemId: (int) $validated['inventory_item_id'],
            quantity: (float) $validated['quantity'],
            notes: $validated['notes'] ?? null
        );

        $action->execute($dto);

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
    public function consumeInput(Request $request, Proyecto $proyecto, LoteProduccion $lote, LoteInsumo $input, \App\Modules\Operations\Actions\ConsumeLoteInputAction $action): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $quantity = $input->quantity; // Avoid mutation errors before DTO if needed
        $requestedQuantity = (float) $request->input('quantity', $quantity);

        $dto = new \App\Modules\Operations\DTOs\ConsumeLoteInputDTO(
            lote: $lote,
            input: $input,
            quantity: $requestedQuantity
        );

        try {
            $action->execute($dto);
        } catch (\Exception $e) {
            $status = $e->getMessage() === 'Acceso denegado: El insumo no pertenece a este lote.' ? 403 : 400;
            if ($status === 403) {
                 abort(403);
            }
            return back()->with('error', $e->getMessage());
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Consumo registrado']);
        }

        return back()->with('success', 'Consumo registrado (descontando de inventario en segundo plano).');
    }

    public function finish(Request $request, Proyecto $proyecto, LoteProduccion $lote, \App\Modules\Operations\Actions\FinishLoteAction $action): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'final_quantity' => 'required|numeric|min:0',
            'inventory_item_id' => 'required|exists:inventory_items,id',
        ]);

        $dto = new \App\Modules\Operations\DTOs\FinishLoteDTO(
            lote: $lote,
            finalQuantity: (float) $validated['final_quantity'],
            inventoryItemId: (int) $validated['inventory_item_id']
        );

        try {
            $action->execute($dto);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Lote finalizado']);
        }

        return back()->with('success', 'Lote finalizado (procesando en segundo plano).');
    }

    public function discard(Request $request, Proyecto $proyecto, LoteProduccion $lote, \App\Modules\Operations\Actions\DiscardLoteAction $action): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $dto = new \App\Modules\Operations\DTOs\DiscardLoteDTO(
            lote: $lote,
            reason: $validated['reason']
        );

        try {
            $action->execute($dto);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Lote descartado']);
        }

        return back()->with('success', 'Lote marcado como descartado (procesando en segundo plano).');
    }
    public function update(Request $request, Proyecto $proyecto, LoteProduccion $lote, \App\Modules\Operations\Actions\UpdateLoteAction $action): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $dto = new \App\Modules\Operations\DTOs\UpdateLoteDTO(
            lote: $lote,
            notes: $validated['notes'] ?? null,
            assignedTo: isset($validated['assigned_to']) ? (int) $validated['assigned_to'] : null,
        );

        $action->execute($dto);

        if ($request->wantsJson()) {
            return response()->json($lote);
        }

        return back()->with('success', 'Lote actualizado correctamente.');
    }

    public function destroyProcess(Request $request, Proyecto $proyecto, ProductionProcess $process, \App\Modules\Operations\Actions\DeleteProductionProcessAction $action): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        try {
            $action->execute($process);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Proceso eliminado'], 200);
        }

        return back()->with('success', 'Proceso eliminado correctamente.');
    }
    public function history(Request $request, Proyecto $proyecto): \Inertia\Response|\Illuminate\Http\JsonResponse
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
