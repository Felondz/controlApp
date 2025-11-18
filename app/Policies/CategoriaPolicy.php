<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Categoria;
use App\Models\Proyecto;

class CategoriaPolicy
{
    /**
     * Determine if the user can view any category in the project.
     * 
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view the category.
     * 
     * @param User $user
     * @param Categoria $categoria
     * @return bool
     */
    public function view(User $user, Categoria $categoria): bool
    {
        // User can view if they're a member of the project
        $proyecto = $categoria->proyecto;
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine if the user can create a category in a project.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function create(User $user, Proyecto $proyecto): bool
    {
        // Only project members can create categories
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine if the user can update the category.
     * 
     * @param User $user
     * @param Categoria $categoria
     * @return bool
     */
    public function update(User $user, Categoria $categoria): bool
    {
        // Members can update categories in their project
        $proyecto = $categoria->proyecto;
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine if the user can delete the category.
     * 
     * @param User $user
     * @param Categoria $categoria
     * @return bool
     */
    public function delete(User $user, Categoria $categoria): bool
    {
        // Only project admins can delete categories
        $proyecto = $categoria->proyecto;
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determine if the user can restore the category.
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
     * Determine if the user can permanently delete the category.
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
