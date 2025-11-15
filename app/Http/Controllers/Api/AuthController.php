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
        ]);

        // 2. Intentar autenticar al usuario
        if (!Auth::attempt($request->only('email', 'password'))) {
            // Si falla, lanzar un error
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // 3. Si las credenciales son correctas, obtener el usuario
        $usuario = User::where('email', $request->email)->firstOrFail();

        // 4. Crear el token de acceso
        $token = $usuario->createToken('auth_token')->plainTextToken;

        // 5. Devolver la respuesta con el token
        return response()->json([
            'message' => '¡Inicio de sesión exitoso!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $usuario // Devolvemos el usuario (útil para el frontend)
        ]);
    }

    /**
     * Cierra la sesión (revoca el token actual).
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        // Revoca el token específico que se usó para hacer esta petición
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }
}
