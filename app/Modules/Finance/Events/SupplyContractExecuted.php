<?php

namespace App\Modules\Finance\Events;

use App\Modules\Finance\Models\SupplyContract;
use App\Models\Transaccion;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SupplyContractExecuted
{
    use Dispatchable, SerializesModels;

    public $contract;
    public $invoice;

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
    }
}
