<?php declare(strict_types=1);

namespace App\Modules\Inventory\DTOs;

use App\Models\Proyecto;
use App\Modules\Inventory\Models\InventoryItem;
use Illuminate\Http\UploadedFile;

/**
 * Data Transfer Object for updating an Inventory Item.
 */
class UpdateInventoryItemDTO
{
    public function __construct(
        public readonly Proyecto $proyecto,
        public readonly InventoryItem $item,
        public readonly string $name,
        public readonly string $type,
        public readonly string $unit,
        public readonly ?int $userId = null,
        public readonly ?string $sku = null,
        public readonly float $minStockLevel = 0.0,
        public readonly float $salePrice = 0.0,
        public readonly float $stockAdjustment = 0.0,
        public readonly ?UploadedFile $image = null,
    ) {}
}
