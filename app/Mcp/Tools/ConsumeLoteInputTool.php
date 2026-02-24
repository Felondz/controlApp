<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Models\LoteInsumo;
use App\Modules\Operations\Actions\ConsumeLoteInputAction;
use App\Modules\Operations\DTOs\ConsumeLoteInputDTO;

class ConsumeLoteInputTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Consumes a specific input that was previously added to a lote.
        Marks it as consumed and deducts from inventory stock.
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

        /** @var LoteInsumo|null $input */
        $input = LoteInsumo::find((int) $request->get('input_id'));
        if (!$input) {
            return Response::text("Input not found.");
        }

        $dto = new ConsumeLoteInputDTO(
            lote: $lote,
            input: $input,
            quantity: (float) $request->get('quantity')
        );

        try {
            $consumed = app(ConsumeLoteInputAction::class)->execute($dto);
            return Response::text("Success: Input {$consumed->id} consumed. Quantity: {$consumed->quantity}, Total cost: {$consumed->total_cost}.");
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
            'lote_id' => $schema->integer()->description('The ID of the lote.'),
            'input_id' => $schema->integer()->description('The ID of the lote input (lote_insumo) to consume.'),
            'quantity' => $schema->number()->description('Quantity to consume.'),
        ];
        return $properties;
    }
}
