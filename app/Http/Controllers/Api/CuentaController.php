<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cuenta;
use App\Models\Proyecto;
use App\Models\Transaccion;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CuentaController extends Controller
{
    /**
     * Muestra las cuentas ACTIVAS de un proyecto.
     * (Cualquier miembro puede 'ver')
     */
    public function index(Request $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        $cuentas = $proyecto->cuentas()->where('estado', 'activa')->get();
        return response()->json($cuentas);
    }

    /**
     * Almacena una nueva cuenta.
     */
    public function store(Request $request, Proyecto $proyecto)
    {

        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden añadir cuentas a este proyecto.');

        $datosValidados = $request->validate([
            'nombre' => 'required|string|max:255',
            'banco' => 'nullable|string|max:255',
            'balance_inicial' => 'required|numeric',
            'tipo' => ['required', 'string', Rule::in(['efectivo', 'banco', 'credito', 'otro'])],
        ]);

        // Añadimos el balance actual al array antes de crear.
        $datosValidados['balance'] = $datosValidados['balance_inicial'];

        // estado='activa' se pone por defecto (lo definimos en la migración)
        $cuenta = $proyecto->cuentas()->create($datosValidados);
        return response()->json($cuenta, 201);
    }

    /**
     * Muestra una cuenta específica (activa o inactiva).
     * (Cualquier miembro puede 'ver')
     */
    public function show(Request $request, Proyecto $proyecto, Cuenta $cuenta)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        if ($cuenta->propietario_id !== $proyecto->id || $cuenta->propietario_type !== 'App\Models\Proyecto') {
            abort(404);
        }

        return response()->json($cuenta);
    }

    /**
     * Actualiza una cuenta.
     */
    public function update(Request $request, Proyecto $proyecto, Cuenta $cuenta)
    {

        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden editar este proyecto.');

        if ($cuenta->propietario_id !== $proyecto->id || $cuenta->propietario_type !== 'App\Models\Proyecto') {
            abort(404);
        }

        $datosValidados = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'banco' => 'nullable|string|max:255',
            'balance_inicial' => 'sometimes|numeric',
            'tipo' => ['sometimes', 'string', Rule::in(['efectivo', 'banco', 'credito', 'otro'])],
            'estado' => ['sometimes', 'string', Rule::in(['activa', 'inactiva'])],
        ]);

        $cuenta->update($datosValidados);
        return response()->json($cuenta);
    }

    /**
     * Elimina (o inactiva) una cuenta.
     */
    public function destroy(Request $request, Proyecto $proyecto, Cuenta $cuenta)
    {

        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden inactivar/eliminar cuentas.');

        if ($cuenta->propietario_id !== $proyecto->id || $cuenta->propietario_type !== 'App\Models\Proyecto') {
            abort(404);
        }

        if ($cuenta->transacciones()->exists()) {
            // Caso 1: Tiene transacciones. Se inactiva.
            $cuenta->update(['estado' => 'inactiva']);
            return response()->json([
                'message' => 'La cuenta tiene transacciones, por lo que ha sido inactivada en lugar de borrada.',
                'cuenta' => $cuenta
            ]);
        } else {
            // Caso 2: No tiene transacciones. Se borra permanentemente.
            $cuenta->delete();
            return response()->noContent();
        }
    }
}
