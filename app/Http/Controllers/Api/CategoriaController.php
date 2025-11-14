<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Transaccion;

class CategoriaController extends Controller
{
    /**
     * Muestra las categorías.
     */
    public function index(Request $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // El método ->categorias() ahora (gracias a SoftDeletes)
        // solo traerá las que no estén archivadas. ¡Es automático!
        return response()->json($proyecto->categorias);
    }

    public function store(Request $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para añadir categorías.');

        $datosValidados = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => ['required', 'string', Rule::in(['ingreso', 'gasto'])],
        ]);

        $datosCompletos = array_merge($datosValidados, ['proyecto_id' => $proyecto->id]);
        $categoria = Categoria::create($datosValidados);

        return response()->json($categoria, 201);
    }

    public function show(Request $request, Proyecto $proyecto, Categoria $categoria)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');
        if ($categoria->proyecto_id !== $proyecto->id) {
            abort(404);
        }
        return response()->json($categoria);
    }

    public function update(Request $request, Proyecto $proyecto, Categoria $categoria)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para editar este proyecto.');
        if ($categoria->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        $datosValidados = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'tipo' => ['sometimes', 'string', Rule::in(['ingreso', 'gasto'])],
        ]);

        $categoria->update($datosValidados);
        return response()->json($categoria);
    }

    /**
     * Elimina o archiva una categoría.
     */
    public function destroy(Request $request, Proyecto $proyecto, Categoria $categoria)
    {
        // 1. Autorización básica
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para eliminar en este proyecto.');

        // 2. Verificación de pertenencia
        if ($categoria->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        // 3. Revisar si tiene transacciones
        $tieneTransacciones = $categoria->transacciones()->exists();

        // 4. Revisar si el usuario es Admin
        $esAdmin = $request->user()->esAdminDe($proyecto);

        // 5. Aplicar la lógica
        if ($tieneTransacciones && !$esAdmin) {
            // Caso 1: Tiene transacciones, pero NO eres admin.
            // ¡Prohibido!
            return response()->json([
                'message' => 'Esta categoría tiene transacciones y solo un administrador puede archivarla.'
            ], 403); // 403 Forbidden

        } else if ($tieneTransacciones && $esAdmin) {
            // Caso 2: Tiene transacciones Y eres admin.
            // ¡Permitido! Se "archiva" (Soft Delete).
            $categoria->delete(); // Gracias a SoftDeletes, esto "archiva"

        } else {
            // Caso 3: No tiene transacciones.
            // Cualquiera (que sea miembro) puede borrarla PERMANENTEMENTE.
            $categoria->forceDelete(); // Borrado destructivo y real
        }

        return response()->noContent(); // 204 No Content
    }
}
