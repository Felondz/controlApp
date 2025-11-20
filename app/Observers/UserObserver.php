<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Proyecto;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        // 1. Crear el proyecto personal y capturar la instancia
        $personalProject = Proyecto::create([
            'nombre' => 'Finanzas Personales',
            'moneda_default' => 'COP',
            'user_id' => $user->id,
            'es_personal' => true,
            'visible_en_listado' => false,
        ]);

        // 2. ADJUNTAR LA RELACIÓN many-to-many
        // Esto asocia el proyecto recién creado con el usuario a través de la tabla pivote
        // y le asigna el rol de 'admin' al creador.
        $user->proyectos()->attach($personalProject->id, ['rol' => 'admin']);
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
