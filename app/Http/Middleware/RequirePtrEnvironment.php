<?php declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware that restricts access to PTR-only routes.
 * Routes protected by this middleware will return 404 in non-staging environments.
 */
class RequirePtrEnvironment
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!app()->environment('staging') && !env('PTR_MODE', false)) {
            abort(404);
        }

        return $next($request);
    }
}
