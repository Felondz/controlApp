<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Actions\FinishLoteAction;
use App\Modules\Operations\DTOs\FinishLoteDTO;

class FinishLoteTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Finishes a production lote by marking it as completed with a final quantity.
        Only active lotes can be finished.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        if ($request->get('confirm_action') !== true) {
            return Response::text("Error: This is a destructive action. You must explicitly ask the user for confirmation. If they agree, retry this tool call with confirm_action set to true.");
        }

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

        $dto = new FinishLoteDTO(
            lote: $lote,
            finalQuantity: (float) $request->get('final_quantity'),
            inventoryItemId: $request->get('inventory_item_id') ? (int) $request->get('inventory_item_id') : (int) $lote->inventory_item_id
        );

        try {
            $finished = app(FinishLoteAction::class)->execute($dto);
            return Response::text("Success: Lote '{$finished->code}' finished with final quantity {$dto->finalQuantity}.");
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
            'lote_id' => $schema->integer()->description('The ID of the lote to finish.'),
            'final_quantity' => $schema->number()->description('The final quantity produced.'),
            'inventory_item_id' => $schema->integer()->description('Optional: Override the output inventory item ID.'),
            'confirm_action' => $schema->boolean()->description('REQUIRED: Set to true ONLY if the user has explicitly confirmed they want to finish this lote.'),
        ];
        return $properties;
    }
}
