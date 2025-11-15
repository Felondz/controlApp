<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class GrantSuperAdmin extends Command
{
    /**
     * El nombre y la firma del comando de consola.
     * {email} = un argumento requerido
     */
    protected $signature = 'app:grant-super-admin {email}';

    /**
     * La descripción del comando de consola.
     */
    protected $description = 'Promueve a un usuario para que sea Super Administrador';

    /**
     * Ejecuta el comando de consola.
     */
    public function handle()
    {
        // 1. Obtenemos el email que el usuario escribió en la terminal
        $email = $this->argument('email');

        // 2. Buscamos al usuario en la base de datos
        $user = User::where('email', $email)->first();

        // 3. Verificamos si el usuario existe
        if (!$user) {
            $this->error("Error: No se encontró ningún usuario con el email '{$email}'.");
            return 1;
        }

        // 4. Verificamos si ya es super admin
        if ($user->is_super_admin) {
            $this->warn("Advertencia: El usuario '{$user->name}' ya es un Super Administrador.");
            return 0;
        }

        // 5. Promovemos al usuario
        $user->is_super_admin = true;
        $user->save();

        // 6. Damos un mensaje de éxito
        $this->info("¡Éxito! El usuario '{$user->name}' ($email) ha sido promovido a Super Administrador.");
        return 0;
    }
}
