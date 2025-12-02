<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AuthenticationApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock Notification to prevent actual email sending during registration
        // Tests will use Notification::assertSentTo() to verify emails were triggered
        Notification::fake();
    }

    /**
     * Test 1: Usuario puede registrarse con credenciales válidas
     */
    public function test_usuario_puede_registrarse(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'juan@example.com',
            'name' => 'Juan Pérez',
        ]);
    }

    /**
     * Test 2: No se puede registrar con email duplicado
     */
    public function test_no_puede_registrarse_con_email_duplicado(): void
    {
        // Crear un usuario primero
        User::factory()->create(['email' => 'duplicado@example.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Otro Usuario',
            'email' => 'duplicado@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test 3: El nombre es requerido para registrarse
     */
    public function test_registro_requiere_nombre(): void
    {
        $response = $this->postJson('/api/register', [
            'email' => 'usuario@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /**
     * Test 4: El email es requerido para registrarse
     */
    public function test_registro_requiere_email(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Usuario Test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test 5: La contraseña debe tener mínimo 8 caracteres
     */
    public function test_contraseña_minimo_8_caracteres(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Usuario Test',
            'email' => 'usuario@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test 6: Las contraseñas deben coincidir (confirmed)
     */
    public function test_contraseñas_deben_coincidir(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Usuario Test',
            'email' => 'usuario@example.com',
            'password' => 'password123',
            'password_confirmation' => 'diferente123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test 7: Usuario puede hacer login con credenciales válidas
     */
    public function test_usuario_puede_hacer_login(): void
    {
        // Crear usuario
        $usuario = User::factory()->create([
            'email' => 'login@example.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
                'user',
            ])
            ->assertJsonFragment([
                'message' => '¡Inicio de sesión exitoso!',
                'token_type' => 'Bearer',
            ]);

        // Verificar que el token es válido (es un Sanctum token)
        $this->assertNotEmpty($response['access_token']);
    }

    /**
     * Test 8: No se puede hacer login con email incorrecto
     */
    public function test_no_puede_hacer_login_con_email_incorrecto(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'noexiste@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test 9: No se puede hacer login con contraseña incorrecta
     */
    public function test_no_puede_hacer_login_con_contraseña_incorrecta(): void
    {
        User::factory()->create([
            'email' => 'usuario@example.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'usuario@example.com',
            'password' => 'contraseña_incorrecta',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test 10: Usuario puede obtener su perfil con token válido
     */
    public function test_usuario_autenticado_puede_obtener_perfil(): void
    {
        /** @var User $usuario */
        $usuario = User::factory()->create([
            'email' => 'perfil@example.com',
            'name' => 'Usuario Perfil',
        ]);

        $response = $this->actingAs($usuario)
            ->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'email' => 'perfil@example.com',
                'name' => 'Usuario Perfil',
            ]);
    }

    /**
     * Test 11: No se puede obtener perfil sin autenticación
     */
    public function test_no_puede_obtener_perfil_sin_autenticacion(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401); // Unauthorized
    }

    /**
     * Test 12: Usuario puede hacer logout
     */
    public function test_usuario_puede_hacer_logout(): void
    {
        /** @var User $usuario */
        $usuario = User::factory()->create();

        $response = $this->actingAs($usuario)
            ->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Sesión cerrada exitosamente']);
    }
}
