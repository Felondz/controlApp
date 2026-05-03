<?php

namespace App\Http\Controllers;

use App\Models\Proyecto;
use App\Models\User;
use App\Models\Invitacion;
use App\Mail\InvitacionProyectoMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

class ProjectMemberUiWebController extends Controller
{
    /**
     * Display the members management view for the project.
     */
    public function index(Request $request, Proyecto $proyecto): InertiaResponse
    {
        if (!$request->user()->esMiembroDe($proyecto)) {
            abort(403, 'No tienes permiso para ver los miembros de este proyecto.');
        }

        $proyecto->load(['miembros', 'invitaciones']);

        return Inertia::render('Projects/Members/Index', [
            'proyecto' => $proyecto,
            'members' => $proyecto->miembros,
            'invitations' => $proyecto->invitaciones,
            'isAdmin' => $request->user()->esAdminDe($proyecto),
            'isOwner' => $proyecto->user_id === $request->user()->id,
        ]);
    }

    /**
     * Send a new invitation.
     */
    public function store(Request $request, Proyecto $proyecto): RedirectResponse
    {
        if (!Gate::allows('manageMembersAndInvitations', $proyecto)) {
            abort(403, 'No tienes permiso para invitar miembros.');
        }

        $validated = $request->validate([
            'email' => 'required|email:rfc',
            'rol' => 'required|string|in:admin,miembro',
        ]);

        $emailInvitado = $validated['email'];
        $usuarioExistente = User::where('email', $emailInvitado)->first();

        if ($usuarioExistente && $proyecto->miembros()->where('user_id', $usuarioExistente->id)->exists()) {
            return back()->withErrors(['email' => 'Este usuario ya es miembro del proyecto.']);
        }

        if ($proyecto->invitaciones()->where('email', $emailInvitado)->exists()) {
            return back()->withErrors(['email' => 'Este usuario ya tiene una invitación pendiente.']);
        }

        /** @var Invitacion $invitacion */
        $invitacion = $proyecto->invitaciones()->create([
            'user_id' => $request->user()->id,
            'email' => $emailInvitado,
            'rol' => $validated['rol'],
            'token' => Str::random(40),
            'expires_at' => Carbon::now()->addDays(7),
        ]);

        Mail::to($invitacion->email)->send(new InvitacionProyectoMail($invitacion));

        return back()->with('success', 'Invitación enviada correctamente.');
    }

    /**
     * Update a member's role.
     */
    public function update(Request $request, Proyecto $proyecto, User $user): RedirectResponse
    {
        if (!$request->user()->esAdminDe($proyecto)) {
            abort(403, 'Solo los administradores pueden cambiar roles.');
        }

        // Prevent modifying the Owner's role
        if ($user->id === $proyecto->user_id) {
            abort(403, 'No puedes cambiar el rol del Dueño del proyecto.');
        }

        $validated = $request->validate([
            'rol' => ['required', 'string', Rule::in(['admin', 'miembro'])],
        ]);

        if (!$user->esMiembroDe($proyecto)) {
            abort(404, 'El usuario no es miembro de este proyecto.');
        }

        // Prevent degrading the last admin (if not owner logic applies, but owner is always admin)
        // However, if the owner is the ONLY admin, they can't be degraded anyway due to the check above.
        // If there is another admin who is NOT the owner, we should check if they are the last one.
        $esElUltimoAdmin = ($proyecto->miembros()->where('rol', 'admin')->count() === 1);
        if ($esElUltimoAdmin && $validated['rol'] === 'miembro') {
            return back()->withErrors(['rol' => 'No puedes degradar al último administrador.']);
        }

        $proyecto->miembros()->updateExistingPivot($user->id, ['rol' => $validated['rol']]);

        return back()->with('success', 'Rol actualizado correctamente.');
    }

    /**
     * Remove a member from the project.
     */
    public function destroy(Request $request, Proyecto $proyecto, User $user): RedirectResponse
    {
        $actor = $request->user();
        $esAdmin = $actor->esAdminDe($proyecto);
        $esPropio = ($actor->id === $user->id);

        if (!$esAdmin && !$esPropio) {
            abort(403, 'No tienes permiso para eliminar a este miembro.');
        }

        // Prevent removing the Owner
        if ($user->id === $proyecto->user_id) {
            abort(403, 'No puedes eliminar al Dueño del proyecto.');
        }

        // Prevent removing the last admin
        $esAdminDelTarget = $user->esAdminDe($proyecto);
        $esElUltimoAdmin = ($esAdminDelTarget && $proyecto->miembros()->where('rol', 'admin')->count() === 1);

        if ($esElUltimoAdmin) {
            return back()->withErrors(['general' => 'No puedes eliminar al último administrador.']);
        }

        $proyecto->miembros()->detach($user->id);

        if ($esPropio) {
            return redirect()->route('dashboard')->with('success', 'Has abandonado el proyecto.');
        }

        return back()->with('success', 'Miembro eliminado correctamente.');
    }

    /**
     * Cancel an invitation.
     */
    public function cancelInvitation(Request $request, Proyecto $proyecto, Invitacion $invitation): RedirectResponse
    {
        if (!Gate::allows('manageMembersAndInvitations', $proyecto)) {
            abort(403, 'No tienes permiso para gestionar invitaciones.');
        }

        if ((string)$invitation->proyecto_id !== (string)$proyecto->id) {
            abort(404);
        }

        $invitation->delete();

        return back()->with('success', 'Invitación cancelada.');
    }

    /**
     * Transfer project ownership to another member.
     */
    public function transferOwnership(Request $request, Proyecto $proyecto): RedirectResponse
    {
        // Only the current Owner can transfer ownership
        if ($request->user()->id !== $proyecto->user_id) {
            abort(403, 'Solo el Dueño del proyecto puede transferir la propiedad.');
        }

        $validated = $request->validate([
            'new_owner_id' => 'required|exists:users,id',
            'password' => 'required|current_password',
        ]);

        $newOwner = User::findOrFail($validated['new_owner_id']);

        // Ensure the new owner is a member of the project
        if (!$newOwner->esMiembroDe($proyecto)) {
            return back()->withErrors(['new_owner_id' => 'El nuevo dueño debe ser miembro del proyecto.']);
        }

        // Ensure the new owner is ALREADY an Admin
        if (!$newOwner->esAdminDe($proyecto)) {
            return back()->withErrors(['new_owner_id' => 'El usuario debe ser Administrador para recibir la propiedad.']);
        }

        // Update project owner
        $proyecto->user_id = $newOwner->id;
        $proyecto->save();

        // The new owner is already an admin, so no need to update pivot role.
        // The old owner (current user) remains an admin (or whatever role they had, which was admin/owner).
        // Usually, the old owner should remain as an admin.
        // We ensure the old owner is explicitly set as admin in the pivot if not already (though they should be).
        if (!$request->user()->esAdminDe($proyecto)) {
            $proyecto->miembros()->updateExistingPivot($request->user()->id, ['rol' => 'admin']);
        }

        return back()->with('success', 'Propiedad del proyecto transferida exitosamente.');
    }

    /**
     * Search users for invitation.
     */
    public function searchUsers(Request $request, Proyecto $proyecto): JsonResponse
    {
        if (!Gate::allows('manageMembersAndInvitations', $proyecto)) {
            abort(403, 'No tienes permiso para buscar usuarios.');
        }

        $query = $request->input('query');

        if (empty($query) || strlen($query) < 2) {
            return response()->json([]);
        }

        // Get IDs of current members and pending invitations to exclude
        $memberIds = $proyecto->miembros()->pluck('users.id');
        $invitedEmails = $proyecto->invitaciones()->pluck('email');

        $users = User::where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->whereNotIn('id', $memberIds)
            ->whereNotIn('email', $invitedEmails)
            ->take(10)
            ->get(['id', 'name', 'email', 'profile_photo_path']);

        // Append profile_photo_url accessor
        $users->each(function ($user) {
            $user->append('profile_photo_url');
        });

        return response()->json($users);
    }

    /**
     * Show the invitation acceptance page.
     */
    public function showInvitation(Request $request, string $token): InertiaResponse|RedirectResponse
    {
        $invitacion = Invitacion::where('token', $token)->first();

        if (!$invitacion) {
            return redirect()->route('dashboard')->with('error', 'La invitación no es válida.');
        }

        if ($invitacion->expires_at < Carbon::now()) {
            $invitacion->delete();
            return redirect()->route('dashboard')->with('error', 'La invitación ha expirado.');
        }

        /** @var User $user */
        $user = $request->user();
        $proyecto = $invitacion->proyecto;
        $invitador = $invitacion->invitador;

        return Inertia::render('Projects/Invitations/Show', [
            'invitation' => $invitacion,
            'project' => $proyecto,
            'inviter' => $invitador,
            'currentUser' => $user,
            'isCorrectUser' => ($user->email === $invitacion->email),
        ]);
    }

    /**
     * Process the invitation acceptance.
     */
    public function processInvitation(Request $request, string $token): RedirectResponse
    {
        $invitacion = Invitacion::where('token', $token)->first();

        if (!$invitacion) {
            return redirect()->route('dashboard')->with('error', 'La invitación no es válida.');
        }

        /** @var User $user */
        $user = $request->user();
        $proyecto = $invitacion->proyecto;

        // Security Check: Ensure the logged-in user is the one who was invited
        if ($user->email !== $invitacion->email) {
            return back()->with('error', 'Esta invitación no corresponde a tu cuenta.');
        }

        // Check if already a member
        if ($user->esMiembroDe($proyecto)) {
            $invitacion->delete();
            return redirect()->route('mis-proyectos.show', $proyecto)->with('info', 'Ya eres miembro de este proyecto.');
        }

        // Add member
        $proyecto->miembros()->attach($user->id, ['rol' => $invitacion->rol]);

        // Delete invitation
        $invitacion->delete();

        return redirect()->route('mis-proyectos.show', $proyecto)->with('success', '¡Te has unido al proyecto correctamente!');
    }
}
