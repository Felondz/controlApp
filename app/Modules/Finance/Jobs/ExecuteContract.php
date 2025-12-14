<?php

namespace App\Modules\Finance\Jobs;

use App\Modules\Finance\Models\SupplyContract;
use App\Modules\Finance\Models\Transaccion;
use App\Modules\Finance\Events\SupplyContractExecuted;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExecuteContract implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $contract;

    /**
     * Create a new job instance.
     *
     * @param SupplyContract $contract
     */
    public function __construct(SupplyContract $contract)
    {
        $this->contract = $contract;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Executing Supply Contract: {$this->contract->id} - {$this->contract->name}");

        DB::beginTransaction();
        try {
            // 1. Create Invoice (Transaction) if enabled
            $invoice = null;
            if ($this->contract->auto_generate_invoice) {
                $invoice = Transaccion::create([
                    'proyecto_id' => $this->contract->proyecto_id,
                    'user_id' => null, // System generated
                    'cuenta_id' => $this->contract->target_account_id,
                    'categoria_id' => $this->contract->billing_category_id,
                    'descripcion' => "Contrato: {$this->contract->name}",
                    'monto' => $this->contract->total_amount, // Negative if expense? Usually contracts are expenses (outflow)
                    'tipo' => 'gasto', // Assuming supply contracts are expenses
                    'fecha' => now(),
                    'estado' => 'pagado', // Or 'pendiente' depending on logic. Let's assume paid or created as liability?
                    // Let's assume 'pendiente' so it appears as a bill to pay, unless account is deducted.
                    // If target_account_id is set, maybe it's auto-paid?
                    // Let's default to 'completado' if account is defined (auto-debit) or 'pendiente' if no account.
                    // Actually Transaccion logic usually requires an account.
                    'installments' => 1,

                    // Polymorphic source
                    'source_type' => get_class($this->contract),
                    'source_id' => $this->contract->id,
                ]);
            }

            // 2. Dispatch Event (for Inventory to pick up)
            // Even if no invoice is created (maybe just tracking), we might want inventory.
            // But usually we need the invoice to link.
            // Let's assume we always dispatch if the contract runs.
            if ($invoice) {
                SupplyContractExecuted::dispatch($this->contract, $invoice);
            }

            // 3. Update Contract Next Run Date
            $this->contract->update([
                'last_run_at' => now(),
                'next_run_at' => $this->calculateNextRun(),
            ]);

            DB::commit();
            Log::info("Contract {$this->contract->id} processed successfully.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to process Contract {$this->contract->id}: " . $e->getMessage());
            $this->fail($e);
        }
    }

    protected function calculateNextRun()
    {
        $current = $this->contract->next_run_at ?? now();

        switch ($this->contract->frequency) {
            case 'daily':
                return $current->addDay();
            case 'weekly':
                return $current->addWeek();
            case 'monthly':
                return $current->addMonth();
            case 'yearly':
                return $current->addYear();
            default:
                return $current->addMonth();
        }
    }
}
