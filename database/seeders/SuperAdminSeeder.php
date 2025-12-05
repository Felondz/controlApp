<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Obtener credenciales de variables de entorno
        $email = env('SUPER_ADMIN_EMAIL');
        $password = env('SUPER_ADMIN_PASSWORD');

        // 2. Validar que existan (para no crear usuarios vacíos accidentalmente)
        if (empty($email) || empty($password)) {
            $this->command->warn('⚠️ SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set in .env. Skipping SuperAdmin creation.');
            return;
        }

        // 3. Crear o Actualizar el SuperAdmin
        $user = User::updateOrCreate(
            ['email' => $email], // Buscar por email
            [
                'name' => 'Super Admin',
                'password' => Hash::make($password),
                'email_verified_at' => now(),
                'is_super_admin' => true, // ¡Activar God Mode!
            ]
        );

        $this->command->info("✅ SuperAdmin user configured: {$email}");
    }
}
