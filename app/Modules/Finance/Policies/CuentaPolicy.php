<?php

namespace App\Modules\Finance\Policies;

use App\Models\User;
use App\Modules\Finance\Models\Cuenta;
use App\Models\Proyecto;

class CuentaPolicy
{
    /**
     * Determina si el usuario puede ver cualquier cuenta del proyecto.
     * 
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determina si el usuario puede ver la cuenta.
     * 
     * @param User $user
     * @param Cuenta $cuenta
     * @return bool
     */
    public function view(User $user, Cuenta $cuenta): bool
    {
        // El usuario puede verla si es miembro del proyecto
        $proyecto = $cuenta->proyecto;
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determina si el usuario puede crear una cuenta en el proyecto.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function create(User $user, Proyecto $proyecto): bool
    {
        // Solo los miembros del proyecto pueden crear cuentas
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determina si el usuario puede actualizar la cuenta.
     * 
     * @param User $user
     * @param Cuenta $cuenta
     * @return bool
     */
    public function update(User $user, Cuenta $cuenta): bool
    {
        // Los miembros pueden actualizar cuentas en su proyecto
        $proyecto = $cuenta->proyecto;
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determina si el usuario puede eliminar la cuenta.
     * 
     * @param User $user
     * @param Cuenta $cuenta
     * @return bool
     */
    public function delete(User $user, Cuenta $cuenta): bool
    {
        // Solo los administradores del proyecto pueden eliminar cuentas
        $proyecto = $cuenta->proyecto;
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determina si el usuario puede restaurar la cuenta.
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
     * Determina si el usuario puede eliminar permanentemente la cuenta.
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
