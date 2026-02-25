<?php declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    public function __construct()
    {
        if (request()->user() && !request()->user()->is_super_admin) {
            abort(403);
        }
    }

    /**
     * Display a listing of the users.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $role = $request->input('role');
        $status = $request->input('status');

        $query = User::withCount('proyectos as total_projects')
            ->orderByDesc('created_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role === 'admin') {
            $query->where('is_super_admin', true);
        } elseif ($role === 'user') {
            $query->where('is_super_admin', false);
        }

        if ($status === 'active') {
            // Evaluates truthiness for is_active which defaults to 1/true
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        $users = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
            'stats' => [
                'total' => User::count(),
                'active' => User::where('is_active', true)->count(),
                'admins' => User::where('is_super_admin', true)->count(),
            ]
        ]);
    }

    /**
     * Display detailed user statistics.
     */
    public function show(User $user): Response
    {
        $user->loadMissing([
            'proyectos' => function ($query) {
                $query->withPivot(['rol', 'last_read_at']);
            },
            'proyectosPersonales',
            'llmSettings'
        ]);

        $projectCount = $user->proyectos->count() + $user->proyectosPersonales->count();
        $tasksCount = $user->tasks()->count();
        $accountsCount = $user->cuentas()->count();
        $messagesCount = $user->sentMessages()->count();

        // Combine private and shared projects into a normalized array for the UI
        $projectsList = collect();
        
        foreach ($user->proyectosPersonales as $project) {
            $projectsList->push([
                'id' => $project->id,
                'name' => $project->nombre,
                'role' => 'owner',
                'type' => 'personal',
                'last_read_at' => null // Owners don't use pivot
            ]);
        }

        foreach ($user->proyectos as $project) {
            $projectsList->push([
                'id' => $project->id,
                'name' => $project->nombre,
                // @phpstan-ignore-next-line
                'role' => $project->pivot->rol ?? 'miembro',
                'type' => 'shared',
                // @phpstan-ignore-next-line
                'last_read_at' => $project->pivot->last_read_at
            ]);
        }

        return Inertia::render('Admin/Users/Show', [
            'targetUser' => $user,
            'stats' => [
                'projects_count' => $projectCount,
                'tasks_count' => $tasksCount,
                'accounts_count' => $accountsCount,
                'messages_count' => $messagesCount,
            ],
            'projects_list' => $projectsList->sortBy('name')->values()->all(),
        ]);
    }

    /**
     * Toggle the active status of the user.
     */
    public function toggleStatus(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'No puedes desactivar tu propia cuenta.');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $statusStr = $user->is_active ? 'activada' : 'desactivada';
        return back()->with('success', "Cuenta de usuario {$statusStr} exitosamente.");
    }

    /**
     * Toggle the super admin status of the user.
     */
    public function toggleAdmin(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'No puedes alterar tus propios permisos de administrador.');
        }

        $user->is_super_admin = !$user->is_super_admin;
        $user->save();

        $roleStr = $user->is_super_admin ? 'promovido a Super Admin' : 'revocado de Super Admin';
        return back()->with('success', "Usuario {$roleStr} exitosamente.");
    }
}
