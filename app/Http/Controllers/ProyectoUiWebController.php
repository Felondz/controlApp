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
        $availableModules = \App\Models\Module::where('is_active', true)->get();

        // Renderiza el componente de React en resources/js/Pages/Projects/CreateProject.jsx
        return Inertia::render('Projects/CreateProject', [
            'availableModules' => $availableModules
        ]);
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

        // 4. Cargar datos específicos para widgets del Dashboard (si es admin)
        $transacciones = [];
        $pendingBills = [];

        if ($isAdmin) {
            $relations[] = 'cuentas.propietario';
            $relations[] = 'cuentasAsociadas.propietario';

            // Cargar últimos movimientos para el widget de transacciones y gráficos
            $transacciones = $mis_proyecto->transacciones()
                ->where('status', 'completed')
                ->with(['categoria', 'cuenta.propietario', 'usuario'])
                ->orderBy('fecha', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit(20) // Limit to 20 for Overview to be lighter than Finance dashboard
                ->get();

            // Cargar facturas pendientes
            $pendingBills = $mis_proyecto->transacciones()
                ->where('status', 'pending')
                ->with(['categoria', 'cuenta'])
                ->orderBy('fecha', 'asc')
                ->get();
        }

        if ($mis_proyecto->hasMessagingFeature()) {
            $relations[] = 'miembros:id,name,profile_photo_path';
        }

        $mis_proyecto->load($relations);
        $mis_proyecto->loadCount('miembros');

        $this->appendUnreadCount($mis_proyecto, $request->user());

        // 4. Renderizar vista apropiada según tipo de proyecto


        // Regular projects use Projects/Show
        return Inertia::render('Projects/Show', [
            'proyecto' => $mis_proyecto,
            'isAdmin' => $isAdmin,
            'transacciones' => $transacciones, // Passed for widgets
            'pendingBills' => $pendingBills,   // Passed for widgets
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
                ->limit(300)
                ->get();
        }

        // Cargar tareas financieras pendientes si es admin
        // NOTA: Las tareas financieras se migraron a transacciones (bills).
        // Mantenemos la variable como array vacío para compatibilidad con el frontend por ahora.
        $financialTasks = [];

        // Cargar facturas pendientes (Bills) si es admin
        $pendingBills = [];
        $creditCardBills = [];
        if ($isAdmin) {
            $pendingBills = $mis_proyecto->transacciones()
                ->where('status', 'pending')
                ->with(['categoria', 'cuenta']) // No account usually, but good to have
                ->orderBy('fecha', 'asc')
                ->get();

            // Calculate credit card bills from active CC accounts
            $billingService = new \App\Services\CreditCardBillingService();
            $allCCs = $mis_proyecto->cuentas
                ->where('tipo', 'credito')
                ->where('estado', 'activa')
                ->merge(
                    $mis_proyecto->cuentasAsociadas
                        ->where('tipo', 'credito')
                        ->where('estado', 'activa')
                );

            foreach ($allCCs as $cuenta) {
                $billData = $billingService->getUpcomingBill($cuenta);
                if ($billData['pago_minimo'] > 0 || $billData['pago_total'] > 0) {
                    $creditCardBills[] = $billData;
                }
            }

            // Calculate Projected Investment Yields (Upcoming Incomes)
            $upcomingIncomes = [];
            $investAccounts = $mis_proyecto->cuentas
                ->whereIn('tipo', ['banco', 'inversion'])
                ->where('tasa_interes_anual', '>', 0)
                ->where('estado', 'activa')
                ->merge(
                    $mis_proyecto->cuentasAsociadas
                        ->whereIn('tipo', ['banco', 'inversion'])
                        ->where('tasa_interes_anual', '>', 0)
                        ->where('estado', 'activa')
                );

            foreach ($investAccounts as $cuenta) {
                if ($cuenta->saldo_actual <= 0)
                    continue;

                $tea = $cuenta->tasa_interes_anual / 100;
                $tasaMensual = pow(1 + $tea, 1 / 12) - 1;
                $interesProyectado = $cuenta->saldo_actual * $tasaMensual;

                // Detect CDT vs Savings (CDT has future expiration)
                $esCDT = $cuenta->fecha_vencimiento && now()->lt($cuenta->fecha_vencimiento);
                $label = $esCDT ? 'Rendimiento CDT (' . $cuenta->nombre . ')' : 'Rendimiento Ahorros (' . $cuenta->nombre . ')';

                if ($interesProyectado > 1) { // Ignore < 1 cent
                    $upcomingIncomes[] = [
                        'id' => 'yield-' . $cuenta->id,
                        'title' => $label,
                        'amount' => round($interesProyectado),
                        'date' => now()->addMonth()->startOfMonth()->toDateString(), // Next 1st of month
                        'type' => 'income',
                        'source' => 'investment_yield',
                        'account_name' => $cuenta->nombre,
                    ];
                }
            }

            // Calculate Upcoming Loan Installments
            $loanInstallments = [];
            $loanAccounts = $mis_proyecto->cuentas
                ->where('tipo', 'prestamo')
                ->whereIn('estado', ['activa', 'active']) // Handle potentially different enum values or english/spanish
                ->filter(function ($cuenta) {
                    // Ensure it's a debt (negative balance usually, or just active loan)
                    // Some users might track loans as positive debt. Assuming negative based on accounting.
                    // But just checking existence is safer if balance logic varies.
                    return true;
                });

            foreach ($loanAccounts as $cuenta) {
                if (!$cuenta->valor_cuota || $cuenta->valor_cuota <= 0)
                    continue;

                $diaPago = $cuenta->dia_pago ?? 1;
                $nextPayment = \Carbon\Carbon::now()->day($diaPago);
                if (\Carbon\Carbon::now()->day > $diaPago) {
                    $nextPayment->addMonth();
                }

                $loanInstallments[] = [
                    'id' => 'loan-' . $cuenta->id,
                    'title' => 'Cuota ' . $cuenta->nombre,
                    'account_name' => $cuenta->nombre,
                    'amount' => $cuenta->valor_cuota,
                    'date' => $nextPayment->toDateString(),
                    'type' => 'expense',
                    'source' => 'loan_installment',
                    'account_id' => $cuenta->id,
                    'propietario_id' => $cuenta->propietario_id,
                ];
            }
        } else {
            $upcomingIncomes = [];
            $loanInstallments = [];
        }

        $this->appendUnreadCount($mis_proyecto, $request->user());

        return Inertia::render('Projects/Finance/ProjectDashboard', [
            'proyecto' => $mis_proyecto, // Already has cuentas, cuentasAsociadas, categorias loaded
            'isAdmin' => $isAdmin,
            'transacciones' => $transacciones,
            'financialTasks' => $financialTasks ?? [],
            'pendingBills' => $pendingBills,
            'creditCardBills' => $creditCardBills,
            'upcomingIncomes' => $upcomingIncomes,
            'loanInstallments' => $loanInstallments,
        ]);
    }

    /**
     * Helper to append unread messages count to project.
     */
    private function appendUnreadCount(Proyecto $proyecto, $user)
    {
        $unreadCount = 0;
        if ($proyecto->hasMessagingFeature()) {
            // New logic: Read from cached column (Read Model)
            $unreadCount = \Illuminate\Support\Facades\DB::table('proyecto_user')
                ->where('proyecto_id', $proyecto->id)
                ->where('user_id', $user->id)
                ->value('unread_messages_count') ?? 0;
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

        // Optimization: Batch load unread counts (N+1 Solution)
        $unreadCounts = \Illuminate\Support\Facades\DB::table('proyecto_user')
            ->where('user_id', $user->id)
            ->whereIn('proyecto_id', $proyectos->pluck('id'))
            ->pluck('unread_messages_count', 'proyecto_id');

        // Procesamos para agregar flag de admin y conteo de mensajes no leídos
        $proyectos->transform(function ($proyecto) use ($user, $unreadCounts) {
            $proyecto->isAdmin = $user->esAdminDe($proyecto);

            // Use batched cache if messaging is enabled
            if ($proyecto->hasMessagingFeature()) {
                $proyecto->unread_messages_count = $unreadCounts[$proyecto->id] ?? 0;
            } else {
                $proyecto->unread_messages_count = 0;
            }

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