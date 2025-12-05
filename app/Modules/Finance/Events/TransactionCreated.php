<?php

namespace App\Modules\Finance\Events;

use App\Core\Events\BaseModuleEvent;
use App\Models\Transaccion;

/**
 * TransactionCreated Event
 * 
 * Dispatched when a new transaction is created.
 */
class TransactionCreated extends BaseModuleEvent
{
    /**
     * Create a new event instance.
     *
     * @param Transaccion $transaction
     */
    public function __construct(Transaccion $transaction)
    {
        parent::__construct('finance', [
            'transaction_id' => $transaction->id,
            'account_id' => $transaction->cuenta_id,
            'category_id' => $transaction->categoria_id,
            'amount' => $transaction->monto,
            'type' => $transaction->tipo,
            'description' => $transaction->descripcion,
            'date' => $transaction->fecha,
            'task_id' => $transaction->task_id,
        ], $transaction->proyecto_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'finance.transaction.created';
    }
}
