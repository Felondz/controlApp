<?php declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasProjectAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is not authenticated, let 'auth' middleware handle it
        if (!$user) {
            return $next($request);
        }

        // 1. Check for 'proyecto' route parameter (UUID)
        $proyecto = $request->route('proyecto');

        // If the parameter is already resolved to a model via implicit binding
        if ($proyecto instanceof Proyecto) {
            if (!$user->esMiembroDe($proyecto)) {
                return $this->forbiddenResponse($request);
            }
            return $next($request);
        }

        // If it's still a string (UUID/ID)
        if (is_string($proyecto)) {
            $proyectoModel = Proyecto::where('uuid', $proyecto)
                ->orWhere('id', $proyecto)
                ->first();

            if (!$proyectoModel || !$user->esMiembroDe($proyectoModel)) {
                return $this->forbiddenResponse($request);
            }
        }

        return $next($request);
    }

    /**
     * Return a forbidden response based on request type.
     */
    private function forbiddenResponse(Request $request): Response
    {
        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json([
                'message' => 'No tienes permiso para acceder a este proyecto.'
            ], 403);
        }

        abort(403, 'No tienes permiso para acceder a este proyecto.');
    }
}
