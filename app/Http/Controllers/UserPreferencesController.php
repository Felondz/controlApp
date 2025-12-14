<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserPreferencesController extends Controller
{
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
