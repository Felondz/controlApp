<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        \Illuminate\Support\Facades\Log::info('LoginRequest: Start. Auth::check() = ' . (Auth::check() ? 'TRUE' : 'FALSE'));
        $this->ensureIsNotRateLimited();

        $credentials = $this->only('email', 'password');

        // 1. Validar credenciales sin iniciar sesión
        if (!Auth::validate($credentials)) {
            \Illuminate\Support\Facades\Log::info('LoginRequest: Credentials validation failed');
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        // 2. Obtener usuario para verificar status de email
        // Usamos el proveedor de autenticación para ser agnósticos del modelo
        $user = Auth::getProvider()->retrieveByCredentials($credentials);

        \Illuminate\Support\Facades\Log::info('LoginRequest: User retrieved: ' . ($user ? $user->email : 'NONE'));

        // 3. Verificar si el email está verificado
        if ($user && !$user->hasVerifiedEmail()) {
            \Illuminate\Support\Facades\Log::info('LoginRequest: User email NOT verified. Throwing exception.');

            throw ValidationException::withMessages([
                'email' => 'Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.',
            ]);
        }

        \Illuminate\Support\Facades\Log::info('LoginRequest: User email IS verified. Attempting login.');

        // 4. Si todo está bien, iniciamos sesión
        if (!Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }
}
