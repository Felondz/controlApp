<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Proyecto;

class ProyectoPolicy
{
    /**
     * Determine if the user can view any project.
     * 
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        // Authenticated users can view their own projects
        return true;
    }

    /**
     * Determine if the user can view the project.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function view(User $user, Proyecto $proyecto): bool
    {
        // Only members of the project can view it
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine if the user can create projects.
     * 
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        // All authenticated users can create projects
        return true;
    }

    /**
     * Determine if the user can update the project.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function update(User $user, Proyecto $proyecto): bool
    {
        // Only project admins can update the project
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determine if the user can delete the project.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function delete(User $user, Proyecto $proyecto): bool
    {
        // Only the project owner (creator) can delete it
        return $proyecto->user_id === $user->id;
    }

    /**
     * Determine if the user can manage members and invitations.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function manageMembersAndInvitations(User $user, Proyecto $proyecto): bool
    {
        // Only project admins can manage members
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determine if the user can restore the project.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function restore(User $user, Proyecto $proyecto): bool
    {
        return false; // Soft deletes not implemented yet
    }

    /**
     * Determine if the user can permanently delete the project.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function forceDelete(User $user, Proyecto $proyecto): bool
    {
        return false; // Soft deletes not implemented yet
    }
}
