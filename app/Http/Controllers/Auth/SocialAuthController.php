<?php declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\WelcomeEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Response;

class SocialAuthController extends Controller
{
    /**
     * Redirige al usuario a la página de autenticación de Google.
     */
    public function redirect(): Response
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Maneja el callback de Google para la web.
     */
    public function callback(): RedirectResponse
    {
        try {
            /** @var \Laravel\Socialite\Two\User $googleUser */
            $googleUser = Socialite::driver('google')->user();
            
            $user = $this->findOrCreateUser($googleUser);

            Auth::login($user);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', __('auth.google_login_error', [], app()->getLocale()) ?:  'Hubo un error al iniciar sesión con Google.');
        }
    }

    /**
     * Maneja el login desde la App Móvil (Expo) usando un ID Token o Access Token.
     */
    public function apiLogin(Request $request): Response
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        try {
            // Para login con token directo (Stateless)
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver('google');
            
            /** @var \Laravel\Socialite\Two\User $googleUser */
            $googleUser = $driver->stateless()->userFromToken($request->token);
            
            $user = $this->findOrCreateUser($googleUser);

            $token = $user->createToken('mobile-auth-token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => __('auth.google_login_error', [], app()->getLocale()) ?:  'Invalid Google token'], 401);
        }
    }

    /**
     * Busca o crea un usuario basado en la información de Google.
     * 
     * @param \Laravel\Socialite\Contracts\User|\Laravel\Socialite\Two\User $googleUser
     */
    protected function findOrCreateUser($googleUser): User
    {
        /** @var User|null $user */
        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            $updates = [];
            // Actualizar el google_id si solo lo encontramos por email
            if (!$user->google_id) {
                $updates['google_id'] = $googleUser->getId();
            }
            
            // Actualizar avatar si es necesario (priorizar si no tiene)
            if ($googleUser->getAvatar() && !$user->avatar) {
                $updates['avatar'] = $googleUser->getAvatar();
                $updates['profile_photo_path'] = $googleUser->getAvatar();
            }

            // Marcar correo como verificado si aún no lo está, ya que Google lo valida
            if (!$user->email_verified_at) {
                $updates['email_verified_at'] = now();
            }

            if (!empty($updates)) {
                $user->update($updates);
            }

            return $user;
        }

        $user = User::create([
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
            'avatar' => $googleUser->getAvatar(),
            'profile_photo_path' => $googleUser->getAvatar(),
            'password' => null,
            'email_verified_at' => now(),
        ]);

        try {
            Mail::to($user->email)->send(new WelcomeEmail($user->name, app()->getLocale()));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Could not send welcome email to {$user->email}: " . $e->getMessage());
        }

        return $user;
    }
}
