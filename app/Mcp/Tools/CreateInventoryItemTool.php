<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Inventory\Actions\CreateInventoryItemAction;
use App\Modules\Inventory\DTOs\CreateInventoryItemDTO;

class CreateInventoryItemTool extends Tool
{
    /**
     * The tool's description.
     */
    protected string $description = <<<'MARKDOWN'
        Creates a new inventory item in the specified project. 
        Requires type to be one of: raw_material, finished_good, service, asset.
    MARKDOWN;

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $proyecto_id = (int) $request->get('proyecto_id');
        /** @var \App\Models\Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyecto_id);

        if (!$proyecto) {
            return Response::text("Project with ID {$proyecto_id} not found.");
        }

        $dto = new CreateInventoryItemDTO(
            proyecto: $proyecto,
            name: (string) $request->get('name'),
            type: (string) $request->get('type'),
            unit: (string) $request->get('unit'),
            userId: 1, // System or default user, ideally grabbed from auth or a passed param
            sku: (string) $request->get('sku'),
            minStockLevel: (float) ($request->get('min_stock_level') ?? 0),
            initialQuantity: (float) ($request->get('initial_quantity') ?? 0),
            initialCost: (float) ($request->get('initial_cost') ?? 0),
            salePrice: (float) ($request->get('sale_price') ?? 0),
            image: null
        );

        $action = app(CreateInventoryItemAction::class);
        $item = $action->execute($dto);

        return Response::text("Success: Inventory item '{$item->name}' created with ID {$item->id} and stock {$item->current_stock}.");
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'name' => $schema->string()->description('Name of the item.'),
            'type' => $schema->string()->description('raw_material, finished_good, service, or asset'),
            'unit' => $schema->string()->description('Unit of measurement (e.g. kg, liter, piece)'),
            'sku' => $schema->string()->description('Optional SKU code'),
            'min_stock_level' => $schema->number()->description('Minimum stock to trigger warnings'),
            'initial_quantity' => $schema->number()->description('Initial quantity in stock (adds an adjustment)'),
            'initial_cost' => $schema->number()->description('Initial unit cost of the item'),
            'sale_price' => $schema->number()->description('Sale price of the item'),
        ];
        return $properties;
    }
}
