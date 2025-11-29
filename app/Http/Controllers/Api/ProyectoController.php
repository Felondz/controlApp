<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Http\Requests\StoreProyectoRequest;
use App\Http\Requests\UpdateProyectoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
    public function store(StoreProyectoRequest $request)
    {
        $validatedData = $request->validated();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('project-images', 'public');
        }

        $proyecto = Proyecto::create([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'] ?? null,
            'moneda_default' => $validatedData['moneda_default'],
            'user_id' => $request->user()->id,
            'es_personal' => false,
            'visible_en_listado' => true,
            'modules' => $validatedData['modules'],
            'color' => $validatedData['color'] ?? null,
            'icon' => $validatedData['icon'] ?? null,
            'image_path' => $imagePath,
            'theme' => $validatedData['theme'] ?? 'purple-modern',
            'typography' => $validatedData['typography'] ?? 'sans',
        ]);

        $proyecto->miembros()->attach($request->user()->id, ['rol' => 'admin']);

        return response()->json($proyecto->load('miembros'), 201);
    }

    /**
     * Muestra un proyecto específico.
     */
    public function show(Request $request, Proyecto $proyecto)
    {
        // Para 'ver', solo necesita ser miembro
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // Cargar relaciones base
        $relations = ['miembros', 'categorias'];

        // Solo cargar cuentas (finanzas) si es admin
        if ($request->user()->esAdminDe($proyecto)) {
            $relations[] = 'cuentas';
        }

        return response()->json($proyecto->load($relations));
    }

    /**
     * Actualiza un proyecto específico.
     */
    public function update(UpdateProyectoRequest $request, Proyecto $proyecto)
    {
        // solo un 'admin' puede editar.
        abort_if(!$request->user()->esAdminDe($proyecto), 403, 'Solo los administradores pueden editar este proyecto.');

        $validatedData = $request->validated();
        $dataToUpdate = [];

        $fields = ['nombre', 'descripcion', 'moneda_default', 'color', 'icon', 'theme', 'typography'];
        foreach ($fields as $field) {
            if (isset($validatedData[$field])) {
                $dataToUpdate[$field] = $validatedData[$field];
            }
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists (optional but recommended)
            if ($proyecto->image_path) {
                Storage::disk('public')->delete($proyecto->image_path);
            }
            $imagePath = $request->file('image')->store('project-images', 'public');
            $dataToUpdate['image_path'] = $imagePath;
        }

        $proyecto->update($dataToUpdate);
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
