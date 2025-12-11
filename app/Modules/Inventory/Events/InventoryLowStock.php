<?php

namespace App\Modules\Inventory\Events;

use App\Modules\Inventory\Models\InventoryItem;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class InventoryLowStock
{
    use Dispatchable, SerializesModels;

    public $item;
    public $currentStock;

    /**
     * Create a new event instance.
     *
     * @param InventoryItem $item
     * @param float $currentStock
     */
    public function __construct(InventoryItem $item, float $currentStock)
    {
        $this->item = $item;
        $this->currentStock = $currentStock;
    }
}
