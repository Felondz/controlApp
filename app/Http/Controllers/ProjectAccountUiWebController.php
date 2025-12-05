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

        // 3. Verify balance is zero
        if ($account->saldo_actual != 0) {
            return redirect()->back()->withErrors(['error' => 'La cuenta debe tener un saldo de 0 para poder ser eliminada. Por favor ajusta el saldo mediante una transacción.']);
        }

        \Illuminate\Support\Facades\Log::info('Attempting to delete account', ['account_id' => $account->id, 'project_id' => $proyecto->id]);

        try {
            // Optional: Manually delete transactions if not cascading
            $account->transacciones()->delete();
            $account->delete();
            \Illuminate\Support\Facades\Log::info('Account deleted successfully');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error deleting account: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error al eliminar la cuenta: ' . $e->getMessage()]);
        }

        return redirect()->back()->with('success', 'Cuenta eliminada correctamente.');
    }
}
