<?php declare(strict_types=1);

namespace App\Modules\Inventory\GraphQL\Mutations;

use App\Models\Proyecto;
use App\Modules\Inventory\Actions\CreateInventoryItemAction;
use App\Modules\Inventory\Actions\DeleteInventoryItemAction;
use App\Modules\Inventory\Actions\UpdateInventoryItemAction;
use App\Modules\Inventory\DTOs\CreateInventoryItemDTO;
use App\Modules\Inventory\DTOs\UpdateInventoryItemDTO;
use App\Modules\Inventory\Models\InventoryItem;

class InventoryMutations
{
    public function create($_, array $args): InventoryItem
    {
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);

        $dto = new CreateInventoryItemDTO(
            proyecto: $proyecto,
            name: $args['name'],
            type: $args['type'],
            unit: $args['unit'],
            userId: auth()->id(),
            sku: $args['sku'] ?? null,
            minStockLevel: (float) ($args['min_stock_level'] ?? 0),
            initialQuantity: (float) ($args['initial_quantity'] ?? 0),
            initialCost: (float) ($args['initial_cost'] ?? 0),
            salePrice: (float) ($args['sale_price'] ?? 0),
            image: null // File uploads via GraphQL require specific setup (lighthouse-multipart), omitted for basic implementation
        );

        $action = app(CreateInventoryItemAction::class);
        return $action->execute($dto);
    }

    public function update($_, array $args): InventoryItem
    {
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);
        $item = InventoryItem::where('id', $args['id'])->where('proyecto_id', $proyecto->id)->firstOrFail();

        $dto = new UpdateInventoryItemDTO(
            proyecto: $proyecto,
            item: $item,
            name: $args['name'],
            type: $args['type'],
            unit: $args['unit'],
            userId: auth()->id(),
            sku: $args['sku'] ?? null,
            minStockLevel: (float) ($args['min_stock_level'] ?? 0),
            salePrice: (float) ($args['sale_price'] ?? 0),
            stockAdjustment: (float) ($args['stock_adjustment'] ?? 0),
            image: null
        );

        $action = app(UpdateInventoryItemAction::class);
        return $action->execute($dto);
    }

    public function delete($_, array $args): bool
    {
        // Require proyecto_id for scope validation even on delete
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);
        $item = InventoryItem::where('id', $args['id'])->where('proyecto_id', $proyecto->id)->firstOrFail();

        $action = app(DeleteInventoryItemAction::class);
        return $action->execute($item);
    }
}
