<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\File;

use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Determine locale: User preference > Browser > Default (en)
        /** @phpstan-ignore-next-line */
        $locale = $request->user()?->locale
            ?? $request->getPreferredLanguage(['es', 'en'])
            ?? 'en';

        // Set the application locale
        app()->setLocale($locale);

        // Cargar las traducciones del archivo JSON correspondiente
        $translations = $this->loadTranslations($locale);

        // Optimizar carga de usuario
        $user = $request->user();
        $userData = null;

        if ($user) {
            // Recargar datos frescos del usuario para evitar props desactualizadas tras un post
            $user->refresh();
            $unreadData = $user->getUnreadData();
            
            $userData = [
                ...$user->toArray(),
                'settings' => $user->settings ?? ['completed_tours' => []],
                'global_theme' => $user->global_theme ?? 'purple-modern',
                'enabled_tools' => $user->enabled_tools ?? [],
                'unread_messages_count' => $unreadData['unread_messages_count'],
                'unread_projects' => $unreadData['unread_projects'],
                'pending_invitations' => $unreadData['pending_invitations'],
                'pending_invitations_count' => $unreadData['pending_invitations_count'],
                'is_ai_enabled' => (bool) ($user->is_ai_enabled ?? true),
                'has_active_ai' => (bool) ($user->is_ai_enabled ?? true) && $user->llmSettings()->where('is_active', true)->whereNotNull('api_key')->exists(),
                'is_super_admin' => (bool) $user->is_super_admin,
            ];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $userData,
            ],
            // Compartir las traducciones como prop global
            'locale' => $locale,
            'translations' => $translations,
            'old' => function () use ($request) {
                return $request->session()->get('_old_input', []);
            },
            'is_ptr' => config('app.env') === 'staging' || filter_var(env('PTR_MODE', false), FILTER_VALIDATE_BOOLEAN),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'status' => fn() => $request->session()->get('status'),
            ],
        ];
    }

    /**
     * Cargar las traducciones desde el archivo JSON del idioma especificado.
     *
     * @param string $locale Código del idioma (ej: 'es', 'en')
     * @return array Las traducciones cargadas
     */
    private function loadTranslations(string $locale): array
    {
        $langPath = resource_path("lang/{$locale}/{$locale}.json");

        if (File::exists($langPath)) {
            return json_decode(File::get($langPath), true) ?? [];
        }

        // Fallback a inglés si el idioma solicitado no existe
        $fallbackPath = resource_path('lang/en/en.json');
        if (File::exists($fallbackPath)) {
            return json_decode(File::get($fallbackPath), true) ?? [];
        }

        return [];
    }
}
