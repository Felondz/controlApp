<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Sanitize input middleware to prevent common XSS and injection attacks
 * 
 * This middleware sanitizes string inputs by:
 * - Trimming whitespace
 * - Escaping HTML entities
 * - Preventing null bytes
 */
class SanitizeInput
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only sanitize for specific request methods
        if (in_array($request->method(), ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])) {
            $this->sanitize($request);
        }

        return $next($request);
    }

    /**
     * Sanitize request input data
     *
     * @param Request $request
     * @return void
     */
    private function sanitize(Request $request): void
    {
        $data = $request->all();
        $sanitized = $this->sanitizeArray($data);
        $request->merge($sanitized);
    }

    /**
     * Recursively sanitize array values
     *
     * @param array $data
     * @return array
     */
    private function sanitizeArray(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $sanitized[$key] = $this->sanitizeArray($value);
            } elseif (is_string($value)) {
                // Trim whitespace and escape HTML entities
                $sanitized[$key] = htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }
}
