<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\SuperAdminSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SuperAdminSeederTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_super_admin_if_credentials_are_present()
    {
        // 1. Simular variables de entorno (usando Config o putenv no siempre funciona con env(), 
        // pero para seeders que usan env() directo es tricky en tests. 
        // Laravel cachea env. Lo mejor es mockear el comportamiento o asegurar que el seeder use config().
        // Por ahora, vamos a intentar setear las variables antes de correr el seeder.
        
        // NOTA: env() en tests a veces es inmutable. 
        // Una mejor práctica es que el Seeder lea de config, pero el usuario pidió env.
        // Vamos a forzar las variables para este proceso.
        
        // Hack para testear env() calls:
        // En realidad, no podemos cambiar env() en runtime fácilmente si ya se cargó.
        // Pero podemos intentar. Si falla, refactorizaremos el Seeder para usar config().
        
        // Vamos a asumir que el Seeder lee de env().
        // Para testear esto robustamente, deberíamos refactorizar el Seeder para leer de config('controlapp.super_admin')
        // y en el test usar Config::set().
        
        // PERO, para cumplir con lo que tenemos, vamos a probar si putenv funciona en este entorno.
        putenv('SUPER_ADMIN_EMAIL=admin@test.com');
        putenv('SUPER_ADMIN_PASSWORD=password123');

        // Ejecutar Seeder
        $this->seed(SuperAdminSeeder::class);

        // Verificar
        $this->assertDatabaseHas('users', [
            'email' => 'admin@test.com',
            'is_super_admin' => true,
        ]);

        $user = User::where('email', 'admin@test.com')->first();
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    /** @test */
    public function it_updates_existing_super_admin_password()
    {
        putenv('SUPER_ADMIN_EMAIL=admin@test.com');
        putenv('SUPER_ADMIN_PASSWORD=newpassword');

        // Crear usuario previo con password viejo
        User::factory()->create([
            'email' => 'admin@test.com',
            'password' => Hash::make('oldpassword'),
            'is_super_admin' => false,
        ]);

        // Ejecutar Seeder
        $this->seed(SuperAdminSeeder::class);

        // Verificar actualización
        $user = User::where('email', 'admin@test.com')->first();
        $this->assertTrue(Hash::check('newpassword', $user->password));
        $this->assertTrue((bool)$user->is_super_admin);
    }

    /** @test */
    public function it_skips_creation_if_env_vars_are_missing()
    {
        // Limpiar vars
        putenv('SUPER_ADMIN_EMAIL');
        putenv('SUPER_ADMIN_PASSWORD');

        $this->seed(SuperAdminSeeder::class);

        $this->assertDatabaseCount('users', 0);
    }
}
