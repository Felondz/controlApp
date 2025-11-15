<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class EnsureUserIsSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Revisamos si el usuario está logueado Y si tiene la bandera
        //    (Este middleware SIEMPRE debe correr DESPUÉS de 'auth:sanctum')
        if (!$request->user() || !$request->user()->is_super_admin) {

            // 2. Si no es Super Admin, lo bloqueamos.
            abort(403, 'Acceso denegado. Esta acción es solo para Súper Administradores.');
        }

        // 3. Si SÍ es Super Admin, dejamos que la petición continúe.
        return $next($request);
    }
}
