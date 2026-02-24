<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Actions\UpdateLoteStageAction;
use App\Modules\Operations\DTOs\UpdateLoteStageDTO;

class UpdateLoteStageTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Advances a lote to a different stage in its production process.
        Optionally force-consumes all recipe inputs for the new stage.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        /** @var LoteProduccion|null $lote */
        $lote = LoteProduccion::where('proyecto_id', $proyecto->id)->find((int) $request->get('lote_id'));
        if (!$lote) {
            return Response::text("Lote not found.");
        }

        $dto = new UpdateLoteStageDTO(
            lote: $lote,
            newStageId: (int) $request->get('stage_id'),
            forceConsumeInputs: (bool) ($request->get('force_consume_inputs') ?? false)
        );

        $updated = app(UpdateLoteStageAction::class)->execute($dto);
        $stageName = $updated->stage->name ?? 'Unknown';

        return Response::text("Success: Lote '{$updated->code}' moved to stage '{$stageName}'.");
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'lote_id' => $schema->integer()->description('The ID of the lote to advance.'),
            'stage_id' => $schema->integer()->description('The ID of the target stage.'),
            'force_consume_inputs' => $schema->boolean()->description('If true, auto-consume all recipe inputs for the new stage.'),
        ];
        return $properties;
    }
}
