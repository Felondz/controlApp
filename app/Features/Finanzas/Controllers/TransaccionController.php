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
        $transacciones = $proyecto->transacciones()->with('categoria', 'cuenta')->orderBy('fecha', 'desc')->get();
        return response()->json($transacciones);
    }

    /**
     * Almacena una transacción 
     */
    public function store(StoreTransaccionRequest $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para añadir transacciones.');
        $datosValidados = $request->validated();
        $datosCompletos = array_merge($datosValidados, [
            'proyecto_id' => $proyecto->id,
            'user_id' => $request->user()->id,
        ]);

        // Create transaction
        $transaccion = Transaccion::create($datosCompletos);

        // If this transaction is linked to a financial task, mark the task as done
        if (isset($datosValidados['task_id']) && $datosValidados['task_id']) {
            $task = \App\Models\Task::find($datosValidados['task_id']);
            if ($task && $task->project_id === $proyecto->id && $task->is_financial) {
                $task->update(['status' => 'done']);
            }
        }

        return response()->json($transaccion->load('categoria', 'cuenta'), 201);
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
        $transaccion->update($datosValidados);

        return response()->json($transaccion->load('categoria', 'cuenta'));
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

        $transaccion->delete();
        return response()->noContent();
    }
}
