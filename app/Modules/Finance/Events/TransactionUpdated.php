<?php

namespace App\Modules\Finance\Events;

use App\Core\Events\BaseModuleEvent;
use App\Modules\Finance\Models\Transaccion;

/**
 * TransactionUpdated Event
 * 
 * Dispatched when a transaction is updated.
 */
class TransactionUpdated extends BaseModuleEvent
{
    /**
     * Create a new event instance.
     *
     * @param Transaccion $transaction
     * @param array $changes
     */
    public function __construct(Transaccion $transaction, array $changes = [])
    {
        parent::__construct('finance', [
            'transaction_id' => $transaction->id,
            'account_id' => $transaction->cuenta_id,
            'changes' => $changes,
        ], $transaction->proyecto_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'finance.transaction.updated';
    }
}
