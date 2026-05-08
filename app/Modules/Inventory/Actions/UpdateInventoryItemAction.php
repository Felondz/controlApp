<?php declare(strict_types=1);

namespace App\Modules\Inventory\Actions;

use App\Modules\Inventory\DTOs\UpdateInventoryItemDTO;
use App\Modules\Inventory\Models\InventoryItem;
use App\Modules\Inventory\Models\InventoryTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UpdateInventoryItemAction
{
    /**
     * Executes the update of an inventory item and applying manual stock adjustments.
     */
    public function execute(UpdateInventoryItemDTO $dto): InventoryItem
    {
        return DB::transaction(function () use ($dto) {
            $dataToUpdate = [
                'name' => $dto->name,
                'type' => $dto->type,
                'unit' => $dto->unit,
                'sku' => $dto->sku,
                'min_stock_level' => $dto->minStockLevel,
                'sale_price' => $dto->salePrice,
            ];

            if ($dto->image) {
                // Delete old image
                if ($dto->item->image_path) {
                    Storage::disk('local')->delete($dto->item->image_path);
                }

                $extension = $dto->image->getClientOriginalExtension();
                $filename = Str::random(40) . '.' . $extension;
                $path = $dto->image->storeAs('inventory/' . $dto->proyecto->id, $filename, 'local');
                $dataToUpdate['image_path'] = $path;
            }

            $dto->item->update($dataToUpdate);

            // Handle Manual Stock Adjustment
            if ($dto->stockAdjustment != 0) {
                InventoryTransaction::create([
                    'proyecto_id' => $dto->proyecto->id,
                    'inventory_item_id' => $dto->item->id,
                    'user_id' => $dto->userId,
                    'type' => 'adjustment',
                    'quantity' => $dto->stockAdjustment,
                    // Use current average cost for adjustment valuation
                    'unit_price' => $dto->item->cost_price, 
                    'total_amount' => $dto->stockAdjustment * $dto->item->cost_price,
                    'transaction_date' => now(),
                    'status' => 'confirmed',
                    'notes' => 'Ajuste manual desde edición de item',
                    'reference_type' => null,
                    'reference_id' => null,
                ]);
            }

            return $dto->item->fresh();
        });
    }
}
