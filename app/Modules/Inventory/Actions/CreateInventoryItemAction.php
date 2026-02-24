<?php declare(strict_types=1);

namespace App\Modules\Inventory\Actions;

use App\Modules\Inventory\DTOs\CreateInventoryItemDTO;
use App\Modules\Inventory\Models\InventoryItem;
use App\Modules\Inventory\Models\InventoryTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CreateInventoryItemAction
{
    /**
     * Executes the creation of an inventory item and its initial stock transaction (if any).
     */
    public function execute(CreateInventoryItemDTO $dto): InventoryItem
    {
        return DB::transaction(function () use ($dto) {
            $imagePath = null;
            if ($dto->image) {
                $extension = $dto->image->getClientOriginalExtension();
                $filename = Str::random(40) . '.' . $extension;
                $imagePath = $dto->image->storeAs('inventory/' . $dto->proyecto->id, $filename, 'public');
            }

            $item = InventoryItem::create([
                'proyecto_id' => $dto->proyecto->id,
                'name' => $dto->name,
                'sku' => $dto->sku,
                'type' => $dto->type,
                'unit' => $dto->unit,
                'min_stock_level' => $dto->minStockLevel,
                'sale_price' => $dto->salePrice,
                'cost_price' => $dto->initialCost,
                'image_path' => $imagePath,
                'is_active' => true,
            ]);

            // Handle Initial Stock Transaction
            if ($dto->initialQuantity > 0) {
                InventoryTransaction::create([
                    'proyecto_id' => $dto->proyecto->id,
                    'inventory_item_id' => $item->id,
                    'user_id' => $dto->userId,
                    'type' => 'adjustment',
                    'quantity' => $dto->initialQuantity,
                    'unit_price' => $dto->initialCost,
                    'total_amount' => $dto->initialQuantity * $dto->initialCost,
                    'transaction_date' => now(),
                    'status' => 'confirmed',
                    'notes' => 'Stock Inicial al crear Item',
                    'reference_type' => null,
                    'reference_id' => null,
                ]);
            }

            return $item;
        });
    }
}
