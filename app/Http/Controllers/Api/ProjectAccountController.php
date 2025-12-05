<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Proyecto;
use App\Models\Cuenta;
use Illuminate\Support\Facades\Auth;

class ProjectAccountController extends Controller
{
    /**
     * List available personal accounts to link to the project.
     */
    public function available(Proyecto $proyecto)
    {
        $user = Auth::user();

        // Get personal accounts owned by the user
        $cuentas = Cuenta::where('propietario_type', \App\Models\User::class)
            ->where('propietario_id', $user->id)
            ->whereDoesntHave('proyectosAsociados', function ($query) use ($proyecto) {
                $query->where('proyecto_id', $proyecto->id);
            })
            ->get();

        return response()->json($cuentas);
    }

    /**
     * Link a personal account to the project.
     */
    public function link(Request $request, Proyecto $proyecto)
    {
        $request->validate([
            'cuenta_id' => 'required|exists:cuentas,id'
        ]);

        $user = Auth::user();
        $cuenta = Cuenta::findOrFail($request->cuenta_id);

        // Verify the account belongs to the user
        if ($cuenta->propietario_type !== \App\Models\User::class || $cuenta->propietario_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Link account
        $proyecto->cuentasAsociadas()->syncWithoutDetaching([$cuenta->id]);

        return response()->json(['message' => 'Account linked successfully']);
    }

    /**
     * Unlink a personal account from the project.
     */
    public function unlink(Proyecto $proyecto, Cuenta $cuenta)
    {
        // Verify the account is actually linked
        if (!$proyecto->cuentasAsociadas()->where('cuenta_id', $cuenta->id)->exists()) {
            return response()->json(['message' => 'Account not linked to this project'], 404);
        }

        // Unlink
        $proyecto->cuentasAsociadas()->detach($cuenta->id);

        return response()->json(['message' => 'Account unlinked successfully']);
    }
}
