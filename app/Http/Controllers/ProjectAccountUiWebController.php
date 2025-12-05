<?php

namespace App\Http\Controllers;

use App\Models\Cuenta;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectAccountUiWebController extends Controller
{
    /**
     * Unlink a personal account from a project.
     * Note: This is for unlinking a SHARED account, not deleting a project account.
     */

    public function unlink(Request $request, Proyecto $proyecto, Cuenta $account)
    {
        if (!$request->user()->esAdminDe($proyecto)) {
            abort(403);
        }

        $proyecto->cuentasAsociadas()->detach($account->id);

        return redirect()->back()->with('success', 'Cuenta desvinculada correctamente.');
    }

    /**
     * Delete a project account.
     */
    /**
     * Delete a project account.
     */
    public function destroy(Request $request, Proyecto $proyecto, $accountId)
    {
        $account = Cuenta::find($accountId);

        if (!$account) {
            return redirect()->back()->withErrors(['error' => 'Cuenta no encontrada.']);
        }

        // 1. Authorization
        if (!$request->user()->esAdminDe($proyecto)) {
            abort(403, 'Unauthorized');
        }

        // 2. Verify account belongs to project
        if ($account->propietario_type !== 'App\Models\Proyecto' || $account->propietario_id !== $proyecto->id) {
            abort(403, 'Cannot delete account not owned by project');
        }

        // 3. Verify balance is zero - CRITICAL for balance integrity
        if ($account->saldo != 0) {
            return redirect()->back()->withErrors([
                'error' => 'No se puede eliminar o inactivar una cuenta con saldo. Debes ajustar el saldo a cero mediante una transacción antes de continuar. Saldo actual: ' . number_format($account->saldo, 2)
            ]);
        }

        try {
            if ($account->transacciones()->exists()) {
                // Si tiene transacciones, marcar como inactiva (preserva historial)
                $account->update(['estado' => 'inactiva']);
                return redirect()->back()->with('success', 'La cuenta ha sido marcada como inactiva.');
            }

            // Sin transacciones, eliminar completamente
            $account->delete();
            return redirect()->back()->with('success', 'Cuenta eliminada correctamente.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error deleting account: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error al eliminar la cuenta: ' . $e->getMessage()]);
        }
    }
}
