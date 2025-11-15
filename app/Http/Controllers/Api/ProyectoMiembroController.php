<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProyectoMiembroController extends Controller
{
    /**
     * Muestra los miembros de un proyecto.
     */
    public function index(Request $request, Proyecto $proyecto)
    {
        // Autorización: Solo un miembro puede ver la lista de otros miembros
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // Devolvemos la lista de miembros (usando la relación)
        return response()->json($proyecto->miembros);
    }

    /**
     * Actualiza el rol de un miembro existente en un proyecto.
     */
    public function update(Request $request, Proyecto $proyecto, User $user)
    {
        // 1. AUTORIZACIÓN: Solo un admin puede cambiar roles
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden cambiar roles.');

        // 2. VALIDACIÓN:
        $datos = $request->validate([
            'rol' => ['required', 'string', Rule::in(['admin', 'miembro'])],
        ]);

        // 3. LÓGICA:
        // Asegurarse de que el usuario que intentamos actualizar SÍ es miembro
        if (!$user->esMiembroDe($proyecto)) {
            abort(404, 'El usuario no es miembro de este proyecto.');
        }

        // Lógica de seguridad: ¿Estás intentando degradar al último admin?
        $esElUsuarioActual = $request->user()->id === $user->id;
        $esElUltimoAdmin = ($proyecto->miembros()->where('rol', 'admin')->count() === 1);

        if ($esElUsuarioActual && $esElUltimoAdmin && $datos['rol'] === 'miembro') {
            return response()->json(['message' => 'No puedes degradar al último administrador del proyecto.'], 403);
        }

        // Actualizar el rol en la tabla pivote
        $proyecto->miembros()->updateExistingPivot($user->id, ['rol' => $datos['rol']]);

        // 4. RESPUESTA:
        return response()->json($proyecto->load('miembros'));
    }

    /**
     * Elimina un miembro de un proyecto.
     */
    public function destroy(Request $request, Proyecto $proyecto, User $user)
    {
        // 1. AUTORIZACIÓN:
        $actor = $request->user(); // El usuario que hace la petición
        $esAdmin = $actor->esAdminDe($proyecto);
        $esPropio = ($actor->id === $user->id); // ¿El usuario se está eliminando a sí mismo?

        // Si NO eres admin Y NO te estás eliminando a ti mismo, entonces aborta.
        if (!$esAdmin && !$esPropio) {
            abort(403, 'No tienes permiso para eliminar a este miembro.');
        }

        // 2. LÓGICA DE NEGOCIO:
        // Lógica de seguridad: ¿Estás intentando eliminar al último admin?
        // (Esto aplica tanto si un admin lo intenta, como si el propio admin intenta irse)
        $esAdminDelTarget = $user->esAdminDe($proyecto); // Revisa el rol del usuario a eliminar
        $esElUltimoAdmin = ($esAdminDelTarget && $proyecto->miembros()->where('rol', 'admin')->count() === 1);

        if ($esElUltimoAdmin) {
            return response()->json(['message' => 'No puedes eliminar/abandonar si eres el último administrador del proyecto.'], 403);
        }

        // 3. ACCIÓN:
        // Eliminar el vínculo en la tabla pivote
        $proyecto->miembros()->detach($user->id);

        // 4. RESPUESTA:
        return response()->noContent(); // 204 No Content
    }
}
