<?php

namespace App\Modules\Finance\Jobs;

use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Transaccion;
use App\Modules\Finance\Models\Categoria;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessInterestAccrual implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $today = Carbon::now();

        // Execute only on the 1st of the month
        // (This check assumes the scheduler runs daily)
        if ($today->day !== 1) {
            return;
        }

        Log::info('Iniciando procesamiento de rendimientos financieros...');

        // Obtenemos cuentas de banco o inversión con tasa > 0
        $cuentas = Cuenta::whereIn('tipo', ['banco', 'inversion'])
            ->where('tasa_interes_anual', '>', 0)
            ->where('estado', '!=', 'cerrada')
            ->get();

        foreach ($cuentas as $cuenta) {
            try {
                $this->processAccount($cuenta, $today);
            } catch (\Exception $e) {
                Log::error("Error procesando rendimientos para cuenta {$cuenta->id}: " . $e->getMessage());
            }
        }

        Log::info('Procesamiento de rendimientos finalizado.');
    }

    protected function processAccount(Cuenta $cuenta, Carbon $date)
    {
        $saldo = $cuenta->saldo_actual;

        if ($saldo <= 0)
            return;

        // Calculate Monthly Rate from Annual Effective Rate (EA)
        // Formula: (1 + EA)^(1/12) - 1
        $tea = $cuenta->tasa_interes_anual / 100;
        $tasaMensual = pow(1 + $tea, 1 / 12) - 1;

        $interes = $saldo * $tasaMensual;

        if ($interes < 1)
            return; // Ignore amounts < 1 cent

        DB::transaction(function () use ($cuenta, $interes, $date) {
            // Find or create 'Financial Yields' category
            $categoria = Categoria::firstOrCreate(
                [
                    'proyecto_id' => $cuenta->propietario_id,
                    'nombre' => 'Rendimientos Financieros'
                ],
                [
                    'tipo' => 'income',
                    'color' => '#10B981', // Emerald
                    'icono' => 'TrendingUp'
                ]
            );

            // Create Transaction
            $transaccion = new Transaccion([
                'proyecto_id' => $cuenta->propietario_id,
                'cuenta_id' => $cuenta->id,
                'categoria_id' => $categoria->id,
                'monto' => round($interes),
                'tipo' => 'income',
                'descripcion' => 'Rendimientos Automáticos - ' . $date->copy()->subMonth()->format('F Y'),
                'fecha' => $date->toDateString(),
                'status' => 'completed',
                'user_id' => 1, // System default user or null if nullable
            ]);

            // If user_id is strictly required by foreign key, use owner or 1. 
            // Assuming owner is a user. If owner is Project, we need a user context or nullable.
            // Transaccion model usually implies a user. We'll try to find one.
            if (!$transaccion->user_id) {
                // Try to find a user from the project
                $usuario = DB::table('proyecto_user')->where('proyecto_id', $cuenta->propietario_id)->first();
                $transaccion->user_id = $usuario ? $usuario->user_id : 1;
            }

            $transaccion->save();
        });
    }
}
