<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Actualizar el idioma preferido del usuario autenticado.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateLocale(Request $request)
    {
        // Validar que el locale sea válido
        $validated = $request->validate([
            'locale' => 'required|in:es,en,pt',
        ]);

        // Actualizar el locale del usuario autenticado
        Auth::user()->update(['locale' => $validated['locale']]);

        return response()->json([
            'success' => true,
            'message' => 'Idioma actualizado correctamente',
            'locale' => Auth::user()->locale,
        ]);
    }

    /**
     * Update user dashboard preferences/settings.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateDashboardPreferences(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        $user = Auth::user();
        
        // Merge with existing settings
        $currentSettings = $user->settings ?? [];
        $newSettings = array_merge($currentSettings, $validated['settings']);

        $user->update(['settings' => $newSettings]);

        return response()->json([
            'success' => true,
            'message' => 'Preferencias actualizadas correctamente',
            'settings' => $user->settings,
        ]);
    }
}
