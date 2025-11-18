<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Invitacion;
use App\Models\Proyecto;

class InvitacionPolicy
{
    /**
     * Determine if the user can view any invitation in the project.
     * 
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view the invitation.
     * 
     * @param User $user
     * @param Invitacion $invitacion
     * @return bool
     */
    public function view(User $user, Invitacion $invitacion): bool
    {
        // Only project admins can view invitations
        $proyecto = $invitacion->proyecto;
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determine if the user can create an invitation in a project.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function create(User $user, Proyecto $proyecto): bool
    {
        // Only project admins can create invitations
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determine if the user can delete the invitation.
     * 
     * @param User $user
     * @param Invitacion $invitacion
     * @return bool
     */
    public function delete(User $user, Invitacion $invitacion): bool
    {
        // Only project admins can delete invitations
        $proyecto = $invitacion->proyecto;
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determine if the user can restore the invitation.
     * 
     * @param User $user
     * @param Invitacion $invitacion
     * @return bool
     */
    public function restore(User $user, Invitacion $invitacion): bool
    {
        return false;
    }

    /**
     * Determine if the user can permanently delete the invitation.
     * 
     * @param User $user
     * @param Invitacion $invitacion
     * @return bool
     */
    public function forceDelete(User $user, Invitacion $invitacion): bool
    {
        return false;
    }
}
