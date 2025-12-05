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

        // 4. Renderizar vista apropiada según tipo de proyecto
        if ($mis_proyecto->es_personal) {
            // Personal Finance projects use PersonalOverview
            return Inertia::render('Finance/PersonalOverview', [
                'proyecto' => $mis_proyecto,
                'isAdmin' => true, // Always admin of personal projects
            ]);
        }

        // Regular projects use Projects/Show
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
        $mis_proyecto->load([
            'cuentas' => function ($query) {
                $query->where('estado', '!=', 'cerrada');
            },
            'cuentas.propietario', // Eager load owner for visual differentiation
            'cuentasAsociadas' => function ($query) {
                $query->where('estado', '!=', 'cerrada');
            },
            'cuentasAsociadas.propietario', // Eager load owner for linked accounts
            'categorias'
        ]);

        // Cargar transacciones si es admin
        $transacciones = [];
        if ($isAdmin) {
            $transacciones = $mis_proyecto->transacciones()
                ->where('status', 'completed') // Only show completed transactions in the main list
                ->with(['categoria', 'cuenta.propietario', 'usuario']) // Load account owner
                ->orderBy('fecha', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit(100)
                ->get();
        }

        // Cargar tareas financieras pendientes si es admin
        // NOTA: Las tareas financieras se migraron a transacciones (bills).
        // Mantenemos la variable como array vacío para compatibilidad con el frontend por ahora.
        $financialTasks = [];

        // Cargar facturas pendientes (Bills) si es admin
        $pendingBills = [];
        if ($isAdmin) {
            $pendingBills = $mis_proyecto->transacciones()
                ->where('status', 'pending')
                ->with(['categoria', 'cuenta']) // No account usually, but good to have
                ->orderBy('fecha', 'asc')
                ->get();
        }

        $this->appendUnreadCount($mis_proyecto, $request->user());

        return Inertia::render('Projects/Finance/ProjectDashboard', [
            'proyecto' => $mis_proyecto,
            'isAdmin' => $isAdmin,
            'transacciones' => $transacciones,
            'financialTasks' => $financialTasks,
            'pendingBills' => $pendingBills,
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
    /**
     * Actualiza la configuración del proyecto (ej: widgets).
     */
    public function updateSettings(Request $request, Proyecto $project)
    {
        if (!$request->user()->esAdminDe($project)) {
            abort(403);
        }

        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        // Merge existing settings with new ones
        $currentSettings = $project->settings ?? [];
        $newSettings = array_merge($currentSettings, $validated['settings']);

        $project->settings = $newSettings;
        $project->save();

        return redirect()->back()->with('success', 'Configuración actualizada.');
    }
}