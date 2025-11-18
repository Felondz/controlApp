<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Cuenta;
use App\Models\Proyecto;

class CuentaPolicy
{
    /**
     * Determine if the user can view any account in the project.
     * 
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view the account.
     * 
     * @param User $user
     * @param Cuenta $cuenta
     * @return bool
     */
    public function view(User $user, Cuenta $cuenta): bool
    {
        // User can view if they're a member of the project
        $proyecto = $cuenta->proyecto;
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine if the user can create an account in a project.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function create(User $user, Proyecto $proyecto): bool
    {
        // Only project members can create accounts
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine if the user can update the account.
     * 
     * @param User $user
     * @param Cuenta $cuenta
     * @return bool
     */
    public function update(User $user, Cuenta $cuenta): bool
    {
        // Members can update accounts in their project
        $proyecto = $cuenta->proyecto;
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine if the user can delete the account.
     * 
     * @param User $user
     * @param Cuenta $cuenta
     * @return bool
     */
    public function delete(User $user, Cuenta $cuenta): bool
    {
        // Only project admins can delete accounts
        $proyecto = $cuenta->proyecto;
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determine if the user can restore the account.
     * 
     * @param User $user
     * @param Cuenta $cuenta
     * @return bool
     */
    public function restore(User $user, Cuenta $cuenta): bool
    {
        return false;
    }

    /**
     * Determine if the user can permanently delete the account.
     * 
     * @param User $user
     * @param Cuenta $cuenta
     * @return bool
     */
    public function forceDelete(User $user, Cuenta $cuenta): bool
    {
        return false;
    }
}
