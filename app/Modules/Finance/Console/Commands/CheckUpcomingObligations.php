<?php

namespace App\Modules\Finance\Console\Commands;

use Illuminate\Console\Command;
use App\Modules\Finance\Models\Cuenta;
use App\Notifications\UpcomingPaymentNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CheckUpcomingObligations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'finance:check-obligations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for upcoming account payments and notify users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $today = Carbon::today();

            // Configurable days to notify before
            $daysToNotify = [3, 1]; // Notify 3 days before and 1 day before

            foreach ($daysToNotify as $days) {
                $targetDate = $today->copy()->addDays($days);
                $dayOfMonth = $targetDate->day;

                $this->info("Checking payments for day $dayOfMonth (in $days days)...");

                $cuentas = Cuenta::whereIn('tipo', ['credit_card', 'prestamo'])
                    ->where('estado', 'activa')
                    ->where('fecha_pago', $dayOfMonth)
                    ->get();

                foreach ($cuentas as $cuenta) {
                    try {
                        $owner = $cuenta->propietario;

                        /** @phpstan-ignore-next-line */
                        if (!$owner)
                            continue;

                        if ($cuenta->propietario_type === 'App\Models\User') {
                            $owner->notify(new UpcomingPaymentNotification($cuenta, $days));
                            $this->info("Notified User {$owner->id} for account {$cuenta->id}");
                        } elseif ($cuenta->propietario_type === 'App\Models\Proyecto') {
                            /** @var \App\Models\Proyecto $proyecto */
                            $proyecto = $owner;
                            // Notify project admins only
                            foreach ($proyecto->miembros as $member) {
                                /** @phpstan-ignore-next-line */
                                $pivot = $member->pivot;
                                if ($pivot->rol === 'admin') {
                                    $member->notify(new UpcomingPaymentNotification($cuenta, $days));
                                }
                            }
                            $this->info("Notified Project {$owner->id} admins for account {$cuenta->id}");
                        }
                    } catch (\Exception $e) {
                        Log::error("Error notifying for account {$cuenta->id}: " . $e->getMessage());
                        $this->error("Error notifying for account {$cuenta->id}");
                    }
                }
            }

            $this->info('Done.');
        } catch (\Throwable $e) {
            $this->error('Fatal error: ' . $e->getMessage());
            Log::error($e);
            return 1;
        }
    }
}
