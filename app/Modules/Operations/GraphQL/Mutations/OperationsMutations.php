<?php

declare(strict_types=1);

namespace App\Modules\Operations\GraphQL\Mutations;

use App\Models\Proyecto;
use App\Modules\Operations\Models\ProductionProcess;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Models\LoteInsumo;
use App\Modules\Operations\Actions\CreateProductionProcessAction;
use App\Modules\Operations\Actions\UpdateProductionProcessAction;
use App\Modules\Operations\Actions\DeleteProductionProcessAction;
use App\Modules\Operations\Actions\CreateLoteAction;
use App\Modules\Operations\Actions\UpdateLoteAction;
use App\Modules\Operations\Actions\UpdateLoteStageAction;
use App\Modules\Operations\Actions\FinishLoteAction;
use App\Modules\Operations\Actions\DiscardLoteAction;
use App\Modules\Operations\Actions\AddLoteInputAction;
use App\Modules\Operations\Actions\ConsumeLoteInputAction;
use App\Modules\Operations\DTOs\CreateProductionProcessDTO;
use App\Modules\Operations\DTOs\UpdateProductionProcessDTO;
use App\Modules\Operations\DTOs\CreateLoteDTO;
use App\Modules\Operations\DTOs\UpdateLoteDTO;
use App\Modules\Operations\DTOs\UpdateLoteStageDTO;
use App\Modules\Operations\DTOs\FinishLoteDTO;
use App\Modules\Operations\DTOs\DiscardLoteDTO;
use App\Modules\Operations\DTOs\AddLoteInputDTO;
use App\Modules\Operations\DTOs\ConsumeLoteInputDTO;

class OperationsMutations
{
    // --- PRODUCTION PROCESSES ---

    /**
     * @param mixed $_
     * @param array<string, mixed> $args
     */
    public function createProductionProcess(mixed $_, array $args): ProductionProcess
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);
        
        $dto = new CreateProductionProcessDTO(
            proyecto: $proyecto,
            name: (string) $args['name'],
            description: isset($args['description']) ? (string) $args['description'] : null,
            inventoryItemId: isset($args['inventory_item_id']) ? $args['inventory_item_id'] : null,
            stages: []
        );

        return app(CreateProductionProcessAction::class)->execute($dto);
    }

    /**
     * @param mixed $_
     * @param array<string, mixed> $args
     */
    public function updateProductionProcess(mixed $_, array $args): ProductionProcess
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);
        
        /** @var ProductionProcess $process */
        $process = ProductionProcess::where('proyecto_id', $proyecto->id)->findOrFail($args['id']);

        $dto = new UpdateProductionProcessDTO(
            proyecto: $proyecto,
            process: $process,
            name: (string) $args['name'],
            description: isset($args['description']) ? (string) $args['description'] : null,
            inventoryItemId: isset($args['inventory_item_id']) ? $args['inventory_item_id'] : null,
            isActive: isset($args['is_active']) ? (bool) $args['is_active'] : true
        );

        return app(UpdateProductionProcessAction::class)->execute($dto);
    }

    /**
     * @param mixed $_
     * @param array<string, mixed> $args
     */
    public function deleteProductionProcess(mixed $_, array $args): bool
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);
        
        /** @var ProductionProcess $process */
        $process = ProductionProcess::where('proyecto_id', $proyecto->id)->findOrFail($args['id']);

        app(DeleteProductionProcessAction::class)->execute($process);
        return true;
    }

    // --- LOTE DE PRODUCCIÓN ---

    /**
     * @param mixed $_
     * @param array<string, mixed> $args
     */
    public function createLote(mixed $_, array $args): LoteProduccion
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);

        $dto = new CreateLoteDTO(
            proyecto: $proyecto,
            productionProcessId: $args['production_process_id'],
            startDate: (string) $args['start_date'],
            assignedTo: isset($args['assigned_to']) ? $args['assigned_to'] : null,
            notes: isset($args['notes']) ? (string) $args['notes'] : null
        );

        return app(CreateLoteAction::class)->execute($dto);
    }

    /**
     * @param mixed $_
     * @param array<string, mixed> $args
     */
    public function updateLote(mixed $_, array $args): LoteProduccion
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);
        
        /** @var LoteProduccion $lote */
        $lote = LoteProduccion::where('proyecto_id', $proyecto->id)->findOrFail($args['id']);

        $dto = new UpdateLoteDTO(
            lote: $lote,
            notes: isset($args['notes']) ? (string) $args['notes'] : null,
            assignedTo: isset($args['assigned_to']) ? $args['assigned_to'] : null
        );

        return app(UpdateLoteAction::class)->execute($dto);
    }

    /**
     * @param mixed $_
     * @param array<string, mixed> $args
     */
    public function updateLoteStage(mixed $_, array $args): LoteProduccion
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);
        
        /** @var LoteProduccion $lote */
        $lote = LoteProduccion::where('proyecto_id', $proyecto->id)->findOrFail($args['id']);

        $dto = new UpdateLoteStageDTO(
            lote: $lote,
            newStageId: $args['stage_id'],
            forceConsumeInputs: isset($args['force_consume_inputs']) ? (bool) $args['force_consume_inputs'] : false
        );

        return app(UpdateLoteStageAction::class)->execute($dto);
    }

    /**
     * @param mixed $_
     * @param array<string, mixed> $args
     */
    public function finishLote(mixed $_, array $args): LoteProduccion
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);
        
        /** @var LoteProduccion $lote */
        $lote = LoteProduccion::where('proyecto_id', $proyecto->id)->findOrFail($args['id']);

        $dto = new FinishLoteDTO(
            lote: $lote,
            finalQuantity: (float) $args['final_quantity'],
            inventoryItemId: isset($args['inventory_item_id']) ? $args['inventory_item_id'] : $lote->inventory_item_id
        );

        return app(FinishLoteAction::class)->execute($dto);
    }

    /**
     * @param mixed $_
     * @param array<string, mixed> $args
     */
    public function discardLote(mixed $_, array $args): LoteProduccion
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);
        
        /** @var LoteProduccion $lote */
        $lote = LoteProduccion::where('proyecto_id', $proyecto->id)->findOrFail($args['id']);

        $dto = new DiscardLoteDTO(
            lote: $lote,
            reason: (string) $args['reason']
        );

        return app(DiscardLoteAction::class)->execute($dto);
    }

    // --- INSUMOS DEL LOTE ---

    /**
     * @param mixed $_
     * @param array<string, mixed> $args
     */
    public function addLoteInput(mixed $_, array $args): LoteProduccion
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);
        
        /** @var LoteProduccion $lote */
        $lote = LoteProduccion::where('proyecto_id', $proyecto->id)->findOrFail($args['id']);

        $dto = new AddLoteInputDTO(
            lote: $lote,
            inventoryItemId: $args['inventory_item_id'],
            quantity: (float) $args['quantity'],
            notes: isset($args['notes']) ? (string) $args['notes'] : null
        );

        app(AddLoteInputAction::class)->execute($dto);

        return $lote->refresh();
    }

    /**
     * @param mixed $_
     * @param array<string, mixed> $args
     */
    public function consumeLoteInput(mixed $_, array $args): LoteProduccion
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);
        
        /** @var LoteInsumo $input */
        $input = LoteInsumo::whereHas('lote', function ($query) use ($proyecto) {
            $query->where('proyecto_id', $proyecto->id);
        })->findOrFail($args['input_id']);

        /** @var LoteProduccion $lote */
        $lote = $input->lote;

        $dto = new ConsumeLoteInputDTO(
            lote: $lote,
            input: $input,
            quantity: (float) $args['quantity']
        );

        app(ConsumeLoteInputAction::class)->execute($dto);

        return $lote->refresh();
    }
}
