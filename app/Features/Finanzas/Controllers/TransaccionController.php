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
        $transaccion = Transaccion::create($datosCompletos);
        return response()->json($transaccion->load('categoria', 'cuenta'), 201);
    }

    /**
     * Muestra una transacción 
     */
    public function show(Request $request, Transaccion $transaccion)
    {
        // Obtenemos el proyecto DESDE la transacción
        $proyecto = $transaccion->proyecto;

        // Autorización
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');


        return response()->json($transaccion->load('categoria', 'cuenta'));
    }

    /**
     * Actualiza una transacción 
     */
    public function update(UpdateTransaccionRequest $request, Transaccion $transaccion)
    {
        // Obtenemos el proyecto DESDE la transacción
        $proyecto = $transaccion->proyecto;

        // Autorización
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        $datosValidados = $request->validated();
        $transaccion->update($datosValidados);

        return response()->json($transaccion->load('categoria', 'cuenta'));
    }

    /**
     * Elimina una transacción 
     */
    public function destroy(Request $request, Transaccion $transaccion)
    {
        // Obtenemos el proyecto DESDE la transacción
        $proyecto = $transaccion->proyecto;

        // Autorización
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para eliminar en este proyecto.');

        $transaccion->delete();
        return response()->noContent();
    }
}
