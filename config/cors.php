<?php

return [

    /*
     * You can enable CORS for 1 or multiple paths.
     * Example: ['api/*']
     */
    'paths' => ['api/*'],

    /*
     * Matches the request method. Only allow safe and necessary HTTP methods.
     * SECURITY: Restrict to GET, POST, PUT, DELETE, OPTIONS instead of '*'
     */
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],

    /*
     * Matches the request origin. Configure based on environment for security.
     * SECURITY: Never use '*' in production - always specify explicit origins
     */
    'allowed_origins' => env('CORS_ALLOWED_ORIGINS')
        ? explode(',', env('CORS_ALLOWED_ORIGINS'))
        : ['http://localhost:5173', 'http://controlapp:8000'],

    /*
     * Sets the Access-Control-Allow-Headers response header.
     * SECURITY: Only allow necessary headers, not '*'
     * 
     * Common headers needed for API:
     * - Authorization: Bearer token authentication
     * - Content-Type: Request body format
     * - X-Requested-With: XHR detection
     * - Accept: Response format preference
     */
    'allowed_headers' => [
        'Authorization',
        'Content-Type',
        'Accept',
        'Origin',
        'X-Requested-With',
        'X-CSRF-Token',
    ],

    /*
     * Sets the Access-Control-Expose-Headers response header with these headers.
     * SECURITY: Only expose headers that are safe and necessary
     */
    'exposed_headers' => [
        'X-Total-Count',
        'X-Page-Count',
        'X-Current-Page',
    ],

    /*
     * Sets the Access-Control-Max-Age response header when > 0.
     * This tells browsers how long they can cache preflight responses.
     * 86400 = 24 hours
     */
    'max_age' => 86400,

    /*
     * Sets the Access-Control-Allow-Credentials header.
     * SECURITY: Set to true to allow cookies/credentials with CORS requests
     * When true, origins cannot be '*' and must be explicit
     */
    'supports_credentials' => true,

];
