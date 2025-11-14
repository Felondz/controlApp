<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProyectoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\CuentaController;
use App\Features\Finanzas\Controllers\TransaccionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// RUTAS PROTEGIDAS
Route::middleware('auth:sanctum')->group(function () {

    // Ruta de Logout 
    Route::post('/logout', [AuthController::class, 'logout']);

    // Ruta de User 
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rutas de Proyectos 
    Route::get('/proyectos', [ProyectoController::class, 'index']);
    Route::post('/proyectos', [ProyectoController::class, 'store']);

    // Rutas de Categorías 
    Route::get('/proyectos/{proyecto}/categorias', [CategoriaController::class, 'index']);
    Route::post('/proyectos/{proyecto}/categorias', [CategoriaController::class, 'store']);

    // Rutas de Cuentas (tarjetas, efectivo, etc.) 
    Route::get('/proyectos/{proyecto}/cuentas', [CuentaController::class, 'index']);
    Route::post('/proyectos/{proyecto}/cuentas', [CuentaController::class, 'store']);

    // Rutas de Transacciones
    Route::get('/proyectos/{proyecto}/transacciones', [TransaccionController::class, 'index']);
    Route::post('/proyectos/{proyecto}/transacciones', [TransaccionController::class, 'store']);
});
