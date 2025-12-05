<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 1. Importamos TODOS los controladores
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectAccountController;
use App\Http\Controllers\Api\ProyectoController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\CuentaController;
use App\Features\Finanzas\Controllers\TransaccionController;
use App\Http\Controllers\Api\ProyectoInvitacionController;
use App\Http\Controllers\Api\InvitacionController;
use App\Http\Controllers\Api\ProyectoMiembroController;
use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\FinanzasPersonalesController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\CalculatorController;
use App\Http\Controllers\TaskController;
use App\Modules\Analytics\Controllers\AnalyticsController;
use App\Modules\Notifications\Controllers\NotificationController;
use App\Http\Controllers\Api\MarketplaceController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Rutas Públicas de Autenticación ---
// SECURITY: Rate limiting to prevent brute force attacks
// 5 attempts per minute for authentication attempts
Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1')
    ->name('auth.register');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1')
    ->name('auth.login');

// --- Ruta Pública de Invitación ---
Route::get('/invitaciones/{token}', [InvitacionController::class, 'show']);

// --- Ruta Pública de Verificación de Email ---
// Debe estar fuera del grupo protegido porque el usuario no está logueado cuando hace clic en el email
// NO usamos 'signed' middleware porque validamos el hash manualmente en el controlador
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->name('api.verification.verify');

// --- Rutas Públicas de Password Reset ---
// SECURITY: Rate limiting to prevent abuse
// 5 attempts per minute for password reset requests
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword'])
    ->middleware('throttle:5,1')
    ->name('api.password.email');

Route::get('/reset-password/validate', [PasswordResetController::class, 'validateToken'])
    ->middleware('throttle:10,1')
    ->name('password.validate');

Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
    ->middleware('throttle:5,1')
    ->name('api.password.reset');

// --- Ruta Pública de Reenvío de Verificación de Email ---
// Permite reenviar el email de verificación sin estar autenticado
// SECURITY: Rate limiting estricto (3 intentos por minuto) para prevenir abuso
Route::post('/email/resend-verification', [EmailVerificationController::class, 'resend'])
    ->middleware('throttle:3,1')
    ->name('api.verification.resend');

// --- RUTAS PROTEGIDAS (Requieren Token) ---
Route::middleware('auth:sanctum')->group(function () {

    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());

    // --- Búsqueda Global ---
    Route::get('/search', [App\Http\Controllers\Api\SearchController::class, '__invoke']);

    // --- Usuario: Preferencias y Perfil ---
    Route::put('/user/locale', [UserController::class, 'updateLocale']);

    // Perfil (Sincronizado con Web)
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto']);
    Route::delete('/profile/photo', [ProfileController::class, 'deletePhoto']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);

    // --- Rutas CRUD (Forma Limpia) ---
    // Proyectos (CRUD completo)
    Route::apiResource('proyectos', ProyectoController::class);

    // Categorías (CRUD completo, anidado en Proyectos)
    Route::apiResource('proyectos.categorias', CategoriaController::class);

    // Cuentas (CRUD completo, anidado en Proyectos)
    // Project Accounts (Linking)
    Route::get('proyectos/{proyecto}/cuentas/available', [ProjectAccountController::class, 'available'])->name('proyectos.cuentas.available');
    Route::post('proyectos/{proyecto}/cuentas/link', [ProjectAccountController::class, 'link'])->name('proyectos.cuentas.link');
    Route::delete('proyectos/{proyecto}/cuentas/{cuenta}/unlink', [ProjectAccountController::class, 'unlink'])->name('proyectos.cuentas.unlink');

    // Project Finance
    Route::get('proyectos/{proyecto}/finance/balance', [CuentaController::class, 'balance'])->name('api.finance.balance');
    Route::apiResource('proyectos.cuentas', CuentaController::class);

    // Transacciones (CRUD completo, anidado en Proyectos)
    Route::apiResource('proyectos.transacciones', TransaccionController::class)
        ->parameters(['transacciones' => 'transaccion']);
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

    // Tasks routes
    Route::get('/proyectos/{proyecto}/tasks', [TaskController::class, 'index']);
    Route::post('/proyectos/{proyecto}/tasks', [TaskController::class, 'store']);
    Route::put('/proyectos/{proyecto}/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/proyectos/{proyecto}/tasks/{task}', [TaskController::class, 'destroy']);

    // Analytics routes
    Route::get('/proyectos/{proyecto}/analytics', [AnalyticsController::class, 'index'])->name('api.proyectos.analytics.index');
    Route::get('/proyectos/{proyecto}/analytics/metrics', [AnalyticsController::class, 'metrics']);
    Route::get('/proyectos/{proyecto}/analytics/summary', [AnalyticsController::class, 'summary']);
    Route::get('/proyectos/{proyecto}/analytics/insights', [AnalyticsController::class, 'insights']);
    Route::get('/proyectos/{proyecto}/analytics/trends', [AnalyticsController::class, 'trends'])->name('api.proyectos.analytics.trends');

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('api.notifications.index');
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('api.notifications.read'); // Frontend uses PATCH
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('api.notifications.mark-all-read');
    Route::get('/notifications/preferences', [NotificationController::class, 'preferences'])->name('api.notifications.preferences');
    Route::post('/notifications/preferences', [NotificationController::class, 'updatePreference'])->name('api.notifications.update-preferences');

    // Marketplace routes
    Route::get('/proyectos/{proyecto}/marketplace', [MarketplaceController::class, 'index'])->name('api.proyectos.marketplace.index');
    Route::post('/proyectos/{proyecto}/marketplace/{module}', [MarketplaceController::class, 'toggle'])->name('api.proyectos.marketplace.toggle');

    // Ruta para que el usuario pida un nuevo enlace de verificación
    // (Debe tener 'throttle' para evitar spam)
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'store'])
        ->middleware('throttle:6,1') // 6 peticiones por minuto
        ->name('api.verification.send'); // Nombre único para la API

    // --- Rutas de Finanzas Personales ---
    Route::get('/finanzas-personales', [FinanzasPersonalesController::class, 'show']);
    Route::get('/finanzas-personales/transacciones', [FinanzasPersonalesController::class, 'transacciones']);
    Route::get('/finanzas-personales/cuentas', [FinanzasPersonalesController::class, 'cuentas']);
    Route::get('/finanzas-personales/categorias', [FinanzasPersonalesController::class, 'categorias']);

    // --- Herramientas ---
    Route::get('/tools', [App\Http\Controllers\Api\ToolController::class, 'index']);
    Route::post('/tools/toggle', [App\Http\Controllers\Api\ToolController::class, 'toggle']);
    Route::post('/tools/calculator/calculate', [CalculatorController::class, 'calculate']);

    // --- Mensajería (Chat) ---
    Route::get('/proyectos/{proyecto}/messages', [App\Http\Controllers\Api\MessageController::class, 'index']);
    Route::post('/proyectos/{proyecto}/messages', [App\Http\Controllers\Api\MessageController::class, 'store']);
    Route::post('/proyectos/{proyecto}/messages/read', [App\Http\Controllers\Api\MessageController::class, 'markAsRead']);
});
