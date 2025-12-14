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

class ProcessRecurringBills implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job - Generate monthly recurring bills
     */
    public function handle(): void
    {
        $today = Carbon::today();

        Log::info("ProcessRecurringBills: Starting for {$today->toDateString()}");

        // Find recurring bill templates ready to generate
        $templates = Transaccion::where('is_recurring', true)
            ->where('status', 'pending') // Templates are pending
            ->whereDate('next_occurrence', '=', $today)
            ->with(['proyecto', 'cuentaPredeterminada'])
            ->get();

        Log::info("ProcessRecurringBills: Found {$templates->count()} templates");

        foreach ($templates as $template) {
            try {
                // ✅ VALIDATION: Check if bill already generated for this month
                $alreadyExists = Transaccion::where('proyecto_id', $template->proyecto_id)
                    ->where('descripcion', $template->descripcion)
                    ->where('monto', $template->monto)
                    ->where('is_recurring', false) // Only check instances, not templates
                    ->whereYear('fecha', $today->year)
                    ->whereMonth('fecha', $today->month)
                    ->exists();

                if ($alreadyExists) {
                    Log::warning("ProcessRecurringBills: Bill #{$template->id} already generated for {$today->format('Y-m')}");

                    // Still update next_occurrence to avoid checking every day
                    $this->updateNextOccurrence($template);
                    continue;
                }

                // Create monthly bill instance
                $monthlyBill = Transaccion::create([
                    'proyecto_id' => $template->proyecto_id,
                    'user_id' => $template->user_id,
                    'cuenta_id' => null, // Not paid yet
                    'categoria_id' => $template->categoria_id,
                    'cuenta_predeterminada_id' => $template->cuenta_predeterminada_id,
                    'monto' => $template->monto,
                    'descripcion' => $template->descripcion,
                    'fecha' => $today->toDateString(),
                    'notas' => "Generada automáticamente desde plantilla #{$template->id}",
                    'status' => 'pending',
                    'is_recurring' => false, // This is an instance, not a template
                    'debito_automatico' => $template->debito_automatico,
                    'tipo' => 'expense',
                ]);

                // Auto-calculate fecha_autopago if needed
                if ($monthlyBill->debito_automatico && $monthlyBill->cuenta_predeterminada_id) {
                    $cuenta = $monthlyBill->cuentaPredeterminada;
                    if ($cuenta && $cuenta->tipo === 'credito') {
                        $dueDate = Carbon::parse($monthlyBill->fecha);
                        // Auto-pay 3 days before due date
                        $monthlyBill->fecha_autopago = $dueDate->copy()->subDays(3);
                        $monthlyBill->save();
                    }
                }

                // Update template's next_occurrence
                $this->updateNextOccurrence($template);

                Log::info("ProcessRecurringBills: Created bill #{$monthlyBill->id} from template #{$template->id}");

            } catch (\Exception $e) {
                Log::error("ProcessRecurringBills: Failed to process template #{$template->id}: " . $e->getMessage());
            }
        }

        Log::info("ProcessRecurringBills: Completed");
    }

    /**
     * Update template's next_occurrence to next month
     */
    private function updateNextOccurrence(Transaccion $template): void
    {
        $currentOccurrence = Carbon::parse($template->next_occurrence);
        $nextMonth = $currentOccurrence->copy()->addMonth();

        // Get target day from template
        $targetDay = $template->recurrence_day ?? $currentOccurrence->day;

        // Special handling for February when day is 29 or 30
        if ($nextMonth->month === 2 && $targetDay >= 29) {
            // Use last day of February (28 or 29 for leap years)
            $nextMonth->endOfMonth();
        } else {
            // Adjust day if month has fewer days (e.g., Jan 31 → Apr 30)
            $nextMonth->day(min($targetDay, $nextMonth->daysInMonth));
        }

        $template->next_occurrence = $nextMonth->toDateString();
        $template->save();

        Log::info("ProcessRecurringBills: Updated template #{$template->id} next_occurrence to {$nextMonth->toDateString()}");
    }
}
