<?php

declare(strict_types=1);

namespace App\Modules\Operations\Actions;

use App\Modules\Operations\DTOs\UpdateLoteStageDTO;
use App\Modules\Operations\Models\EtapaProceso;
use App\Modules\Operations\Models\LoteInsumo;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Models\StageInputTemplate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateLoteStageAction
{
    public function execute(UpdateLoteStageDTO $dto): LoteProduccion
    {
        $lote = $dto->lote;
        $newStageId = $dto->newStageId;

        // Prevent re-processing if already on this stage
        if ($lote->stage_id == $newStageId) {
            return $lote;
        }

        return DB::transaction(function () use ($dto, $lote, $newStageId) {
            $oldStageId = $lote->stage_id;
            $oldStage = $oldStageId ? EtapaProceso::find($oldStageId) : null;
            $newStage = EtapaProceso::find($newStageId);

            $lote->update(['stage_id' => $newStageId]);

            \App\Modules\Operations\Events\StageChanged::dispatch($lote, $oldStage, $newStage);

            $templates = StageInputTemplate::where('etapa_proceso_id', $newStageId)
                ->with('item')
                ->get();

            $forceConsume = $dto->forceConsumeInputs;

            foreach ($templates as $template) {
                $quantity = (float) ($template->quantity > 0 ? $template->quantity : 0);
                
                $shouldConsume = $quantity > 0;
                if ($forceConsume && $quantity > 0) {
                     $shouldConsume = true;
                }

                $existingInput = $lote->inputs()
                    ->where('inventory_item_id', $template->inventory_item_id)
                    ->where('stage_id', $newStageId)
                    ->first();

                if ($existingInput) {
                    if ($existingInput->status !== 'consumed' && $shouldConsume) {
                        $existingInput->update([
                            'status' => 'consumed',
                            'consumed_at' => now(),
                            'quantity' => $quantity,
                            'unit_cost' => $template->item->cost_price ?? $existingInput->unit_cost,
                            'total_cost' => $quantity * ($template->item->cost_price ?? ($existingInput->unit_cost ?? 0)),
                        ]);
                        
                        \App\Modules\Operations\Events\InputConsumed::dispatch($existingInput);
                        Log::info("UpdateLoteStageAction: Consumed PRE-EXISTING input {$existingInput->id} for Lote {$lote->id}");
                    }
                } else {
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
                        Log::info("UpdateLoteStageAction: Created and Consumed input {$insumo->id} for Lote {$lote->id}");
                    }
                }
            }

            return $lote;
        });
    }
}
