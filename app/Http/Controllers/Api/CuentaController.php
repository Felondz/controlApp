<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cuenta;
use App\Models\Proyecto;
use App\Http\Requests\StoreCuentaRequest;
use App\Http\Requests\UpdateCuentaRequest;
use Illuminate\Http\Request;

class CuentaController extends Controller
{
    /**
     * Muestra las cuentas ACTIVAS de un proyecto.
     * (Cualquier miembro puede 'ver')
     */
    public function index(Request $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        $estado = $request->query('estado', 'activa');
        $tipo = $request->query('tipo');

        $query = $proyecto->cuentas();

        if ($estado) {
            $query->where('estado', $estado);
        }

        if ($tipo) {
            $query->where('tipo', $tipo);
        }

        $cuentas = $query->get();

        return response()->json($cuentas);
    }

    public function store(StoreCuentaRequest $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden añadir cuentas a este proyecto.');

        $datos = $request->validated();
        $datos['saldo_actual'] = $datos['saldo_inicial'];
        $datos['estado'] = 'activa';

        $cuenta = $proyecto->cuentas()->create($datos);

        return response()->json($cuenta, 201);
    }

    public function show(Request $request, Proyecto $proyecto, Cuenta $cuenta)
    {
        $this->verificarCuenta($proyecto, $cuenta);
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        return response()->json($cuenta);
    }

    public function update(UpdateCuentaRequest $request, Proyecto $proyecto, Cuenta $cuenta)
    {
        $this->verificarCuenta($proyecto, $cuenta);
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden editar cuentas.');

        $datos = $request->validated();

        // Si se actualiza el saldo inicial, actualizamos también el saldo actual
        if (isset($datos['saldo_inicial']) && !$cuenta->transacciones()->exists()) {
            $datos['saldo_actual'] = $datos['saldo_inicial'];
        }

        $cuenta->update($datos);

        return response()->json($cuenta);
    }

    public function destroy(Request $request, Proyecto $proyecto, Cuenta $cuenta)
    {
        $this->verificarCuenta($proyecto, $cuenta);
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden inactivar/eliminar cuentas.');

        if ($cuenta->transacciones()->exists()) {
            // Si tiene transacciones, la marcamos como inactiva
            $cuenta->update(['estado' => 'inactiva']);
            return response()->json(['message' => 'La cuenta ha sido marcada como inactiva']);
        }

        $cuenta->delete();
        return response()->noContent();
    }

    public function updateEstado(Request $request, Proyecto $proyecto, Cuenta $cuenta)
    {
        $this->verificarCuenta($proyecto, $cuenta);
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'No autorizado');

        $request->validate([
            'estado' => ['required', 'string', 'in:activa,inactiva,cerrada']
        ]);

        $cuenta->update(['estado' => $request->estado]);

        return response()->json([
            'message' => 'Estado de la cuenta actualizado',
            'estado' => $cuenta->estado
        ]);
    }

    /**
     * Verifica que la cuenta pertenezca al proyecto
     */
    protected function verificarCuenta(Proyecto $proyecto, Cuenta $cuenta): void
    {
        if ($cuenta->propietario_id !== $proyecto->id || $cuenta->propietario_type !== 'proyecto') {
            abort(404, 'La cuenta no pertenece a este proyecto');
        }
    }
}
