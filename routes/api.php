<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 1. Importamos TODOS los controladores
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProyectoController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\CuentaController;
use App\Features\Finanzas\Controllers\TransaccionController;
use App\Http\Controllers\Api\ProyectoInvitacionController;
use App\Http\Controllers\Api\InvitacionController;
use App\Http\Controllers\Api\ProyectoMiembroController;
use App\Http\Controllers\Api\EmailVerificationController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Rutas Públicas de Autenticación ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Ruta Pública de Invitación ---
Route::get('/invitaciones/{token}', [InvitacionController::class, 'show']);

// --- Ruta Pública de Verificación de Email ---
// Debe estar fuera del grupo protegido porque el usuario no está logueado cuando hace clic en el email
// NO usamos 'signed' middleware porque validamos el hash manualmente en el controlador
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->name('verification.verify');

// --- RUTAS PROTEGIDAS (Requieren Token) ---
Route::middleware('auth:sanctum')->group(function () {

    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());

    // --- Rutas CRUD (Forma Limpia) ---
    // Proyectos (CRUD completo)
    Route::apiResource('proyectos', ProyectoController::class);

    // Categorías (CRUD completo, anidado en Proyectos)
    Route::apiResource('proyectos.categorias', CategoriaController::class);

    // Cuentas (CRUD completo, anidado en Proyectos)
    Route::apiResource('proyectos.cuentas', CuentaController::class);

    // Transacciones (CRUD completo, anidado en Proyectos)
    Route::apiResource('proyectos.transacciones', TransaccionController::class)
        ->parameters(['transacciones' => 'transaccion'])
        ->shallow();
    // --- Rutas del Sistema de Invitaciones ---

    // Aceptar/Rechazar invitación (requiere estar logueado)
    Route::post('/invitaciones/{token}/accept', [InvitacionController::class, 'accept']);
    Route::delete('/invitaciones/{token}/reject', [InvitacionController::class, 'destroy']);

    // Gestionar Invitaciones (requiere ser admin del proyecto)
    Route::get('/proyectos/{proyecto}/invitaciones', [ProyectoInvitacionController::class, 'index']);
    Route::post('/proyectos/{proyecto}/invitaciones', [ProyectoInvitacionController::class, 'store']);
    Route::delete('/proyectos/{proyecto}/invitaciones/{invitacion}', [ProyectoInvitacionController::class, 'destroy']);

    // Gestionar Miembros (requiere ser admin del proyecto)
    Route::get('/proyectos/{proyecto}/miembros', [ProyectoMiembroController::class, 'index']);
    Route::put('/proyectos/{proyecto}/miembros/{user}', [ProyectoMiembroController::class, 'update']);
    Route::delete('/proyectos/{proyecto}/miembros/{user}', [ProyectoMiembroController::class, 'destroy']);

    // Ruta para que el usuario pida un nuevo enlace de verificación
    // (Debe tener 'throttle' para evitar spam)
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'store'])
        ->middleware('throttle:6,1') // 6 peticiones por minuto
        ->name('verification.send'); // Laravel necesita este nombre
});
