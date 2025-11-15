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
    public function verify(Request $request, $id, $hash)
    {
        // 1. Buscar el usuario por ID
        $user = User::find($id);

        // 2. Si no existe, retornar error
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado.'
            ], 404);
        }

        // 3. Validar que la firma sea correcta usando el helper de Laravel
        // Laravel genera el hash con: sha1($user->getEmailForVerification())
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json([
                'message' => 'El enlace de verificación es inválido o ha expirado.'
            ], 400);
        }

        // 4. Si ya está verificado
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'El email ya había sido verificado.'
            ], 400);
        }

        // 5. Marcar como verificado
        $user->markEmailAsVerified();

        // 6. Disparar el evento Verified (opcional, pero bueno para listeners)
        event(new Verified($user));

        // 7. Devolver respuesta de éxito
        return response()->json([
            'message' => '¡Email verificado exitosamente! Ahora puedes loguearte.'
        ]);
    }

    /**
     * Reenvía el enlace de verificación de email.
     * Esta ruta la llama el usuario desde la app si no recibió el correo.
     * POST /api/email/verification-notification
     */
    public function store(Request $request)
    {
        // 1. Verificar si el usuario ya está verificado
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email ya verificado.'
            ], 422); // 422 Unprocessable Entity
        }

        // 2. Si no, enviar el correo de verificación
        $request->user()->sendEmailVerificationNotification();

        // 3. Devolver respuesta
        return response()->json([
            'message' => 'Enlace de verificación enviado a tu email.'
        ]);
    }
}
