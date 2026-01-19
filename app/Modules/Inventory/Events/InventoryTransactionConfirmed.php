<?php

namespace App\Modules\Inventory\Events;

use App\Modules\Inventory\Models\InventoryTransaction;

use Illuminate\Queue\SerializesModels;

class InventoryTransactionConfirmed extends \App\Core\Events\BaseModuleEvent
{
    use SerializesModels;

    public $transaction;

    /**
     * Create a new event instance.
     *
     * @param InventoryTransaction $transaction
     */
    public function __construct(InventoryTransaction $transaction)
    {
        $this->transaction = $transaction;
        parent::__construct(
            'inventory', 
            $transaction->toArray(), 
            $transaction->proyecto_id
        );
    }

    public function getName(): string
    {
        return 'inventory.transaction.confirmed';
    }
}
