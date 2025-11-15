<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PasswordReset;
use App\Models\User;
use App\Notifications\PasswordResetNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    /**
     * Solicitar restablecimiento de contraseña
     * POST /api/forgot-password
     *
     * @throws ValidationException
     */
    public function forgotPassword(Request $request)
    {
        // Validar que el email existe
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Buscar el usuario
        $user = User::where('email', $request->email)->first();

        // Eliminar tokens previos si existen
        PasswordReset::where('user_id', $user->id)->delete();

        // Generar token seguro
        $token = Str::random(60);

        // Guardar token en BD
        PasswordReset::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
        ]);

        // Enviar notificación con el token sin hashear (es para el usuario)
        $user->notify(new PasswordResetNotification($token, $user->email));

        return response()->json([
            'message' => 'Se ha enviado un enlace de restablecimiento a tu email. Expira en 1 hora.',
        ]);
    }

    /**
     * Validar token de restablecimiento
     * GET /api/reset-password/validate
     */
    public function validateToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        // Buscar el token hasheado
        $hashedToken = hash('sha256', $request->token);
        $passwordReset = PasswordReset::where('user_id', $user->id)
            ->where('token', $hashedToken)
            ->first();

        if (!$passwordReset) {
            return response()->json(['message' => 'Token de restablecimiento inválido.'], 400);
        }

        // Verificar que no ha expirado (1 hora = 3600 segundos)
        if ($passwordReset->created_at->diffInSeconds(now()) > 3600) {
            $passwordReset->delete();
            return response()->json(['message' => 'El enlace de restablecimiento ha expirado.'], 400);
        }

        return response()->json([
            'message' => 'Token válido.',
            'email' => $user->email,
        ]);
    }

    /**
     * Restablecer contraseña
     * POST /api/reset-password
     */
    public function resetPassword(Request $request)
    {
        // Validar entrada
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        // Validar token
        $hashedToken = hash('sha256', $request->token);
        $passwordReset = PasswordReset::where('user_id', $user->id)
            ->where('token', $hashedToken)
            ->first();

        if (!$passwordReset) {
            return response()->json(['message' => 'Token de restablecimiento inválido.'], 400);
        }

        // Verificar expiración
        if ($passwordReset->created_at->diffInSeconds(now()) > 3600) {
            $passwordReset->delete();
            return response()->json(['message' => 'El enlace de restablecimiento ha expirado.'], 400);
        }

        // Actualizar contraseña
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Eliminar el token usado
        $passwordReset->delete();

        // Revocar todos los tokens de acceso anterior (logout en todos los dispositivos)
        $user->tokens()->delete();

        return response()->json([
            'message' => '¡Contraseña restablecida exitosamente! Por favor, inicia sesión con tu nueva contraseña.',
        ]);
    }
}
