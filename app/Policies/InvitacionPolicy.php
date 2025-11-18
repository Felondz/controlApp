<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Invitacion;
use App\Models\Proyecto;

class InvitacionPolicy
{
    /**
     * Determina si el usuario puede ver cualquier invitación del proyecto.
     * 
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determina si el usuario puede ver la invitación.
     * 
     * @param User $user
     * @param Invitacion $invitacion
     * @return bool
     */
    public function view(User $user, Invitacion $invitacion): bool
    {
        // Solo los administradores del proyecto pueden ver invitaciones
        $proyecto = $invitacion->proyecto;
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determina si el usuario puede crear una invitación en el proyecto.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function create(User $user, Proyecto $proyecto): bool
    {
        // Solo los administradores del proyecto pueden crear invitaciones
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determina si el usuario puede eliminar la invitación.
     * 
     * @param User $user
     * @param Invitacion $invitacion
     * @return bool
     */
    public function delete(User $user, Invitacion $invitacion): bool
    {
        // Solo los administradores del proyecto pueden eliminar invitaciones
        $proyecto = $invitacion->proyecto;
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determina si el usuario puede restaurar la invitación.
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
     * Determina si el usuario puede eliminar permanentemente la invitación.
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
