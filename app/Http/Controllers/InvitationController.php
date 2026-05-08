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
            ->where('status', Invitacion::STATUS_PENDING)
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

        if ($invitation->status !== Invitacion::STATUS_PENDING) {
            return redirect()->back()->with('error', 'La invitación ya no está disponible.');
        }

        $proyecto = $invitation->proyecto;

        // Check if already a member
        if ($user->esMiembroDe($proyecto)) {
            $invitation->update([
                'status' => Invitacion::STATUS_ACCEPTED,
                'accepted_at' => now()
            ]);
            return redirect()->back()->with('info', 'Ya eres miembro de este proyecto.');
        }

        // Add member
        $proyecto->miembros()->attach($user->id, ['rol' => $invitation->rol]);

        // Mark as accepted instead of delete
        $invitation->update([
            'status' => Invitacion::STATUS_ACCEPTED,
            'accepted_at' => now()
        ]);

        return redirect()->route('mis-proyectos.show', $proyecto->uuid)
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

        if ($invitation->status !== Invitacion::STATUS_PENDING) {
            return redirect()->back()->with('error', 'La invitación ya no está disponible.');
        }

        // Mark as rejected instead of delete
        $invitation->update([
            'status' => Invitacion::STATUS_REJECTED
        ]);

        return redirect()->back()->with('success', 'Invitación rechazada.');
    }
}
