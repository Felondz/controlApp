<?php

namespace App\Modules\Finance\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Transaccion;
use Illuminate\Http\Request;
use App\Modules\Finance\Requests\StoreTransaccionRequest;
use App\Modules\Finance\Requests\UpdateTransaccionRequest;

class TransaccionController extends Controller
{
    /**
     * Muestra las transacciones 
     */
    public function index(Request $request, Proyecto $proyecto): \Illuminate\Http\JsonResponse
    {
        abort_if(!$request->user()?->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');
        $query = $proyecto->transacciones()->with('categoria', 'cuenta');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            // Default to completed to hide pending bills from main list
            $query->where('status', 'completed');
        }

        $transacciones = $query->orderBy('fecha', 'desc')->get();
        return response()->json($transacciones);
    }

    /**
     * Almacena una transacción
     */
    public function store(StoreTransaccionRequest $request, Proyecto $proyecto): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        abort_if(!$request->user()?->esMiembroDe($proyecto), 403, 'No tienes permiso para añadir transacciones.');

        \Illuminate\Support\Facades\Log::info('Store Transaction Request:', $request->all());

        $datosValidados = $request->validated();

        // If date is TODAY, use NOW() to capture time for proper sorting (transactions view)
        // This ensures the latest transactions appear first when filtering by date
        $fechaInput = \Carbon\Carbon::parse($datosValidados['fecha']);
        if ($fechaInput->isToday()) {
            $datosValidados['fecha'] = now()->toDateTimeString();
        }

        // Auto-calculate fecha_autopago if debito_automatico is enabled
        if (isset($datosValidados['debito_automatico']) && $datosValidados['debito_automatico'] && isset($datosValidados['cuenta_predeterminada_id'])) {
            /** @var \App\Modules\Finance\Models\Cuenta|null $cuenta */
            $cuenta = \App\Modules\Finance\Models\Cuenta::find($datosValidados['cuenta_predeterminada_id']);

            if ($cuenta && $cuenta->tipo === 'credito') {
                // Use fecha_vencimiento if available, otherwise fallback to generic fecha
                $baseDate = $datosValidados['fecha_vencimiento'] ?? $datosValidados['fecha'];
                $dueDate = \Carbon\Carbon::parse($baseDate);
                $datosValidados['fecha_autopago'] = $dueDate->copy()->subDays(3)->toDateTimeString();
            } else {
                // Only credit cards can have auto-debit
                $datosValidados['debito_automatico'] = false;
            }
        }

        // Handle recurring bills
        if (isset($datosValidados['is_recurring']) && $datosValidados['is_recurring']) {
            // Set recurrence_interval to monthly
            $datosValidados['recurrence_interval'] = 'monthly';

            // Calculate next_occurrence based on recurrence_day
            $day = (int) ($datosValidados['recurrence_day'] ?? date('d'));
            $now = \Carbon\Carbon::now();

            // Start with current month
            /** @var \Carbon\Carbon $nextOccurrence */
            $nextOccurrence = \Carbon\Carbon::create($now->year, $now->month, 1);

            // Special handling for February when day is 29 or 30
            if ($nextOccurrence->month === 2 && $day >= 29) {
                $nextOccurrence->endOfMonth();
            } else {
                $nextOccurrence->day(min($day, $nextOccurrence->daysInMonth));
            }

            // If the calculated date has already passed this month, move to next month
            if ($nextOccurrence->isPast() || $nextOccurrence->isToday()) {
                $nextOccurrence->addMonth();

                // Re-adjust day for the new month
                if ($nextOccurrence->month === 2 && $day >= 29) {
                    $nextOccurrence->endOfMonth();
                } else {
                    $nextOccurrence->day(min($day, $nextOccurrence->daysInMonth));
                }
            }

            $datosValidados['next_occurrence'] = $nextOccurrence->toDateString();

            // Use next_occurrence as the initial fecha
            $datosValidados['fecha'] = $nextOccurrence->toDateString();
        }

        $datosCompletos = array_merge($datosValidados, [
            'proyecto_id' => $proyecto->id,
            'user_id' => $request->user()->id,
        ]);

        // Create transaction
        $transaccion = Transaccion::create($datosCompletos);

        // Update Account Balance
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $cuenta = \App\Modules\Finance\Models\Cuenta::find($transaccion->cuenta_id);
            if ($cuenta) {
                $cuenta->saldo_actual = (int) ($cuenta->saldo_actual + $transaccion->monto); // Monto is already signed (+/-)
                $cuenta->save();
            }
        }

        // If this transaction is linked to a financial task, mark the task as done
        if (isset($datosValidados['task_id']) && $datosValidados['task_id']) {
            /** @var \App\Modules\Tasks\Models\Task|null $task */
            $task = \App\Modules\Tasks\Models\Task::find($datosValidados['task_id']);
            if ($task && (int) $task->project_id === $proyecto->id) {
                $task->update(['status' => 'done']);
            }
        }

        if ($request->wantsJson()) {
            return response()->json($transaccion, 201);
        }

        return redirect()->back()->with('success', __('finance.transaction_created'));
    }

    /**
     * Muestra una transacción 
     */
    public function show(Request $request, Proyecto $proyecto, Transaccion $transaccion): \Illuminate\Http\JsonResponse
    {
        // Verificar autorización
        abort_if(!$request->user()?->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // Verificar que la transacción pertenece al proyecto
        if ($transaccion->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        return response()->json($transaccion->load('categoria', 'cuenta'));
    }

    /**
     * Actualiza una transacción 
     */
    public function update(UpdateTransaccionRequest $request, Proyecto $proyecto, Transaccion $transaccion): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        // Verificar autorización
        abort_if(!$request->user()?->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // Verificar que la transacción pertenece al proyecto
        if ((int) $transaccion->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        // Verificar que el usuario es dueño de la transacción
        abort_if((int) $transaccion->user_id !== $request->user()->id, 403, 'No puedes editar transacciones de otros usuarios.');

        $datosValidados = $request->validated();

        // Revert old balance
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $oldCuenta = \App\Modules\Finance\Models\Cuenta::find($transaccion->cuenta_id);
            if ($oldCuenta) {
                $oldCuenta->saldo_actual = (int) ($oldCuenta->saldo_actual - $transaccion->getOriginal('monto'));
                $oldCuenta->save();
            }
        }

        $transaccion->update($datosValidados);

        // Apply new balance
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $newCuenta = \App\Modules\Finance\Models\Cuenta::find($transaccion->cuenta_id);
            if ($newCuenta) {
                $newCuenta->saldo_actual = (int) ($newCuenta->saldo_actual + $transaccion->monto);
                $newCuenta->save();
            }
        }

        if ($request->wantsJson()) {
            return response()->json($transaccion, 200);
        }

        return redirect()->back()->with('success', __('finance.transaction_updated'));
    }

    /**
     * Elimina una transacción 
     */
    public function destroy(Request $request, Proyecto $proyecto, Transaccion $transaccion): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        // Verificar autorización
        abort_if(!$request->user()?->esMiembroDe($proyecto), 403, 'No tienes permiso para eliminar en este proyecto.');

        // Verificar que la transacción pertenece al proyecto
        if ((int) $transaccion->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        // Verificar que el usuario es dueño de la transacción
        abort_if((int) $transaccion->user_id !== $request->user()->id, 403, 'No puedes eliminar transacciones de otros usuarios.');

        // Revert balance before deleting
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $cuenta = \App\Modules\Finance\Models\Cuenta::find($transaccion->cuenta_id);
            if ($cuenta) {
                $cuenta->saldo_actual = (int) ($cuenta->saldo_actual - $transaccion->monto);
                $cuenta->save();
            }
        }

        $transaccion->delete();
        if ($request->wantsJson()) {
            return response()->json(null, 204);
        }

        return redirect()->back()->with('success', __('finance.transaction_deleted'));
    }

    /**
     * Pay a bill directly using its default account
     */
    public function payDirectly(Request $request, Proyecto $proyecto, Transaccion $transaccion): \Illuminate\Http\JsonResponse
    {
        // Verify authorization
        abort_if(!$request->user()?->esMiembroDe($proyecto), 403, 'No tienes permiso para pagar facturas.');

        // Verify transaction belongs to project
        if ((int) $transaccion->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        // Verify bill has default account
        if (!$transaccion->cuenta_predeterminada_id) {
            return response()->json(['error' => __('finance.error_no_default_account')], 400);
        }

        // Verify bill is pending
        if ($transaccion->status !== 'pending') {
            return response()->json(['error' => __('finance.error_already_paid')], 400);
        }

        // Update bill to completed and assign account
        $transaccion->update([
            'cuenta_id' => $transaccion->cuenta_predeterminada_id,
            'status' => 'completed',
            'fecha_pago' => now(),
            'descripcion' => "Pago de factura: {$transaccion->descripcion}", // Update description
        ]);

        // Update account balance (monto is already negative for expenses)
        $cuenta = \App\Modules\Finance\Models\Cuenta::find($transaccion->cuenta_id);
        if ($cuenta) {
            $cuenta->saldo_actual = (int) ($cuenta->saldo_actual + $transaccion->monto);
            $cuenta->save();
        }

        return response()->json([
            'success' => true,
            'message' => __('finance.bill_paid_success'),
            'payment' => $transaccion,
        ]);
    }
}
