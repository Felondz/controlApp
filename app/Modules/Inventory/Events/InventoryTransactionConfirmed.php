<?php

namespace App\Modules\Inventory\Events;

use App\Modules\Inventory\Models\InventoryTransaction;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class InventoryTransactionConfirmed
{
    use Dispatchable, SerializesModels;

    public $transaction;

    /**
     * Create a new event instance.
     *
     * @param InventoryTransaction $transaction
     */
    public function __construct(InventoryTransaction $transaction)
    {
        $this->transaction = $transaction;
    }
}
