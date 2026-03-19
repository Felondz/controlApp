<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    /**
     * Maneja la petición de registro de un nuevo usuario.
     * POST /api/register
     */
    public function register(Request $request)
    {
        // 1. Validar los datos de entrada
        $datosValidados = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // 'confirmed' busca un campo 'password_confirmation'
        ]);

        // 2. Crear el usuario en la base de datos
        $usuario = User::create([
            'name' => $datosValidados['name'],
            'email' => $datosValidados['email'],
            'password' => Hash::make($datosValidados['password']), // ¡Importante! Siempre encriptar la contraseña
        ]);

        // Disparar el evento de registro para enviar el email de verificación
        event(new Registered($usuario));
        // 3. Respuesta
        return response()->json([
            'message' => 'Usuario registrado exitosamente. Por favor, inicia sesión.'
        ], 201); // 201 = Creado
    }

    /**
     * Maneja la petición de login (Inicio de sesión).
     * POST /api/login
     */
    public function login(Request $request)
    {
        // 1. Validar las credenciales
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember_me' => 'boolean',
            'device_name' => 'nullable|string',
        ]);

        $credentials = $request->only('email', 'password');

        // 2. Validar credenciales SIN iniciar sesión (Auth::validate)
        if (!Auth::validate($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // 3. Obtener el usuario
        $usuario = User::where('email', $request->email)->first();

        // 4. Verificar que el email esté verificado
        if ($usuario && !$usuario->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Tu email no ha sido verificado. Por favor, verifica tu correo electrónico.',
                'error' => 'email_not_verified',
                'email' => $usuario->email
            ], 403); // 403 Forbidden
        }

        // 4.1 Verificar que el usuario esté activo (is_active check)
        if ($usuario && property_exists($usuario, 'is_active') && $usuario->is_active === false) {
            return response()->json([
                'message' => 'Tu cuenta ha sido desactivada. Contacta al administrador.',
                'error' => 'account_inactive'
            ], 403); // 403 Forbidden
        }

        // 5. Crear el token de acceso
        $tokenName = $request->input('device_name', 'auth_token');
        $newTokenResult = $usuario->createToken($tokenName);
        $token = $newTokenResult->plainTextToken;

        // 5.1 Gestionar expiración extendida (30 días) si es mobile/remember_me
        if ($request->boolean('remember_me')) {
            $personalAccessToken = $newTokenResult->accessToken;
            $personalAccessToken->expires_at = now()->addDays(30);
            $personalAccessToken->save();
        }

        // 6. Devolver la respuesta con el token
        return response()->json([
            'message' => '¡Inicio de sesión exitoso!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $usuario
        ]);
    }

    /**
     * Cierra la sesión (revoca el token actual).
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        // Revoca el token específico que se usó para hacer esta petición
        /** @var \Laravel\Sanctum\PersonalAccessToken|\Laravel\Sanctum\TransientToken|null $token */
        $token = $request->user()?->currentAccessToken();

        // Eliminar el token si existe y es un PersonalAccessToken (no TransientToken)
        if ($token && method_exists($token, 'delete')) {
            $token->delete();
        }

        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }
}
