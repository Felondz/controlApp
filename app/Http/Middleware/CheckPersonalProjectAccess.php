<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Proyecto;

class CheckPersonalProjectAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $proyectoId = $request->route('proyecto');

        if ($proyectoId) {
            $proyecto = Proyecto::find($proyectoId);

            if ($proyecto && $proyecto->esPersonal()) {
                // Solo el propietario puede acceder a su proyecto personal
                if (!Auth::check() || $proyecto->user_id !== Auth::user()->id) {
                    return response()->json([
                        'message' => 'No tienes permiso para acceder a este proyecto personal.'
                    ], 403);
                }
            }
        }

        return $next($request);
    }
}
