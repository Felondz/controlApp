<?php

namespace App\Http\Controllers; 

use App\Models\Proyecto;
use App\Http\Requests\StoreProyectoRequest; 
use App\Http\Requests\UpdateProyectoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia; 

class ProyectoUiWebController extends Controller
{
    /**
     * Almacena un nuevo proyecto en la base de datos.
     */
    public function store(StoreProyectoRequest $request) 
    {
        // El FormRequest ya se ejecutó y si falló, lanzó la excepción 422
        // El FormRequest también maneja la autorización (si la tiene).
        $validatedData = $request->validated(); // ✅ USANDO EL MÉTODO LIMPIO
        
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('project-images', 'public');
        }

        // 1. Crear el proyecto usando los datos validados
        $proyecto = Proyecto::create([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'] ?? null,
            'moneda_default' => $validatedData['moneda_default'],
            'user_id' => Auth::id(),
            'es_personal' => false,
            'visible_en_listado' => true,
            'modules' => $validatedData['modules'],
            'color' => $validatedData['color'] ?? null,
            'icon' => $validatedData['icon'] ?? null,
            'image_path' => $imagePath,
            'theme' => $validatedData['theme'] ?? 'purple-modern',
            'typography' => $validatedData['typography'] ?? 'sans',
        ]);
        
        // 2. Adjuntar al creador como miembro y administrador
        $proyecto->miembros()->attach(Auth::id(), ['rol' => 'admin']); 

        // 3. Redireccionar con éxito (Inertia detecta automáticamente los errores 422)
        return redirect()->route('dashboard')
            ->with('success', '¡Proyecto "' . $proyecto->nombre . '" creado con éxito!');
    }

    public function create()
    {
        // Renderiza el componente de React en resources/js/Pages/Projects/CreateProject.jsx
        return Inertia::render('Projects/CreateProject');
    }

    public function show(Request $request, Proyecto $mis_proyecto)
    {
        // 1. Autorización: Asegurar que el usuario es miembro del proyecto.
        if (!$request->user()->esMiembroDe($mis_proyecto)) {
             abort(403, 'No tienes permiso para acceder a este proyecto.');
        }

        // 2. Verificar si es admin para cargar datos financieros
        $isAdmin = $request->user()->esAdminDe($mis_proyecto);

        // 3. Eager Loading condicional
        $relations = ['categorias']; // Categorías pueden ser visibles (o no, según requerimiento, pero finanzas es lo crítico)
        
        if ($isAdmin) {
            $relations[] = 'cuentas';
            // $relations[] = 'transacciones'; // Si se cargaran aquí
        }

        $mis_proyecto->load($relations); 
        
        // 4. Renderizar la vista de Inertia
        return Inertia::render('Projects/Show', [
            'proyecto' => $mis_proyecto,
            'isAdmin' => $isAdmin,
        ]);
    }

    /**
     * Muestra el formulario para editar un proyecto.
     */
    public function edit(Request $request, Proyecto $mis_proyecto)
    {
        // 1. Autorización: Solo admins pueden editar
        if (!$request->user()->esAdminDe($mis_proyecto)) {
            abort(403, 'Solo los administradores pueden editar este proyecto.');
        }

        return Inertia::render('Projects/Edit', [
            'proyecto' => $mis_proyecto,
        ]);
    }

    /**
     * Actualiza el proyecto en la base de datos.
     */
    public function update(UpdateProyectoRequest $request, Proyecto $mis_proyecto)
    {
        // La autorización ya debería estar en el FormRequest, pero por seguridad:
        if (!$request->user()->esAdminDe($mis_proyecto)) {
            abort(403, 'Solo los administradores pueden actualizar este proyecto.');
        }

        $validatedData = $request->validated();

        $mis_proyecto->update([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'] ?? $mis_proyecto->descripcion,
            'moneda_default' => $validatedData['moneda_default'],
        ]);

        return redirect()->route('mis-proyectos.show', $mis_proyecto)
            ->with('success', 'Proyecto actualizado correctamente.');
    }

    /**
     * Elimina el proyecto.
     */
    public function destroy(Request $request, Proyecto $mis_proyecto)
    {
        if (!$request->user()->esAdminDe($mis_proyecto)) {
            abort(403, 'Solo los administradores pueden eliminar este proyecto.');
        }

        // Soft delete
        $mis_proyecto->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Proyecto eliminado correctamente.');
    }
}