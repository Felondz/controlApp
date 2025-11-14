<?php

return [

    /*
     * You can enable CORS for 1 or multiple paths.
     * Example: ['api/*']
     */
    'paths' => ['api/*', '*'],  // '*' para permitir Vite assets en dev

    /*
     * Matches the request method. `['*']` allows all methods.
     */
    'allowed_methods' => ['*'],

    /*
     * Matches the request origin. `['*']` allows all origins. Wildcards can be used, eg `*.mydomain.com`
     */
    'allowed_origins' => ['http://localhost:5173', 'http://controlapp:8000'],  // Vite + tu app

    /*
     * Sets the Access-Control-Allow-Headers response header. `['*']` allows all headers.
     */
    'allowed_headers' => ['*'],

    /*
     * Sets the Access-Control-Expose-Headers response header with these headers.
     */
    'exposed_headers' => [],

    /*
     * Sets the Access-Control-Max-Age response header when > 0.
     */
    'max_age' => 0,

    /*
     * Sets the Access-Control-Allow-Credentials header.
     */
    'supports_credentials' => false,

];