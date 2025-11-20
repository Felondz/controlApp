<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetUserLocale
{
    /**
     * Handle an incoming request.
     * 
     * Implementa cascada de preferencias de idioma:
     * 1. Base de Datos (usuario autenticado)
     * 2. Sesión (selector público o preferencia guardada)
     * 3. Fallback (config por defecto)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Prioridad 1: Base de Datos (usuario autenticado)
        if (Auth::check() && Auth::user()->locale) {
            app()->setLocale(Auth::user()->locale);
        }
        // Prioridad 2: Sesión (selector público o preferencia guardada)
        elseif (session()->has('locale')) {
            app()->setLocale(session('locale'));
        }
        // Prioridad 3: Fallback (mantener config por defecto)
        // No hacer nada, Laravel usa config('app.locale')

        return $next($request);
    }
}
