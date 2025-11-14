<?php

use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Support\Facades\Route;

// Alias para CORS (si no lo tienes en bootstrap)
Route::aliasMiddleware('cors', HandleCors::class);

Route::middleware('cors')->get('/', function () {
    return view('welcome');
});