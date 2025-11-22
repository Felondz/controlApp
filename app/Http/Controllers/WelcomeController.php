<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\App;

class WelcomeController extends Controller
{
    public function __invoke()
    {
        // Cargar las traducciones
        $locale = App::getLocale();
        $translations = [];
        
        // Cargar el archivo de idioma correspondiente
        $file = resource_path("lang/{$locale}.json");
        
        if (File::exists($file)) {
            $translations = json_decode(File::get($file), true);
        } else {
            // Si no existe el archivo de idioma, cargar el inglés por defecto
            $file = resource_path('lang/en.json');
            if (File::exists($file)) {
                $translations = json_decode(File::get($file), true);
            }
        }

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => app()->version(),
            'phpVersion' => PHP_VERSION,
            'translations' => $translations
        ]);
    }
}
