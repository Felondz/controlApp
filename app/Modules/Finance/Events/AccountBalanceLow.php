<?php

namespace App\Modules\Finance\Events;

use App\Core\Events\BaseModuleEvent;
use App\Models\Cuenta;

/**
 * AccountBalanceLow Event
 * 
 * Dispatched when an account balance drops below a threshold.
 */
class AccountBalanceLow extends BaseModuleEvent
{
    /**
     * Create a new event instance.
     *
     * @param Cuenta $account
     * @param float $threshold
     */
    public function __construct(Cuenta $account, float $threshold)
    {
        parent::__construct('finance', [
            'account_id' => $account->id,
            'account_name' => $account->nombre,
            'current_balance' => $account->saldo_actual,
            'threshold' => $threshold,
            'deficit' => $threshold - $account->saldo_actual,
        ], $account->proyecto_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'finance.account.balance_low';
    }
}
