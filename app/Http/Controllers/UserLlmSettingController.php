<?php

namespace App\Http\Controllers;

use App\Services\LlmSettingsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class UserLlmSettingController extends Controller
{
    public function __construct(private LlmSettingsService $llmSettingsService) {}

    /**
     * Store or update an LLM provider configuration.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'provider' => ['required', 'string', 'in:openai,anthropic,gemini,test_sprite,custom'],
            'api_key' => ['nullable', 'string'],
            'default_model' => ['nullable', 'string'],
            'is_active' => ['boolean', 'nullable'],
        ]);

        $existing = $request->user()->llmSettings()->where('provider', $validated['provider'])->first();
        $isActive = $validated['is_active'] ?? true;

        // Require API Key if no existing setting is found AND the user wants the provider to be active
        if (!$existing && empty($validated['api_key']) && $isActive) {
            return Redirect::back()->withErrors(['api_key' => 'La API Key es requerida para habilitar este proveedor de IA.']);
        }

        $this->llmSettingsService->upsertSetting(
            $request->user(),
            $validated['provider'],
            empty($validated['api_key']) ? null : $validated['api_key'],
            $validated['default_model'] ?? null,
            $validated['is_active'] ?? true
        );

        return Redirect::route('profile.edit')->with('status', 'llm-settings-updated');
    }

    /**
     * Delete an LLM provider configuration.
     */
    public function destroy(Request $request, string $provider): RedirectResponse
    {
        $this->llmSettingsService->deleteSetting($request->user(), $provider);

        return Redirect::route('profile.edit')->with('status', 'llm-settings-deleted');
    }
}
