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

        if ($mis_proyecto->hasMessagingFeature()) {
            $relations[] = 'miembros:id,name,profile_photo_path';
        }

        $mis_proyecto->load($relations);
        $mis_proyecto->loadCount('miembros');

        $this->appendUnreadCount($mis_proyecto, $request->user());

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
        if (!$request->user()->esAdminDe($mis_proyecto)) {
            abort(403, 'Solo los administradores pueden actualizar este proyecto.');
        }

        $validatedData = $request->validated();

        $dataToUpdate = [];

        if (isset($validatedData['nombre'])) {
            $dataToUpdate['nombre'] = $validatedData['nombre'];
        }

        if (isset($validatedData['descripcion'])) {
            $dataToUpdate['descripcion'] = $validatedData['descripcion'];
        }

        if (isset($validatedData['moneda_default'])) {
            $dataToUpdate['moneda_default'] = $validatedData['moneda_default'];
        }

        if (isset($validatedData['color'])) {
            $dataToUpdate['color'] = $validatedData['color'];
        }

        if (isset($validatedData['icon'])) {
            $dataToUpdate['icon'] = $validatedData['icon'];
        }

        if (isset($validatedData['theme'])) {
            $dataToUpdate['theme'] = $validatedData['theme'];
        }

        if (isset($validatedData['typography'])) {
            $dataToUpdate['typography'] = $validatedData['typography'];
        }

        if (isset($validatedData['modules'])) {
            $dataToUpdate['modules'] = $validatedData['modules'];
        }

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('project-images', 'public');
            $dataToUpdate['image_path'] = $imagePath;
        }

        $mis_proyecto->update($dataToUpdate);

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

        // Validate password
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        // Soft delete
        $mis_proyecto->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Proyecto eliminado correctamente.');
    }
    /**
     * Muestra el dashboard financiero del proyecto.
     */
    public function finance(Request $request, Proyecto $mis_proyecto)
    {
        // 1. Autorización
        if (!$request->user()->esMiembroDe($mis_proyecto)) {
            abort(403, 'No tienes permiso para acceder a este proyecto.');
        }

        // 2. Verificar si es admin para cargar datos financieros
        $isAdmin = $request->user()->esAdminDe($mis_proyecto);

        // 3. Eager Loading específico para finanzas
        $relations = [];

        if ($isAdmin) {
            $relations[] = 'cuentas';
            // $relations[] = 'transacciones'; // Future: Load recent transactions
        }

        $mis_proyecto->load($relations);

        $this->appendUnreadCount($mis_proyecto, $request->user());

        return Inertia::render('Projects/Finance/ProjectDashboard', [
            'proyecto' => $mis_proyecto,
            'isAdmin' => $isAdmin,
        ]);
    }

    /**
     * Helper to append unread messages count to project.
     */
    private function appendUnreadCount(Proyecto $proyecto, $user)
    {
        $unreadCount = 0;
        if ($proyecto->hasMessagingFeature()) {
            $pivot = \Illuminate\Support\Facades\DB::table('proyecto_user')
                ->where('proyecto_id', $proyecto->id)
                ->where('user_id', $user->id)
                ->first();
            $lastReadAt = $pivot ? $pivot->last_read_at : null;

            $generalUnread = $proyecto->messages()
                ->whereNull('recipient_id')
                ->where('user_id', '!=', $user->id)
                ->when($lastReadAt, function ($q) use ($lastReadAt) {
                    $q->where('created_at', '>', $lastReadAt);
                })
                ->count();

            $privateUnread = $proyecto->messages()
                ->where('recipient_id', $user->id)
                ->whereNull('read_at')
                ->count();

            $unreadCount = $generalUnread + $privateUnread;
        }
        $proyecto->unread_messages_count = $unreadCount;
    }

    /**
     * Muestra la vista de chat del proyecto.
     */
    public function chat(Request $request, Proyecto $mis_proyecto)
    {
        // 1. Autorización
        if (!$request->user()->esMiembroDe($mis_proyecto)) {
            abort(403, 'No tienes permiso para acceder a este proyecto.');
        }

        // 2. Verificar si el módulo de chat está habilitado
        if (!$mis_proyecto->hasMessagingFeature()) {
            abort(404);
        }

        // 3. Cargar miembros para el chat
        $mis_proyecto->load(['miembros:id,name,profile_photo_path']);

        $this->appendUnreadCount($mis_proyecto, $request->user());

        return Inertia::render('Projects/Chat', [
            'proyecto' => $mis_proyecto,
            'user' => $request->user(),
        ]);
    }

    /**
     * Muestra el dashboard principal con la lista de proyectos.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Obtenemos los proyectos (personales + membresías)
        $proyectos = $user->proyectosPersonales->merge($user->proyectos);

        // Procesamos para agregar flag de admin y conteo de mensajes no leídos
        $proyectos->transform(function ($proyecto) use ($user) {
            $proyecto->isAdmin = $user->esAdminDe($proyecto);
            $this->appendUnreadCount($proyecto, $user);
            return $proyecto;
        });

        return Inertia::render('Dashboard', ['proyectos' => $proyectos]);
    }
}