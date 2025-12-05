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
        try {
            $user = Auth::user();

            // Determine whose accounts to show
            $targetUserIds = [$user->id];

            // If user is admin, they should also see owner's accounts
            // Using esAdmin because esAdminDe seemed to cause issues in testing, 
            // and previous tests passed with esAdmin.
            if ($proyecto->user_id !== $user->id && $user->esAdminDe($proyecto)) {
                $targetUserIds[] = $proyecto->user_id;
            }

            // Get personal accounts owned by the target users
            // Check for both the alias ('usuario') and the full class name ('App\Models\User')
            // to handle potential legacy data or mixed states.
            $types = [
                (new \App\Models\User)->getMorphClass(),
                \App\Models\User::class
            ];

            $cuentas = Cuenta::whereIn('propietario_type', $types)
                ->whereIn('propietario_id', $targetUserIds)
                ->whereDoesntHave('proyectosAsociados', function ($query) use ($proyecto) {
                    $query->where('proyecto_id', $proyecto->id);
                })
                ->get();

            return response()->json($cuentas);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error in ProjectAccountController::available: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
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

        // Verify ownership:
        // 1. Account belongs to authenticated user
        // OR
        // 2. User is admin AND account belongs to project owner
        $types = [
            (new \App\Models\User)->getMorphClass(),
            \App\Models\User::class
        ];

        $isOwner = in_array($cuenta->propietario_type, $types) && $cuenta->propietario_id === $user->id;
        $isProjectOwnerAccountAndAdmin = $user->esAdminDe($proyecto) &&
            in_array($cuenta->propietario_type, $types) &&
            $cuenta->propietario_id === $proyecto->user_id;

        if (!$isOwner && !$isProjectOwnerAccountAndAdmin) {
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
