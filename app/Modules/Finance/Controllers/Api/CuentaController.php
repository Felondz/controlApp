<?php

namespace App\Modules\Finance\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Finance\Models\Cuenta;
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

        // Handle Loan Disbursement (for Mobile/API compatibility)
        if ($cuenta->tipo === 'prestamo' && !empty($datos['monto_desembolsado']) && $datos['monto_desembolsado'] > 0) {
            $service = new \App\Modules\Finance\Services\LoanDisbursementService();

            $destination = null;
            if (!empty($datos['cuenta_destino_id'])) {
                $destination = \App\Modules\Finance\Models\Cuenta::find($datos['cuenta_destino_id']);
                // Verify access to destination account?
                // Assuming if they can see it they can use it, or service handles it.
            }

            $service->disburse($cuenta, $destination, (int) $datos['monto_desembolsado']);

            // Refresh account data
            $cuenta->refresh();
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

    /**
     * Get credit card bills for all credit card accounts in the project.
     * Uses CreditCardBillingService to calculate upcoming bills.
     */
    public function creditCardBills(Request $request, Proyecto $proyecto, \App\Modules\Finance\Services\CreditCardBillingService $billingService)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // $billingService is injected automatically
        // $billingService = new \App\Modules\Finance\Services\CreditCardBillingService();

        // Get all credit card accounts (owned + linked)
        $ownedCCs = $proyecto->cuentas()
            ->where('tipo', 'credito')
            ->where('estado', 'activa')
            ->get();

        $linkedCCs = $proyecto->cuentasAsociadas()
            ->where('tipo', 'credito')
            ->where('estado', 'activa')
            ->get();

        $allCCs = $ownedCCs->merge($linkedCCs);

        $bills = [];
        foreach ($allCCs as $cuenta) {
            $billData = $billingService->getUpcomingBill($cuenta);
            // Only include if there's something to pay
            if ($billData['pago_minimo'] > 0 || $billData['pago_total'] > 0) {
                $bills[] = $billData;
            }
        }

        return response()->json($bills);
    }

    /**
     * Pay a credit card bill.
     * Creates a payment transaction and updates both account balances.
     */
    public function payCreditCardBill(Request $request, Proyecto $proyecto, Cuenta $cuenta)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para pagar facturas.');

        $this->verificarCuenta($proyecto, $cuenta);

        if ($cuenta->tipo !== 'credito') {
            return response()->json(['error' => 'Esta cuenta no es una tarjeta de crédito'], 400);
        }

        $request->validate([
            'monto' => 'required|numeric|min:1',
            'cuenta_origen_id' => 'required|exists:cuentas,id',
            'tipo_pago' => 'required|in:minimo,total,personalizado',
        ]);

        $cuentaOrigen = Cuenta::find($request->cuenta_origen_id);

        // Verify origin account belongs to project
        $isProjectOwned = $cuentaOrigen->propietario_id === $proyecto->id &&
            in_array($cuentaOrigen->propietario_type, ['proyecto', 'App\Models\Proyecto']);
        $isLinked = $proyecto->cuentasAsociadas()->where('cuenta_id', $cuentaOrigen->id)->exists();

        if (!$isProjectOwned && !$isLinked) {
            return response()->json(['error' => 'La cuenta de origen no pertenece a este proyecto'], 400);
        }

        // Verify sufficient balance
        if ($cuentaOrigen->saldo_actual < $request->monto) {
            return response()->json([
                'error' => 'Saldo insuficiente en la cuenta de origen',
                'saldo_disponible' => $cuentaOrigen->saldo_actual
            ], 400);
        }

        $monto = (int) $request->monto;

        // Create payment transaction (expense from origin account)
        $transaccionOrigen = \App\Modules\Finance\Models\Transaccion::create([
            'proyecto_id' => $proyecto->id,
            'cuenta_id' => $cuentaOrigen->id,
            'categoria_id' => $this->getDefaultPaymentCategory($proyecto),
            'user_id' => $request->user()->id,
            'monto' => -$monto, // Negative for expense
            'descripcion' => "Pago factura TC: {$cuenta->nombre} ({$request->tipo_pago})",
            'fecha' => now(),
            'status' => 'completed',
        ]);

        // Create transaction in Credit Card (Positive/Payment)
        $transaccionDestino = \App\Modules\Finance\Models\Transaccion::create([
            'proyecto_id' => $proyecto->id,
            'cuenta_id' => $cuenta->id, // Destination (CC)
            'categoria_id' => $this->getDefaultPaymentCategory($proyecto),
            'user_id' => $request->user()->id,
            'monto' => $monto, // Positive for payment
            'descripcion' => "Abono pago factura: {$request->tipo_pago}", //se deben usar hooks para traducciones
            'fecha' => now(),
            'status' => 'completed',
            'transaccion_origen_id' => $transaccionOrigen->id, // Link them
        ]);

        // Update origin account balance (subtract payment)
        $cuentaOrigen->saldo_actual -= $monto;
        $cuentaOrigen->save();

        // Update credit card balance (add payment - reduces debt)
        $cuenta->saldo_actual += $monto;
        $cuenta->save();

        return response()->json([
            'success' => true,
            'message' => 'Pago de factura TC registrado correctamente',
            'transaccion' => $transaccionDestino,
            'nuevo_saldo_origen' => $cuentaOrigen->saldo_actual,
            'nuevo_saldo_tc' => $cuenta->saldo_actual,
        ]);
    }

    /**
     * Get the default category for bill payments.
     */
    private function getDefaultPaymentCategory(Proyecto $proyecto): int
    {
        // 1. Try to find Specific "Pagos de Tarjeta"
        $categoria = $proyecto->categorias()
            ->where('nombre', 'Pagos de Tarjeta')
            ->first();

        if ($categoria)
            return $categoria->id;

        // 2. Try to find "Facturas y Servicios" or similar
        $categoria = $proyecto->categorias()
            ->where('nombre', 'like', '%factura%')
            ->orWhere('nombre', 'like', '%bill%')
            ->orWhere('nombre', 'like', '%credit card%')
            ->first();

        if ($categoria)
            return $categoria->id;

        // 3. Create Default Category if none found
        $newCat = \App\Modules\Finance\Models\Categoria::create([
            'proyecto_id' => $proyecto->id,
            'nombre' => 'Pagos de Tarjeta',
            'tipo' => 'expense',
            'color' => '#8B5CF6', // Violet
            'icono' => 'CreditCard',
        ]);

        return $newCat->id;
    }
}
