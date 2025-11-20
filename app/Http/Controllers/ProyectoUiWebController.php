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
     * DIAGNÓSTICO: Validación manual para aislar problemas de inyección.
     */
    public function store(Request $request) 
    {
        // 1. Crear instancia del Form Request para acceder a sus reglas
        $formRequest = new StoreProyectoRequest();
        
        // 2. FORZAR validación manual - esto debe fallar con 'max:1'
        $validatedData = $request->validate($formRequest->rules());
        
        // 3. Crear el proyecto usando los datos validados
        $proyecto = Proyecto::create([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'],
            'moneda_default' => $validatedData['moneda_default'],
            'user_id' => Auth::id(),
            'es_personal' => false,
            'visible_en_listado' => true,
        ]);
        
        // 4. Adjuntar al creador como miembro y administrador
        $proyecto->miembros()->attach(Auth::id(), ['rol' => 'admin']); 

        // 5. Redireccionar con éxito
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