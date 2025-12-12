<?php

namespace App\Modules\Finance\Jobs;

use App\Modules\Finance\Models\Transaccion;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessAutoBills implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $today = Carbon::today();

        Log::info("ProcessAutoBills: Starting autopay processing for <= {$today->toDateString()}");

        // Find bills scheduled for autopay TODAY OR BEFORE (in case job didn't run)
        $bills = Transaccion::where('status', 'pending')
            ->where('debito_automatico', true)
            ->whereNotNull('cuenta_predeterminada_id')
            ->whereDate('fecha_autopago', '<=', $today)
            ->with(['proyecto', 'cuentaPredeterminada'])
            ->get();

        Log::info("ProcessAutoBills: Found {$bills->count()} bills to process");

        foreach ($bills as $bill) {
            try {
                // Verify cuenta_predeterminada exists
                if (!$bill->cuentaPredeterminada) {
                    Log::warning("ProcessAutoBills: Bill #{$bill->id} has no default account, skipping");
                    continue;
                }

                // Update existing bill to completed
                $bill->update([
                    'cuenta_id' => $bill->cuenta_predeterminada_id,
                    'status' => 'completed',
                    'fecha' => now(), // Update to actual payment date
                    'descripcion' => "Débito Automático: {$bill->descripcion}",
                    'tipo' => 'expense', // Ensure it's an expense
                ]);

                // Update Account Balance
                $cuenta = $bill->cuentaPredeterminada;
                if ($cuenta) {
                    $cuenta->saldo_actual += $bill->monto; // Monto is already negative for expenses
                    $cuenta->save();
                }

                Log::info("ProcessAutoBills: Successfully processed bill #{$bill->id}");

            } catch (\Exception $e) {
                Log::error("ProcessAutoBills: Failed to process bill #{$bill->id}: " . $e->getMessage());
                // Continue processing other bills even if one fails
            }
        }

        Log::info("ProcessAutoBills: Completed autopay processing");
    }
}
