<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Inventory\Models\InventoryItem;
use App\Modules\Inventory\Actions\UpdateInventoryItemAction;
use App\Modules\Inventory\DTOs\UpdateInventoryItemDTO;

class UpdateInventoryItemTool extends Tool
{
    /**
     * The tool's description.
     */
    protected string $description = <<<'MARKDOWN'
        Updates an existing inventory item or adjusts its stock.
    MARKDOWN;

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $proyecto_id = (int) $request->get('proyecto_id');
        $item_id = (int) $request->get('item_id');

        /** @var \App\Models\Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyecto_id);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyecto_id} not found.");
        }

        $item = InventoryItem::where('id', $item_id)->where('proyecto_id', $proyecto_id)->first();
        if (!$item) {
            return Response::text("Inventory item with ID {$item_id} not found in this project.");
        }

        $dto = new UpdateInventoryItemDTO(
            proyecto: $proyecto,
            item: $item,
            name: (string) ($request->get('name') ?? $item->name),
            type: (string) ($request->get('type') ?? $item->type),
            unit: (string) ($request->get('unit') ?? $item->unit),
            userId: 1, // System user
            sku: (string) ($item->sku ?? ''), // Object cloned string fallback
            minStockLevel: (float) ($request->get('min_stock_level') ?? $item->min_stock_level),
            salePrice: (float) ($request->get('sale_price') ?? $item->sale_price),
            stockAdjustment: (float) ($request->get('stock_adjustment') ?? 0),
            image: null
        );

        $action = app(UpdateInventoryItemAction::class);
        $updatedItem = $action->execute($dto);

        return Response::text("Success: Inventory item updated. New stock is {$updatedItem->current_stock}.");
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
            'item_id' => $schema->integer()->description('The ID of the inventory item to update.'),
            'name' => $schema->string()->description('Name of the item'),
            'type' => $schema->string()->description('raw_material, finished_good, service, or asset'),
            'unit' => $schema->string()->description('Unit of measurement'),
            'min_stock_level' => $schema->number()->description('Minimum stock to trigger warnings'),
            'sale_price' => $schema->number()->description('Sale price of the item'),
            'stock_adjustment' => $schema->number()->description('Amount to ADJUS T existing stock (can be negative or positive)'),
        ];
        return $properties;
    }
}
