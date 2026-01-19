<?php

namespace App\Modules\Operations\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Proyecto;
use App\Modules\Operations\Models\EtapaProceso;
use App\Modules\Operations\Models\StageInputTemplate;
use Illuminate\Support\Facades\DB;

class StageTemplateController extends Controller
{
    public function store(Request $request, Proyecto $proyecto, EtapaProceso $stage)
    {
        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        StageInputTemplate::create([
            'etapa_proceso_id' => $stage->id,
            'inventory_item_id' => $validated['inventory_item_id'],
            'quantity' => $validated['quantity'],
            'notes' => $validated['notes'],
        ]);

        return to_route('operations.lotes.index', [
            'proyecto' => $proyecto->id,
            'process_id' => $stage->production_process_id,
            'open_modal' => 'process_settings'
        ])->with('success', 'Insumo agregado a la receta.');
    }

    public function destroy(Request $request, Proyecto $proyecto, StageInputTemplate $template)
    {
        $processId = $template->etapaProceso->production_process_id;
        $template->delete();
        
        return to_route('operations.lotes.index', [
            'proyecto' => $proyecto->id,
            'process_id' => $processId,
            'open_modal' => 'process_settings'
        ])->with('success', 'Insumo eliminado de la receta.');
    }
}
