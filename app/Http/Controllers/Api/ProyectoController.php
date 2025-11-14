<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use Illuminate\Http\Request;

class ProyectoController extends Controller
{
    /**
     * Muestra los proyectos del usuario autenticado.
     */
    public function index(Request $request)
    {
        $proyectos = $request->user()->proyectos;
        return response()->json($proyectos);
    }

    /**
     * Almacena un nuevo proyecto.
     */
    public function store(Request $request)
    {
        $datosValidados = $request->validate([
            'nombre' => 'required|string|max:255',
            'moneda_default' => 'nullable|string|max:3',
        ]);

        $usuario = $request->user();
        $proyecto = Proyecto::create($datosValidados);
        $proyecto->miembros()->attach($usuario->id, ['rol' => 'admin']);

        return response()->json($proyecto->load('miembros'), 201);
    }

    /**
     * Muestra un proyecto específico.
     */
    public function show(Request $request, Proyecto $proyecto)
    {
        // Para 'ver', solo necesita ser miembro
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');
        return response()->json($proyecto->load('miembros', 'cuentas', 'categorias'));
    }

    /**
     * Actualiza un proyecto específico.
     */
    public function update(Request $request, Proyecto $proyecto)
    {
        // solo un 'admin' puede editar.
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden editar este proyecto.');

        $datosValidados = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'moneda_default' => 'sometimes|string|max:3',
        ]);

        $proyecto->update($datosValidados);
        return response()->json($proyecto);
    }

    /**
     * Elimina un proyecto.
     */
    public function destroy(Request $request, Proyecto $proyecto)
    {

        // solo un 'admin' puede eliminar.
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden eliminar este proyecto.');

        $proyecto->delete();
        return response()->noContent();
    }
}
