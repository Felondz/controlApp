<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserPreferencesController extends Controller
{
    /**
     * Update the user's global theme preference.
     */
    public function updateTheme(Request $request)
    {
        $validated = $request->validate([
            'global_theme' => 'required|in:purple-modern,ocean-blue,forest-green,scarlet-red,amber-gold,pink-rose',
        ]);

        $user = $request->user();
        $user->update([
            'global_theme' => $validated['global_theme'],
        ]);

        // Return the updated user data back to Inertia
        return back()->with([
            'success' => __('preferences.theme_updated'),
        ]);
    }
}
