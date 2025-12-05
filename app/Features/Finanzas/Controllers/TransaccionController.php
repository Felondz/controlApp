<?php

namespace App\Features\Finanzas\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Models\Transaccion;
use Illuminate\Http\Request;
use App\Features\Finanzas\Requests\StoreTransaccionRequest;
use App\Features\Finanzas\Requests\UpdateTransaccionRequest;

class TransaccionController extends Controller
{
    /**
     * Muestra las transacciones 
     */
    public function index(Request $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');
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
    public function store(StoreTransaccionRequest $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para añadir transacciones.');

        \Illuminate\Support\Facades\Log::info('Store Transaction Request:', $request->all());

        $datosValidados = $request->validated();
        $datosCompletos = array_merge($datosValidados, [
            'proyecto_id' => $proyecto->id,
            'user_id' => $request->user()->id,
        ]);

        // Create transaction
        $transaccion = Transaccion::create($datosCompletos);

        // Update Account Balance
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $cuenta = \App\Models\Cuenta::find($transaccion->cuenta_id);
            if ($cuenta) {
                $cuenta->saldo_actual += $transaccion->monto; // Monto is already signed (+/-)
                $cuenta->save();
            }
        }

        // If this transaction is linked to a financial task, mark the task as done
        if (isset($datosValidados['task_id']) && $datosValidados['task_id']) {
            $task = \App\Models\Task::find($datosValidados['task_id']);
            if ($task && $task->project_id === $proyecto->id) {
                $task->update(['status' => 'done']);
            }
        }

        if ($request->wantsJson()) {
            return response()->json($transaccion, 201);
        }

        return redirect()->back()->with('success', 'Transacción creada correctamente.');
    }

    /**
     * Muestra una transacción 
     */
    public function show(Request $request, Proyecto $proyecto, Transaccion $transaccion)
    {
        // Verificar autorización
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // Verificar que la transacción pertenece al proyecto
        if ($transaccion->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        return response()->json($transaccion->load('categoria', 'cuenta'));
    }

    /**
     * Actualiza una transacción 
     */
    public function update(UpdateTransaccionRequest $request, Proyecto $proyecto, Transaccion $transaccion)
    {
        // Verificar autorización
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // Verificar que la transacción pertenece al proyecto
        if ($transaccion->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        // Verificar que el usuario es dueño de la transacción
        abort_if($transaccion->user_id !== $request->user()->id, 403, 'No puedes editar transacciones de otros usuarios.');

        $datosValidados = $request->validated();

        // Revert old balance
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $oldCuenta = \App\Models\Cuenta::find($transaccion->cuenta_id);
            if ($oldCuenta) {
                $oldCuenta->saldo_actual -= $transaccion->monto;
                $oldCuenta->save();
            }
        }

        $transaccion->update($datosValidados);

        // Apply new balance
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $newCuenta = \App\Models\Cuenta::find($transaccion->cuenta_id);
            if ($newCuenta) {
                $newCuenta->saldo_actual += $transaccion->monto;
                $newCuenta->save();
            }
        }

        if ($request->wantsJson()) {
            return response()->json($transaccion, 200);
        }

        return redirect()->back()->with('success', 'Transacción actualizada correctamente.');
    }

    /**
     * Elimina una transacción 
     */
    public function destroy(Request $request, Proyecto $proyecto, Transaccion $transaccion)
    {
        // Verificar autorización
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para eliminar en este proyecto.');

        // Verificar que la transacción pertenece al proyecto
        if ($transaccion->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        // Verificar que el usuario es dueño de la transacción
        abort_if($transaccion->user_id !== $request->user()->id, 403, 'No puedes eliminar transacciones de otros usuarios.');

        // Revert balance before deleting
        if ($transaccion->cuenta_id && $transaccion->status === 'completed') {
            $cuenta = \App\Models\Cuenta::find($transaccion->cuenta_id);
            if ($cuenta) {
                $cuenta->saldo_actual -= $transaccion->monto;
                $cuenta->save();
            }
        }

        $transaccion->delete();
        if ($request->wantsJson()) {
            return response()->json(null, 204);
        }

        return redirect()->back()->with('success', 'Transacción eliminada correctamente.');
    }
}
