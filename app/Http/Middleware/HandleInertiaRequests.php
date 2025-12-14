<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\File;

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
        $locale = $request->user()->locale
            ?? $request->getPreferredLanguage(['es', 'en'])
            ?? 'en';

        // Set the application locale
        app()->setLocale($locale);

        // Cargar las traducciones del archivo JSON correspondiente
        $translations = $this->loadTranslations($locale);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    ...$request->user()->toArray(),
                    'global_theme' => $request->user()->global_theme ?? 'purple-modern',
                    'enabled_tools' => $request->user()->enabled_tools ?? [],
                ] : null,
            ],
            // Compartir las traducciones como prop global
            'locale' => $locale,
            'translations' => $translations,
            'old' => function () use ($request) {
                return $request->session()->getOldInput();
            },
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
