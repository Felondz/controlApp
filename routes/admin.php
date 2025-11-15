<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\DashboardController;

/*
|--------------------------------------------------------------------------
| Admin API Routes
|--------------------------------------------------------------------------
|
| Estas rutas son cargadas por AppServiceProvider (en realidad, bootstrap/app.php)
| y automáticamente tienen el prefijo /api/admin y están
| protegidas por los middlewares 'auth:sanctum' y 'super-admin'.
|
*/

// La URL final será: GET /api/admin/dashboard
Route::get('/dashboard', [DashboardController::class, 'index']);
