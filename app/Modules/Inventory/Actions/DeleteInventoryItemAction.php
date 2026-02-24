<?php declare(strict_types=1);

namespace App\Modules\Inventory\Actions;

use App\Modules\Inventory\Models\InventoryItem;
use Illuminate\Support\Facades\Storage;

class DeleteInventoryItemAction
{
    /**
     * Executes the deletion of an inventory item and its associated image.
     */
    public function execute(InventoryItem $item): bool
    {
        if ($item->image_path) {
            Storage::disk('public')->delete($item->image_path);
        }

        return $item->delete();
    }
}
