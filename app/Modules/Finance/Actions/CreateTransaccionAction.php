<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\DTOs\CreateTransaccionDTO;
use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Transaccion;
use Carbon\Carbon;

class CreateTransaccionAction
{
    public function execute(CreateTransaccionDTO $dto): Transaccion
    {
        $fecha = $dto->fecha;

        // If date is TODAY, use NOW() for proper sorting
        $fechaParsed = Carbon::parse($fecha);
        if ($fechaParsed->isToday()) {
            $fecha = now()->toDateTimeString();
        }

        $fechaAutopago = $dto->fechaAutopago;
        $debitoAutomatico = $dto->debitoAutomatico;

        // Auto-calculate fecha_autopago if debito_automatico is enabled
        if ($debitoAutomatico && $dto->cuentaPredeterminadaId) {
            $cuenta = Cuenta::find($dto->cuentaPredeterminadaId);
            if ($cuenta && $cuenta->tipo === 'credito') {
                $dueDate = Carbon::parse($fecha);
                $fechaAutopago = $dueDate->copy()->subDays(3)->toDateTimeString();
            } else {
                $debitoAutomatico = false;
            }
        }

        // Handle recurring bills
        $nextOccurrence = null;
        $recurrenceInterval = $dto->recurrenceInterval;
        if ($dto->isRecurring) {
            $recurrenceInterval = 'monthly';
            $day = $dto->recurrenceDay ?? (int) date('d');
            $now = Carbon::now();
            /** @var Carbon $next */
            $next = Carbon::create($now->year, $now->month, 1);

            if ($next->month === 2 && $day >= 29) {
                $next->endOfMonth();
            } else {
                $next->day(min($day, $next->daysInMonth));
            }

            if ($next->isPast() || $next->isToday()) {
                $next->addMonth();
                if ($next->month === 2 && $day >= 29) {
                    $next->endOfMonth();
                } else {
                    $next->day(min($day, $next->daysInMonth));
                }
            }

            $nextOccurrence = $next->toDateString();
            $fecha = $next->toDateString();
        }

        $transaccion = Transaccion::create([
            'proyecto_id' => $dto->proyecto->id,
            'user_id' => $dto->userId,
            'cuenta_id' => $dto->cuentaId,
            'categoria_id' => $dto->categoriaId,
            'monto' => $dto->monto,
            'titulo' => $dto->titulo,
            'descripcion' => $dto->descripcion,
            'fecha' => $fecha,
            'notas' => $dto->notas,
            'status' => $dto->status,
            'cuenta_predeterminada_id' => $dto->cuentaPredeterminadaId,
            'debito_automatico' => $debitoAutomatico,
            'fecha_autopago' => $fechaAutopago,
            'is_recurring' => $dto->isRecurring,
            'recurrence_interval' => $recurrenceInterval,
            'recurrence_day' => $dto->recurrenceDay,
            'next_occurrence' => $nextOccurrence,
            'cuotas' => $dto->cuotas,
        ]);

        // Update Account Balance
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $cuenta = Cuenta::find($transaccion->cuenta_id);
            if ($cuenta) {
                $cuenta->saldo_actual += (int) $transaccion->monto;
                $cuenta->save();
            }
        }

        // If linked to a financial task, mark it as done
        if ($dto->taskId) {
            $task = \App\Modules\Tasks\Models\Task::find($dto->taskId);
            if ($task && $task->project_id === $dto->proyecto->id) {
                $task->update(['status' => 'done']);
            }
        }

        return $transaccion;
    }
}
