<?php

namespace App\Modules\Finance\Policies;

use App\Models\User;
use App\Modules\Finance\Models\Categoria;
use App\Models\Proyecto;

class CategoriaPolicy
{
    /**
     * Determina si el usuario puede ver cualquier categoría del proyecto.
     * 
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determina si el usuario puede ver la categoría.
     * 
     * @param User $user
     * @param Categoria $categoria
     * @return bool
     */
    public function view(User $user, Categoria $categoria): bool
    {
        // El usuario puede verla si es miembro del proyecto
        $proyecto = $categoria->proyecto;
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determina si el usuario puede crear una categoría en el proyecto.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function create(User $user, Proyecto $proyecto): bool
    {
        // Solo los miembros del proyecto pueden crear categorías
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determina si el usuario puede actualizar la categoría.
     * 
     * @param User $user
     * @param Categoria $categoria
     * @return bool
     */
    public function update(User $user, Categoria $categoria): bool
    {
        // Los miembros pueden actualizar categorías en su proyecto
        $proyecto = $categoria->proyecto;
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determina si el usuario puede eliminar la categoría.
     * 
     * @param User $user
     * @param Categoria $categoria
     * @return bool
     */
    public function delete(User $user, Categoria $categoria): bool
    {
        // Solo los administradores del proyecto pueden eliminar categorías
        $proyecto = $categoria->proyecto;
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determina si el usuario puede restaurar la categoría.
     * 
     * @param User $user
     * @param Categoria $categoria
     * @return bool
     */
    public function restore(User $user, Categoria $categoria): bool
    {
        return false;
    }

    /**
     * Determina si el usuario puede eliminar permanentemente la categoría.
     * 
     * @param User $user
     * @param Categoria $categoria
     * @return bool
     */
    public function forceDelete(User $user, Categoria $categoria): bool
    {
        return false;
    }
}
