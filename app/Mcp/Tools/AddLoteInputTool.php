<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Actions\AddLoteInputAction;
use App\Modules\Operations\DTOs\AddLoteInputDTO;

class AddLoteInputTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Adds a new input (raw material) to a production lote.
        This dispatches an event that handles stock reservation.
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

        $dto = new AddLoteInputDTO(
            lote: $lote,
            inventoryItemId: (int) $request->get('inventory_item_id'),
            quantity: (float) $request->get('quantity'),
            notes: $request->get('notes') ? (string) $request->get('notes') : null
        );

        app(AddLoteInputAction::class)->execute($dto);

        return Response::text("Success: Input added to lote '{$lote->code}'. Item ID: {$dto->inventoryItemId}, Qty: {$dto->quantity}.");
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'lote_id' => $schema->integer()->description('The ID of the lote to add input to.'),
            'inventory_item_id' => $schema->integer()->description('The ID of the inventory item (raw material) to add.'),
            'quantity' => $schema->number()->description('Quantity of the input to add.'),
            'notes' => $schema->string()->description('Optional notes for this input.'),
        ];
        return $properties;
    }
}
