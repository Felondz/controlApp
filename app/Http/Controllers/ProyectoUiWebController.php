<?php

namespace App\Http\Controllers; 

use App\Models\Proyecto;
use App\Http\Requests\StoreProyectoRequest; 
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
        
        // 1. Crear el proyecto usando los datos validados
        $proyecto = Proyecto::create([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'] ?? null, // Usar null para opcionales si no viene
            'moneda_default' => $validatedData['moneda_default'],
            'user_id' => Auth::id(),
            'es_personal' => false,
            'visible_en_listado' => true,
        ]);
        
        // 2. Adjuntar al creador como miembro y administrador
        $proyecto->miembros()->attach(Auth::id(), ['rol' => 'admin']); 

        // 3. Redireccionar con éxito (Inertia detecta automáticamente los errores 422)
        return redirect()->route('dashboard')
            ->with('success', '¡Proyecto "' . $proyecto->nombre . '" creado con éxito!');
    }

    public function create()
    {
        // Renderiza el componente de React en resources/js/Pages/Projects/Create.jsx
        return Inertia::render('Projects/Create');
    }

    public function show(Request $request, Proyecto $mis_proyecto)
    {
        // 1. Autorización: Asegurar que el usuario es miembro del proyecto.
        // Asumiendo que el modelo User tiene un método esMiembroDe($proyecto).
        // Si no existe, debes implementarlo o usar Policies (norma de ControlApp).
        if (!$request->user()->esMiembroDe($mis_proyecto)) {
             abort(403, 'No tienes permiso para acceder a este proyecto.');
        }

        // 2. Eager Loading: Cargar las relaciones que la vista necesita.
        // Esto previene N+1 queries.
        $mis_proyecto->load(['cuentas', 'categorias']); 
        
        // 3. Renderizar la vista de Inertia, pasando el objeto Proyecto.
        return Inertia::render('Projects/Show', [
            'proyecto' => $mis_proyecto,
        ]);
    }
}