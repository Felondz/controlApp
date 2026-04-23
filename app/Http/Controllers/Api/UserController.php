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

        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Actualizar el locale del usuario autenticado
        $user->update(['locale' => $validated['locale']]);

        return response()->json([
            'success' => true,
            'message' => 'Idioma actualizado correctamente',
            'locale' => $user->locale,
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

        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        // Merge with existing settings
        /** @var mixed $currentSettingsRaw */
        $currentSettingsRaw = $user->settings;
        $currentSettings = is_array($currentSettingsRaw) ? $currentSettingsRaw : [];

        $newSettings = array_merge($currentSettings, (array)$validated['settings']);

        $user->update(['settings' => $newSettings]);

        return response()->json([
            'success' => true,
            'message' => 'Preferencias actualizadas correctamente',
            'settings' => $user->settings,
        ]);
    }

    /**
     * Update the user's interface theme (accent colors).
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateTheme(Request $request)
    {
        $themeKey = $request->has('global_theme') ? 'global_theme' : 'theme';

        $request->validate([
            $themeKey => 'required|string|max:50',
        ]);

        $themeValue = $request->input($themeKey);

        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $user->update(['global_theme' => $themeValue]);

        return response()->json([
            'success' => true,
            'message' => 'Tema actualizado correctamente',
            'global_theme' => $user->global_theme,
        ]);
    }
}
