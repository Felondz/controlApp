<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invitacion;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class InvitacionController extends Controller
{
    /**
     * Muestra los detalles de una invitación (para el invitado).
     * Esta ruta es pública pero solo funciona con un token válido.
     * GET /api/invitaciones/{token}
     */
    public function show(string $token)
    {
        // 1. Buscar la invitación por el token
        $invitacion = Invitacion::where('token', $token)
            ->where('expires_at', '>', Carbon::now()) // Asegurarse de que no haya expirado
            ->firstOrFail(); // Falla si no la encuentra (404)

        // 2. Cargar el nombre del proyecto (para mostrar "GuaRox te invitó a 'Proyecto Setas'")
        $invitacion->load('proyecto:id,nombre');

        return response()->json($invitacion);
    }

    /**
     * Acepta una invitación.
     * ruta protegida por autenticación (auth:sanctum).
     * El usuario debe estar logueado para poder aceptar.
     * POST /api/invitaciones/{token}/accept
     */
    public function accept(Request $request, string $token)
    {
        // 1. Buscar la invitación válida
        $invitacion = Invitacion::where('token', $token)
            ->where('expires_at', '>', Carbon::now())
            ->firstOrFail(); // Falla si no la encuentra (404)

        // 2. Obtener el usuario autenticado (el que acepta la invitación)
        $usuario = $request->user();

        // 3. Verificación de seguridad: ¿Es esta invitación para ti?
        // Compara el email de la invitación con el email del usuario logueado.
        if ($invitacion->email !== $usuario->email) {
            return response()->json(['message' => 'Esta invitación no es para ti.'], 403); // 403 Forbidden
        }

        // 4. Lógica de Negocio: Revisar si ya es miembro (por si acaso)
        if ($usuario->esMiembroDe($invitacion->proyecto)) {
            $invitacion->delete(); // Es miembro, así que borramos la invitación y listo.
            return response()->json(['message' => 'Ya eres miembro de este proyecto.']);
        }

        // 5. ¡LA MAGIA! Usar una transacción de BD para asegurar que todo ocurra o nada ocurra.
        DB::transaction(function () use ($usuario, $invitacion) {
            // 5a. Añadir el usuario al proyecto con el rol de la invitación
            $invitacion->proyecto->miembros()->attach($usuario->id, ['rol' => $invitacion->rol]);

            // 5b. Borrar la invitación, ya fue usada
            $invitacion->delete();
        });

        // 6. Devolver el proyecto al que se acaba de unir
        return response()->json($invitacion->proyecto->load('miembros'));
    }

    /**
     * Rechaza una invitación.
     * (Opcional, pero bueno tenerlo)
     * DELETE /api/invitaciones/{token}
     */
    public function destroy(Request $request, string $token)
    {
        // 1. Buscar la invitación válida
        $invitacion = Invitacion::where('token', $token)->firstOrFail();

        // 2. Opcional: Verificar que el usuario logueado es el dueño del email
        // if ($invitacion->email !== $request->user()->email) {
        //    abort(403, 'Esta no es tu invitación.');
        // }

        $invitacion->delete();
        return response()->noContent(); // 204 No Content
    }
}
