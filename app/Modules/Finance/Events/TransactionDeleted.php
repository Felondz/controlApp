<?php

namespace App\Modules\Finance\Events;

use App\Core\Events\BaseModuleEvent;

/**
 * TransactionDeleted Event
 * 
 * Dispatched when a transaction is deleted.
 */
class TransactionDeleted extends BaseModuleEvent
{
    /**
     * Create a new event instance.
     *
     * @param int $transactionId
     * @param int $projectId
     * @param int $accountId
     */
    public function __construct(int $transactionId, int $projectId, int $accountId)
    {
        parent::__construct('finance', [
            'transaction_id' => $transactionId,
            'account_id' => $accountId,
        ], $projectId);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'finance.transaction.deleted';
    }
}
