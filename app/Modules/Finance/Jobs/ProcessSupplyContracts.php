<?php

namespace App\Modules\Finance\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Modules\Finance\Models\SupplyContract;
use App\Modules\Finance\Events\SupplyContractExecuted;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ProcessSupplyContracts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("ProcessSupplyContracts: Starting execution.");

        $contracts = SupplyContract::where('status', 'active')
            ->where('next_run_at', '<=', now())
            ->get();

        Log::info("ProcessSupplyContracts: Found {$contracts->count()} contracts due for execution.");

        foreach ($contracts as $contract) {
            try {
                // Auto-generate invoice/transaction first (as per Event requirement)
                $transaction = \App\Modules\Finance\Models\Transaccion::create([
                     'proyecto_id' => $contract->proyecto_id,
                     'titulo' => "Contract Exec: " . ($contract->name ?? 'Supply'),
                     'monto' => $contract->total_amount,
                     'tipo' => 'gasto', // Assuming supply is expense
                     'estado' => $contract->auto_generate_invoice ? 'pendiente' : 'programado',
                     'categoria_id' => $contract->billing_category_id,
                     'cuenta_id' => $contract->target_account_id,
                     'fecha' => now(), // Or next_run_at
                     'descripcion' => "Auto-generated from Supply Contract #{$contract->id}",
                     'user_id' => $contract->proyecto->user_id ?? \App\Models\User::first()->id ?? 1,
                     // 'reference_type' => SupplyContract::class, // If supported
                     // 'reference_id' => $contract->id,
                ]);

                // Dispatch event (listeners will create inventory draft, etc.)
                SupplyContractExecuted::dispatch($contract, $transaction);

                // Update timestamps
                $contract->last_run_at = now();
                $contract->next_run_at = $this->calculateNextRunArg($contract);
                $contract->save();

                Log::info("ProcessSupplyContracts: Processed contract ID {$contract->id}. Next run: {$contract->next_run_at}");

            } catch (\Exception $e) {
                Log::error("ProcessSupplyContracts: Failed to process contract ID {$contract->id}. Error: " . $e->getMessage());
            }
        }
    }

    /**
     * Calculate next run date based on frequency.
     */
    private function calculateNextRunArg(SupplyContract $contract): Carbon
    {
        $current = Carbon::parse($contract->next_run_at ?? now());
        
        // If we are way behind, should we catch up or just set to next interval from NOW?
        // Let's advance from the scheduled time to preserve cadence, but ensure we don't set a date in the past if it missed multiple cycles.
        // Simple approach: Add interval to current 'next_run_at'
        
        switch ($contract->frequency) {
            case 'daily':
                return $current->addDay();
            case 'weekly':
                return $current->addWeek();
            case 'monthly':
                return $current->addMonth();
            case 'yearly':
                return $current->addYear();
            default:
                // If on_demand or unknown, maybe don't schedule next run automatically?
                // Or verify logic. For now, daily fallback or keep as is?
                // If on_demand, likely shouldn't be picked up by Cron unless 'next_run_at' was manually set.
                return $current->addDay(); 
        }
    }
}
