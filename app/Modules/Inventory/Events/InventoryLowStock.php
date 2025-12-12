<?php

namespace App\Modules\Inventory\Events;

use App\Core\Events\BaseModuleEvent;
use App\Modules\Inventory\Models\InventoryItem;

/**
 * InventoryLowStock Event
 * 
 * Dispatched when an inventory item falls below its minimum stock threshold.
 */
class InventoryLowStock extends BaseModuleEvent
{
    /**
     * The item with low stock.
     */
    public InventoryItem $item;

    /**
     * Current stock level.
     */
    public float $currentStock;

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

        parent::__construct('inventory', [
            'item_id' => $item->id,
            'item_name' => $item->name,
            'item_sku' => $item->sku ?? null,
            'current_stock' => $currentStock,
            'min_stock' => $item->min_stock ?? 0,
            'unit' => $item->unit ?? 'units',
        ], $item->proyecto_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'inventory.stock.low';
    }
}
