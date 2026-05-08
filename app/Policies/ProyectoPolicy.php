<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Proyecto;

class ProyectoPolicy
{
    /**
     * Determina si el usuario puede ver cualquier proyecto.
     * 
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        // Los usuarios autenticados pueden ver sus propios proyectos
        return true;
    }

    /**
     * Determina si el usuario puede ver el proyecto.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function view(User $user, Proyecto $proyecto): bool
    {
        // El método esMiembroDe ya maneja la lógica de Super Admin y Propietario
        return $user->esMiembroDe($proyecto);
    }

    /**
     * Determina si el usuario puede crear proyectos.
     * 
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        // Todos los usuarios autenticados pueden crear proyectos
        return true;
    }

    /**
     * Determina si el usuario puede actualizar el proyecto.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function update(User $user, Proyecto $proyecto): bool
    {
        // Solo los administradores del proyecto pueden actualizarlo
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determina si el usuario puede eliminar el proyecto.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function delete(User $user, Proyecto $proyecto): bool
    {
        // Solo el propietario del proyecto (creador) puede eliminarlo
        return $proyecto->user_id === $user->id;
    }

    /**
     * Determina si el usuario puede gestionar miembros e invitaciones.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function manageMembersAndInvitations(User $user, Proyecto $proyecto): bool
    {
        // Solo los administradores del proyecto pueden gestionar miembros
        return $user->esAdminDe($proyecto);
    }

    /**
     * Determina si el usuario puede restaurar el proyecto.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function restore(User $user, Proyecto $proyecto): bool
    {
        return false; // Soft deletes no implementados aún
    }

    /**
     * Determina si el usuario puede eliminar permanentemente el proyecto.
     * 
     * @param User $user
     * @param Proyecto $proyecto
     * @return bool
     */
    public function forceDelete(User $user, Proyecto $proyecto): bool
    {
        return false; // Soft deletes no implementados aún
    }

    /**
     * Determine whether the user can add a task to the project.
     */
    public function addTask(User $user, Proyecto $proyecto): bool
    {
        return $user->esMiembroDe($proyecto);
    }

    /**
     * Determine whether the user can update a task in the project.
     */
    public function updateTask(User $user, Proyecto $proyecto): bool
    {
        return $user->esMiembroDe($proyecto);
    }

    /**
     * Determine whether the user can delete a task in the project.
     */
    public function deleteTask(User $user, Proyecto $proyecto): bool
    {
        return $user->esMiembroDe($proyecto);
    }
}
