<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Transaccion;
use App\Models\Proyecto;

class TransaccionPolicy
{
    /**
     * Determine if the user can view any transaction in the project.
     * 
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view the transaction.
     * 
     * @param User $user
     * @param Transaccion $transaccion
     * @return bool
     */
    public function view(User $user, Transaccion $transaccion): bool
    {
        // User can view if they're a member of the project
        $proyecto = $transaccion->proyecto;
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine if the user can create a transaction in a project.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function create(User $user, Proyecto $proyecto): bool
    {
        // Only project members can create transactions
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine if the user can update the transaction.
     * 
     * @param User $user
     * @param Transaccion $transaccion
     * @return bool
     */
    public function update(User $user, Transaccion $transaccion): bool
    {
        // Only the transaction creator or project admins can update
        $proyecto = $transaccion->proyecto;
        return $transaccion->user_id === $user->id || $user->esAdminDe($proyecto);
    }

    /**
     * Determine if the user can delete the transaction.
     * 
     * @param User $user
     * @param Transaccion $transaccion
     * @return bool
     */
    public function delete(User $user, Transaccion $transaccion): bool
    {
        // Only the transaction creator or project admins can delete
        $proyecto = $transaccion->proyecto;
        return $transaccion->user_id === $user->id || $user->esAdminDe($proyecto);
    }

    /**
     * Determine if the user can restore the transaction.
     * 
     * @param User $user
     * @param Transaccion $transaccion
     * @return bool
     */
    public function restore(User $user, Transaccion $transaccion): bool
    {
        return false;
    }

    /**
     * Determine if the user can permanently delete the transaction.
     * 
     * @param User $user
     * @param Transaccion $transaccion
     * @return bool
     */
    public function forceDelete(User $user, Transaccion $transaccion): bool
    {
        return false;
    }
}
