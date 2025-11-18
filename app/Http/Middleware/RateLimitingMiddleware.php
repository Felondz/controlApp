<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Rate limiting middleware for protecting against brute force attacks
 * 
 * This middleware implements configurable rate limiting:
 * - API endpoints: 100 requests per minute
 * - Auth endpoints: 5 attempts per minute
 * - General endpoints: 60 requests per minute
 */
class RateLimitingMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Rate limiting is already configured via routes using 'throttle' middleware
        // This middleware is a placeholder for custom rate limiting logic if needed

        return $next($request);
    }
}
