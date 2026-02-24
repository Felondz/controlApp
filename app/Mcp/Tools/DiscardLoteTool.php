<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Actions\DiscardLoteAction;
use App\Modules\Operations\DTOs\DiscardLoteDTO;

class DiscardLoteTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Discards a production lote with a reason. Only active lotes can be discarded.
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

        $dto = new DiscardLoteDTO(
            lote: $lote,
            reason: (string) $request->get('reason')
        );

        try {
            $discarded = app(DiscardLoteAction::class)->execute($dto);
            return Response::text("Success: Lote '{$discarded->code}' discarded. Reason: {$dto->reason}");
        } catch (\Exception $e) {
            return Response::text("Error: {$e->getMessage()}");
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'lote_id' => $schema->integer()->description('The ID of the lote to discard.'),
            'reason' => $schema->string()->description('Reason for discarding the lote.'),
        ];
        return $properties;
    }
}
