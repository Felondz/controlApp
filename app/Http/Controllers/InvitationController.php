<?php

namespace App\Http\Controllers;

use App\Models\Invitacion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InvitationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invitations = Invitacion::where('email', Auth::user()->email)
            ->with(['proyecto', 'invitador'])
            ->latest()
            ->get();

        return Inertia::render('Invitations/Index', [
            'invitations' => $invitations
        ]);
    }

    /**
     * Accept the invitation.
     */
    public function accept(Invitacion $invitation)
    {
        $user = Auth::user();

        // Security check
        if ($invitation->email !== $user->email) {
            abort(403, 'Esta invitación no te pertenece.');
        }

        $proyecto = $invitation->proyecto;

        // Check if already a member
        if ($user->esMiembroDe($proyecto)) {
            $invitation->delete();
            return redirect()->back()->with('info', 'Ya eres miembro de este proyecto.');
        }

        // Add member
        $proyecto->miembros()->attach($user->id, ['rol' => $invitation->rol]);

        // Delete invitation
        $invitation->delete();

        return redirect()->route('mis-proyectos.show', $proyecto)
            ->with('success', '¡Te has unido al proyecto correctamente!');
    }

    /**
     * Reject the invitation.
     */
    public function reject(Invitacion $invitation)
    {
        $user = Auth::user();

        // Security check
        if ($invitation->email !== $user->email) {
            abort(403, 'Esta invitación no te pertenece.');
        }

        $invitation->delete();

        return redirect()->back()->with('success', 'Invitación rechazada.');
    }
}
