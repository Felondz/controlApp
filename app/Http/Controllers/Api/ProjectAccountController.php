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

        // Get the user's personal finance project
        $personalProject = $user->proyectos()->where('es_personal', true)->first();

        if (!$personalProject) {
            // If no personal project exists, return empty
            return response()->json([]);
        }

        // Get personal accounts that are NOT already linked to this project
        $cuentas = Cuenta::where('propietario_type', 'proyecto')
            ->where('propietario_id', $personalProject->id)
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

        // Get the user's personal finance project
        $personalProject = $user->proyectos()->where('es_personal', true)->first();

        if (!$personalProject) {
            return response()->json(['message' => 'No personal finance project found'], 403);
        }

        // Verify the account belongs to the user's personal project
        if ($cuenta->propietario_type !== 'proyecto' || $cuenta->propietario_id !== $personalProject->id) {
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
