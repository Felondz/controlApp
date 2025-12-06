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

        // Fetch both owned accounts and associated (linked) accounts
        $owned = $proyecto->cuentas();
        $linked = $proyecto->cuentasAsociadas();

        if ($estado) {
            $owned->where('estado', $estado);
            $linked->where('estado', $estado);
        }

        if ($tipo) {
            $owned->where('tipo', $tipo);
            $linked->where('tipo', $tipo);
        }

        $cuentas = $owned->get()->merge($linked->get());

        return response()->json($cuentas);
    }

    public function store(StoreCuentaRequest $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden añadir cuentas a este proyecto.');

        $datos = $request->validated();

        // El saldo actual inicia igual al saldo inicial
        // NO sumar valor_nomina aquí, ya que es un valor futuro/esperado
        $datos['saldo_actual'] = $datos['saldo_inicial'];
        $datos['estado'] = 'activa';

        // If it's a personal project, the owner is the USER
        if ($proyecto->esPersonal()) {
            $cuenta = $request->user()->cuentas()->create($datos);
            // Auto-link to the project
            $proyecto->cuentasAsociadas()->attach($cuenta->id);
        } else {
            // Otherwise, the owner is the PROJECT
            $cuenta = $proyecto->cuentas()->create($datos);
        }

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

        // Validar que el saldo sea cero antes de eliminar/inactivar
        if ($cuenta->saldo != 0) {
            return response()->json([
                'message' => 'No se puede eliminar o inactivar una cuenta con saldo. Debes ajustar el saldo a cero antes de continuar.',
                'saldo_actual' => $cuenta->saldo
            ], 422);
        }

        if ($cuenta->transacciones()->exists()) {
            // Si tiene transacciones, la marcamos como inactiva
            $cuenta->update(['estado' => 'inactiva']);
            return response()->json(['message' => 'La cuenta ha sido marcada como inactiva']);
        }

        try {
            $cuenta->delete();
            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar la cuenta: ' . $e->getMessage()], 500);
        }
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
            'message' => 'Estado de la cuenta actualizado',//esto necesitaria ser traducido
            'estado' => $cuenta->estado
        ]);
    }

    /**
     * Verifica que la cuenta pertenezca al proyecto
     */
    protected function verificarCuenta(Proyecto $proyecto, Cuenta $cuenta): void
    {
        // Check 1: Owned by Project
        $isProjectOwned = $cuenta->propietario_id === $proyecto->id &&
            in_array($cuenta->propietario_type, ['proyecto', 'App\Models\Proyecto']);

        // Check 2: Linked to Project (via pivot)
        $isLinked = $proyecto->cuentasAsociadas()->where('cuenta_id', $cuenta->id)->exists();

        if (!$isProjectOwned && !$isLinked) {
            abort(404, 'La cuenta no pertenece a este proyecto');
        }
    }

    /**
     * Obtiene el balance total del proyecto (suma de saldos de cuentas).
     */
    public function balance(Request $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        $ownedBalance = $proyecto->cuentas()->sum('saldo_actual');
        $linkedBalance = $proyecto->cuentasAsociadas()->sum('saldo_actual');

        // Count pending bills (transactions with status 'pending')
        $pendingBills = $proyecto->transacciones()
            ->where('status', 'pending')
            ->count();

        // Count completed transactions (status 'completed') - maybe just recent ones?
        // The widget says "Recientes (Mes)", so let's filter by current month.
        $transactionCount = $proyecto->transacciones()
            ->where('status', 'completed')
            ->whereMonth('fecha', now()->month)
            ->whereYear('fecha', now()->year)
            ->count();

        return response()->json([
            'balance' => $ownedBalance + $linkedBalance,
            'pending_bills' => $pendingBills,
            'transaction_count' => $transactionCount
        ]);
    }
}
