<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Models\Invitacion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class ProyectoInvitacionController extends Controller
{
    /**
     * Muestra las invitaciones pendientes de un proyecto.
     * GET /api/proyectos/{proyecto}/invitaciones
     */
    public function index(Request $request, Proyecto $proyecto)
    {
        // Autorización: Solo un admin puede ver las invitaciones pendientes
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden ver las invitaciones.');

        // Devolvemos las invitaciones 
        return response()->json($proyecto->invitaciones);
    }

    /**
     * Almacena (envía) una nueva invitación para un proyecto.
     * POST /api/proyectos/{proyecto}/invitaciones
     */
    public function store(Request $request, Proyecto $proyecto)
    {
        // Autorización: Solo un admin puede enviar invitaciones
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden enviar invitaciones.');

        // 1. Validar la entrada
        $datos = $request->validate([
            'email' => 'required|email',
            'rol' => ['required', 'string', Rule::in(['admin', 'miembro'])],
        ]);

        $emailInvitado = $datos['email'];

        // 2. Lógica de Negocio: Revisar si ya es miembro
        $usuarioExistente = User::where('email', $emailInvitado)->first();
        if ($usuarioExistente && $proyecto->miembros()->where('user_id', $usuarioExistente->id)->exists()) {
            return response()->json(['message' => 'Este usuario ya es miembro del proyecto.'], 409); // 409 Conflict
        }

        // 3. Lógica de Negocio: Revisar si ya tiene una invitación pendiente
        if ($proyecto->invitaciones()->where('email', $emailInvitado)->exists()) {
            return response()->json(['message' => 'Este usuario ya tiene una invitación pendiente para este proyecto.'], 409);
        }

        // 4. Crear la invitación
        $invitacion = $proyecto->invitaciones()->create([
            'email' => $emailInvitado,
            'rol' => $datos['rol'],
            'token' => Str::random(40), // Token secreto y único
            'expires_at' => Carbon::now()->addDays(7), // La invitación expira en 7 días
        ]);

        // 5. Enviar el email (¡El TODO que agendamos!)
        // TODO: Implementar el Mailable para enviar este token.
        // Mail::to($invitacion->email)->send(new EnviarInvitacionDeProyecto($invitacion));

        // 6. Devolver la invitación creada
        return response()->json($invitacion, 201); // 201 Creado
    }

    /**
     * Cancela (borra) una invitación pendiente.
     * DELETE /api/proyectos/{proyecto}/invitaciones/{invitacion}
     */
    public function destroy(Request $request, Proyecto $proyecto, Invitacion $invitacion)
    {
        // Autorización: Solo un admin puede borrar invitaciones
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden cancelar invitaciones.');

        // Verificación de pertenencia
        if ($invitacion->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        $invitacion->delete();

        return response()->noContent(); // 204 No Content
    }
}
