<?php

declare(strict_types=1);

namespace App\Modules\Operations\Actions;

use App\Modules\Operations\DTOs\CreateLoteDTO;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Models\ProductionProcess;
use App\Services\LoteCodeService;
use Exception;
use Illuminate\Support\Facades\DB;

class CreateLoteAction
{
    public function __construct(private LoteCodeService $codeService)
    {
    }

    /**
     * @throws Exception If the process has no stages configured
     */
    public function execute(CreateLoteDTO $dto): LoteProduccion
    {
        $process = ProductionProcess::with(['etapas.inputTemplates'])->findOrFail($dto->productionProcessId);

        /** @var \App\Modules\Operations\Models\EtapaProceso|null $firstStage */
        $firstStage = $process->etapas->first();

        if (!$firstStage) {
            throw new Exception('El proceso seleccionado no tiene etapas configuradas.');
        }

        return DB::transaction(function () use ($dto, $process, $firstStage) {
            $code = $this->codeService->generate($dto->proyecto->id);

            $lote = LoteProduccion::create([
                'proyecto_id' => $dto->proyecto->id,
                'production_process_id' => $process->id,
                'stage_id' => $firstStage->id,
                'inventory_item_id' => $process->inventory_item_id,
                'code' => $code,
                'initial_quantity' => null,
                'current_quantity' => 0,
                'start_date' => $dto->startDate,
                'assigned_to' => $dto->assignedTo,
                'notes' => $dto->notes,
                'status' => 'active',
            ]);

            \App\Modules\Operations\Events\LoteCreated::dispatch($lote);

            return $lote;
        });
    }
}
