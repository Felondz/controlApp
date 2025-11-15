<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoriaController extends Controller
{
    /**
     * Muestra las categorías activas de un proyecto.
     * (Cualquier miembro puede 'ver')
     */
    public function index(Request $request, Proyecto $proyecto)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');
        return response()->json($proyecto->categorias); // SoftDeletes filtra automáticamente
    }

    /**
     * Almacena una nueva categoría.
     */
    public function store(Request $request, Proyecto $proyecto)
    {

        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden añadir categorías.');

        $datosValidados = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => ['required', 'string', Rule::in(['ingreso', 'gasto'])],
        ]);

        $datosCompletos = array_merge($datosValidados, ['proyecto_id' => $proyecto->id]);
        $categoria = Categoria::create($datosCompletos);

        return response()->json($categoria, 201);
    }

    /**
     * Muestra una categoría específica.
     * (Cualquier miembro puede 'ver')
     */
    public function show(Request $request, Proyecto $proyecto, Categoria $categoria)
    {
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');
        if ($categoria->proyecto_id !== $proyecto->id) {
            abort(404);
        }
        return response()->json($categoria);
    }

    /**
     * Actualiza una categoría.
     */
    public function update(Request $request, Proyecto $proyecto, Categoria $categoria)
    {

        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden editar este proyecto.');

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

        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden eliminar/archivar categorías.');

        if ($categoria->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        if ($categoria->transacciones()->exists()) {
            // Caso 1: Tiene transacciones. Se archiva (Soft Delete).
            $categoria->delete();
        } else {
            // Caso 2: No tiene transacciones. Se borra permanentemente.
            $categoria->forceDelete();
        }

        return response()->noContent();
    }
}
