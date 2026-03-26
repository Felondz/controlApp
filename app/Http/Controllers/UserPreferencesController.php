<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserPreferencesController extends Controller
{
    /**
     * Mark a tour as completed in the user's settings.
     */
    public function completeTour(Request $request)
    {
        $validated = $request->validate([
            'tour' => 'required|string',
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        // Recargar el usuario para asegurarnos de tener la versión más fresca de la BD
        $user->refresh();
        
        $settings = $user->settings ?? [];
        if (!is_array($settings)) $settings = [];
        
        $completedTours = $settings['completed_tours'] ?? [];

        if (!in_array($validated['tour'], $completedTours)) {
            $completedTours[] = $validated['tour'];
            
            // Re-asignación explícita para forzar el Cast de JSON en el guardado
            $settings['completed_tours'] = $completedTours;
            $user->settings = $settings;
            $user->save();
            
            Log::info("DEBUG: Tour '{$validated['tour']}' persistido para usuario #{$user->id}. Nuevo estado: " . json_encode($user->settings));
        }

        if ($request->hasHeader('X-Inertia')) {
            return back();
        }

        return response()->json(['success' => true, 'settings' => $user->settings]);
    }

    /**
     * Update the user's interface theme (light/dark/system).
     */
    public function updateTheme(Request $request)
    {
        $request->validate([
            'theme' => 'required|in:light,dark,system',
        ]);

        $user = $request->user();
        $user->update(['global_theme' => $request->theme]);

        return back()->with('success', 'Tema actualizado.');
    }

    /**
     * Update the user's dashboard settings (widgets layout).
     */
    public function updateDashboardSettings(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        $user = $request->user();

        // Merge existing settings with new ones
        $currentSettings = $user->settings ?? [];
        $newSettings = array_merge($currentSettings, $validated['settings']);

        $user->settings = $newSettings;
        $user->save();

        return back()->with('success', 'Configuración del dashboard actualizada.');
    }
}
