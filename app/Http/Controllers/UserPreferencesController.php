<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserPreferencesController extends Controller
{
    /**
     * Mark a tour as completed in the user's settings.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function completeTour(Request $request)
    {
        $validated = $request->validate([
            'tour' => 'required|string',
        ]);

        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Recargar el usuario para asegurarnos de tener la versión más fresca de la BD
        $user->refresh();
        
        /** @var mixed $rawSettings */
        $rawSettings = $user->settings;
        $settings = is_array($rawSettings) ? $rawSettings : [];
        
        /** @var array<string, mixed> $completedTours */
        $completedTours = $settings['completed_tours'] ?? [];

        if (!in_array($validated['tour'], (array)$completedTours)) {
            $completedTours[] = $validated['tour'];
            
            // Re-asignación explícita para forzar el Cast de JSON en el guardado
            $settings['completed_tours'] = $completedTours;
            $user->update(['settings' => $settings]);
            
            Log::info("DEBUG: Tour '{$validated['tour']}' persistido para usuario #{$user->id}. Nuevo estado: " . json_encode($user->settings));
        }

        if ($request->hasHeader('X-Inertia')) {
            return back();
        }

        return response()->json(['success' => true, 'settings' => $user->settings]);
    }

    /**
     * Update the user's interface theme (accent colors).
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function updateTheme(Request $request)
    {
        // Support both 'theme' and 'global_theme' for compatibility
        $themeKey = $request->has('global_theme') ? 'global_theme' : 'theme';

        $request->validate([
            $themeKey => 'required|string|max:50',
        ]);

        $themeValue = $request->input($themeKey);

        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            return redirect()->route('login');
        }

        $user->update(['global_theme' => $themeValue]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'global_theme' => $user->global_theme
            ]);
        }

        return back()->with('success', 'Tema actualizado.');
    }

    /**
     * Update the user's dashboard settings (widgets layout).
     * 
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateDashboardSettings(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login');
        }

        // Merge existing settings with new ones
        /** @var mixed $currentSettingsRaw */
        $currentSettingsRaw = $user->settings;
        $currentSettings = is_array($currentSettingsRaw) ? $currentSettingsRaw : [];
        
        $newSettings = array_merge($currentSettings, (array)$validated['settings']);

        $user->update(['settings' => $newSettings]);

        return back()->with('success', 'Configuración del dashboard actualizada.');
    }
}
