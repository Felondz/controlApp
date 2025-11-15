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
        // Crear proyecto de finanzas personales automáticamente
        Proyecto::create([
            'nombre' => 'Finanzas Personales',
            'moneda_default' => 'COP',
            'user_id' => $user->id,
            'es_personal' => true,
            'visible_en_listado' => false, // Oculto del listado normal
        ]);
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
