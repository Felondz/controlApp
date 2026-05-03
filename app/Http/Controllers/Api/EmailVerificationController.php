<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\URL;

class EmailVerificationController extends Controller
{
    /**
     * Marca el email del usuario como verificado.
     * Esta es la ruta que se activa cuando el usuario hace clic en el enlace del email.
     * NO requiere autenticación porque el usuario puede estar verificando desde un email sin loguearse.
     *
     * GET /api/email/verify/{id}/{hash}
     */
    public function verify(Request $request, string|int $id, string $hash): \Illuminate\Http\RedirectResponse
    {
        // 1. Buscar el usuario por UUID (routing convention) o ID (fallback)
        $idStr = (string)$id;
        $user = User::where('uuid', $idStr)->first() ?: User::find($idStr);

        // 2. Si no existe, redirigir a login con error
        if (!$user) {
            return redirect()->route('login')->with('error', 'Usuario no encontrado.');
        }

        // 3. Validar que la firma sea correcta usando el helper de Laravel
        // Laravel genera el hash con: sha1($user->getEmailForVerification())
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect()->route('login')->with('error', 'El enlace de verificación es inválido o ha expirado.');
        }

        // 4. Si ya está verificado
        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')->with('status', 'El email ya había sido verificado. Puedes iniciar sesión.');
        }

        // 5. Marcar como verificado
        $user->markEmailAsVerified();

        // 6. Disparar el evento Verified (opcional, pero bueno para listeners)
        event(new Verified($user));

        // 7. Redirigir a login con mensaje de éxito
        return redirect()->route('login')->with('status', '¡Email verificado exitosamente! Ahora puedes iniciar sesión.');
    }

    /**
     * Reenvía el enlace de verificación de email.
     * Esta ruta la llama el usuario desde la app si no recibió el correo.
     * POST /api/email/verification-notification
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // 1. Verificar si el usuario ya está verificado
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email ya verificado.'
            ], 422); // 422 Unprocessable Entity
        }

        // 2. Si no, enviar el correo de verificación
        $user->sendEmailVerificationNotification();

        // 3. Devolver respuesta
        return response()->json([
            'message' => 'Enlace de verificación enviado a tu email.'
        ]);
    }

    /**
     * Reenvía el enlace de verificación de email (endpoint público).
     * No requiere autenticación - el usuario puede reenviar sin estar logueado.
     * POST /api/email/resend-verification
     */
    public function resend(Request $request): \Illuminate\Http\JsonResponse
    {
        // 1. Validar que el email existe
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        // 2. Buscar el usuario
        /** @var \App\Models\User $user */
        $user = User::where('email', (string)$request->email)->firstOrFail();

        // 3. Verificar si ya está verificado
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Este email ya está verificado.'
            ], 422);
        }

        // 4. SEGURIDAD: Resetear email_verified_at a null
        // Esto invalida cualquier hash anterior porque el hash se calcula con sha1(email)
        // y Laravel verifica que email_verified_at sea null antes de marcar como verificado
        $user->email_verified_at = null;
        $user->save();

        // 5. Enviar nuevo email de verificación (con nuevo hash)
        $user->sendEmailVerificationNotification();

        // 6. Devolver respuesta
        return response()->json([
            'message' => 'Email de verificación enviado. Revisa tu bandeja de entrada.'
        ]);
    }
}
