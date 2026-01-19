<?php

namespace App\Modules\Finance\Events;

use App\Core\Events\BaseModuleEvent;
use App\Modules\Finance\Models\SupplyContract;
use App\Modules\Finance\Models\Transaccion;

/**
 * SupplyContractExecuted Event
 * 
 * Dispatched when a supply contract is executed and generates an invoice.
 */


class SupplyContractExecuted extends BaseModuleEvent
{

    /**
     * The executed contract.
     */
    public SupplyContract $contract;

    /**
     * The generated invoice transaction.
     */
    public Transaccion $invoice;

    /**
     * Create a new event instance.
     *
     * @param SupplyContract $contract
     * @param Transaccion $invoice
     */
    public function __construct(SupplyContract $contract, Transaccion $invoice)
    {
        $this->contract = $contract;
        $this->invoice = $invoice;

        parent::__construct('finance', [
            'contract_id' => $contract->id,
            'provider_id' => $contract->provider_id,
            'invoice_id' => $invoice->id,
            'amount' => $invoice->monto,
            'inventory_item_id' => $contract->inventory_item_id ?? null,
            'quantity' => $contract->quantity ?? null,
        ], $contract->proyecto_id);
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'finance.contract.executed';
    }
}
