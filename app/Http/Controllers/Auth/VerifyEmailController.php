<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request, $id, $hash): RedirectResponse
    {
        // DEBUG: Log request details to diagnose 403 Forbidden on Signed Routes
        \Illuminate\Support\Facades\Log::info('VERIFICATION DEBUG:', [
            'raw_url' => $request->url(),
            'full_url' => $request->fullUrl(),
            'scheme' => $request->getScheme(),
            'is_secure' => $request->isSecure(),
            'x_forwarded_proto' => $request->header('x-forwarded-proto'),
            'trusted_proxies' => $request->getTrustedProxies(),
        ]);

        // Buscar el usuario por ID
        $user = User::find($id);

        // Si no existe el usuario
        if (!$user) {
            return redirect()->route('login')->with('error', 'Usuario no encontrado.');
        }

        // Validar que el hash sea correcto
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect()->route('login')->with('error', 'El enlace de verificación es inválido o ha expirado.');
        }

        // Si ya está verificado
        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')->with('status', 'El email ya había sido verificado. Puedes iniciar sesión.');
        }

        // Marcar como verificado
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect()->route('login')->with('status', '¡Email verificado exitosamente! Ahora puedes iniciar sesión.');
    }
}
