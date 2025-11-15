<?php

namespace App\Observers;

use App\Models\Transaccion;
use App\Models\Cuenta;
use Illuminate\Support\Facades\DB;

class TransaccionObserver
{
    /**
     * Se dispara DESPUÉS de que se crea una transacción.
     */
    public function created(Transaccion $transaccion): void
    {
        // Usamos una transacción de BD para asegurar que todo falle o todo funcione
        DB::transaction(function () use ($transaccion) {

            // 1. Obtenemos la cuenta Y LE PONEMOS UN "CANDADO"
            // Esto previene que dos transacciones se creen al mismo tiempo y lean un saldo viejo
            $cuenta = $transaccion->cuenta()->lockForUpdate()->first();

            // 2. Aplicamos la matemática
            $cuenta->balance = $cuenta->balance + $transaccion->monto;
            $cuenta->save();
        });
    }

    /**
     * Se dispara DESPUÉS de que se actualiza una transacción.
     */
    public function updated(Transaccion $transaccion): void
    {
        DB::transaction(function () use ($transaccion) {

            $montoNuevo = $transaccion->monto;
            $cuentaNueva = $transaccion->cuenta()->lockForUpdate()->first();

            // CASO 1: ¿Se movió la transacción de una cuenta a otra?
            if ($transaccion->wasChanged('cuenta_id')) {

                // 1. Obtenemos los valores ANTIGUOS
                $idCuentaOriginal = $transaccion->getOriginal('cuenta_id');
                $montoOriginal = $transaccion->getOriginal('monto'); // El monto que tenía en la cuenta vieja

                // 2. Revertimos el monto en la CUENTA VIEJA
                $cuentaOriginal = Cuenta::lockForUpdate()->find($idCuentaOriginal);
                if ($cuentaOriginal) {
                    $cuentaOriginal->balance = $cuentaOriginal->balance - $montoOriginal;
                    $cuentaOriginal->save();
                }

                // 3. Aplicamos el monto NUEVO a la CUENTA NUEVA
                $cuentaNueva->balance = $cuentaNueva->balance + $montoNuevo;
                $cuentaNueva->save();
            }
            // CASO 2: La cuenta es la misma, solo cambió el monto
            else {

                // 1. Obtenemos el monto ANTIGUO
                $montoOriginal = $transaccion->getOriginal('monto');

                // 2. Calculamos la diferencia
                // Ej: si era -5000 y ahora es -4000, la diferencia es +1000
                $diferencia = $montoNuevo - $montoOriginal;

                // 3. Aplicamos solo la diferencia al saldo
                $cuentaNueva->balance = $cuentaNueva->balance + $diferencia;
                $cuentaNueva->save();
            }
        });
    }

    /**
     * Se dispara DESPUÉS de que se borra una transacción.
     */
    public function deleted(Transaccion $transaccion): void
    {
        DB::transaction(function () use ($transaccion) {

            // 1. Obtenemos la cuenta Y LE PONEMOS UN "CANDADO"
            $cuenta = $transaccion->cuenta()->lockForUpdate()->first();

            // 2. Revertimos la matemática
            // Si borramos un gasto de -5000, restamos -5000 (o sea, sumamos 5000)
            if ($cuenta) { // (Solo por si acaso la cuenta fue borrada)
                $cuenta->balance = $cuenta->balance - $transaccion->monto;
                $cuenta->save();
            }
        });
    }
}
