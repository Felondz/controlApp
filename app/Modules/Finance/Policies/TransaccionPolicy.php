<?php

namespace App\Modules\Finance\Policies;

use App\Models\User;
use App\Modules\Finance\Models\Transaccion;
use App\Models\Proyecto;

class TransaccionPolicy
{
    /**
     * Determina si el usuario puede ver cualquier transacción del proyecto.
     * 
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determina si el usuario puede ver la transacción.
     * 
     * @param User $user
     * @param Transaccion $transaccion
     * @return bool
     */
    public function view(User $user, Transaccion $transaccion): bool
    {
        // El usuario puede verla si es miembro del proyecto
        $proyecto = $transaccion->proyecto;
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determina si el usuario puede crear una transacción en el proyecto.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function create(User $user, Proyecto $proyecto): bool
    {
        // Solo los miembros del proyecto pueden crear transacciones
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determina si el usuario puede actualizar la transacción.
     * 
     * @param User $user
     * @param Transaccion $transaccion
     * @return bool
     */
    public function update(User $user, Transaccion $transaccion): bool
    {
        // Solo el creador de la transacción o administradores del proyecto pueden actualizar
        $proyecto = $transaccion->proyecto;
        return $transaccion->user_id === $user->id || $user->esAdminDe($proyecto);
    }

    /**
     * Determina si el usuario puede eliminar la transacción.
     * 
     * @param User $user
     * @param Transaccion $transaccion
     * @return bool
     */
    public function delete(User $user, Transaccion $transaccion): bool
    {
        // Solo el creador de la transacción o administradores del proyecto pueden eliminar
        $proyecto = $transaccion->proyecto;
        return $transaccion->user_id === $user->id || $user->esAdminDe($proyecto);
    }

    /**
     * Determina si el usuario puede restaurar la transacción.
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
     * Determina si el usuario puede eliminar permanentemente la transacción.
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
