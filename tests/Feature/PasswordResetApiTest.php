<?php

namespace Tests\Feature;

use App\Models\PasswordReset;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Tests\TestCase;

class PasswordResetApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock notifications para evitar intentar enviar correos reales
        // En testing, los correos se registran en logs (MAIL_MAILER=log)
        // pero mockamos la notificación para validar que se dispara
        Notification::fake();
    }

    /**
     * Test 1: Usuario puede solicitar restablecimiento de contraseña
     */
    public function test_usuario_puede_solicitar_reset_contraseña(): void
    {
        // Crear usuario
        /** @var User $user */
        $user = User::factory()->create([
            'email' => 'usuario@example.com',
        ]);

        // Hacer POST a forgot-password
        $response = $this->postJson('/api/forgot-password', [
            'email' => 'usuario@example.com',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Se ha enviado un enlace de restablecimiento a tu email. Expira en 1 hora.',
        ]);

        // Verificar que se creó un token en BD
        $this->assertDatabaseHas('password_resets', [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Test 2: No puede solicitar reset con email inexistente
     */
    public function test_no_puede_solicitar_reset_con_email_inexistente(): void
    {
        $response = $this->postJson('/api/forgot-password', [
            'email' => 'noexiste@example.com',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    /**
     * Test 3: Email es requerido
     */
    public function test_forgot_password_requiere_email(): void
    {
        $response = $this->postJson('/api/forgot-password', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    /**
     * Test 4: Validar token válido
     */
    public function test_puede_validar_token_valido(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email' => 'usuario@example.com',
        ]);

        // Generar token
        $token = Str::random(60);
        PasswordReset::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
        ]);

        // Validar token
        $response = $this->getJson('/api/reset-password/validate?email=usuario@example.com&token=' . $token);

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Token válido.',
            'email' => 'usuario@example.com',
        ]);
    }

    /**
     * Test 5: Token inválido retorna error
     */
    public function test_token_invalido_retorna_error(): void
    {
        User::factory()->create([
            'email' => 'usuario@example.com',
        ]);

        $response = $this->getJson('/api/reset-password/validate?email=usuario@example.com&token=token_invalido');

        $response->assertStatus(400);
        $response->assertJson(['message' => 'Token de restablecimiento inválido.']);
    }

    /**
     * Test 6: Token expirado retorna error (1 hora)
     */
    public function test_token_expirado_retorna_error(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email' => 'usuario@example.com',
        ]);

        // Crear token expirado (más de 1 hora)
        $token = Str::random(60);
        PasswordReset::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'created_at' => now()->subHours(2),
        ]);

        $response = $this->getJson('/api/reset-password/validate?email=usuario@example.com&token=' . $token);

        $response->assertStatus(400);
        $response->assertJson(['message' => 'El enlace de restablecimiento ha expirado.']);

        // Verificar que el token fue eliminado
        $this->assertDatabaseMissing('password_resets', [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Test 7: Usuario puede restablecer contraseña con token válido
     */
    public function test_usuario_puede_restablecer_contraseña(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email' => 'usuario@example.com',
            'password' => Hash::make('contraseña_antigua'),
        ]);

        // Generar token
        $token = Str::random(60);
        PasswordReset::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
        ]);

        // Restablecer contraseña
        $response = $this->postJson('/api/reset-password', [
            'email' => 'usuario@example.com',
            'token' => $token,
            'password' => 'nueva_contraseña_123',
            'password_confirmation' => 'nueva_contraseña_123',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'message' => '¡Contraseña restablecida exitosamente! Por favor, inicia sesión con tu nueva contraseña.',
        ]);

        // Verificar que la contraseña fue actualizada
        $user->refresh();
        $this->assertTrue(Hash::check('nueva_contraseña_123', $user->password));

        // Verificar que el token fue eliminado
        $this->assertDatabaseMissing('password_resets', [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Test 8: No puede restablecer con token inválido
     */
    public function test_no_puede_restablecer_con_token_invalido(): void
    {
        User::factory()->create([
            'email' => 'usuario@example.com',
        ]);

        $response = $this->postJson('/api/reset-password', [
            'email' => 'usuario@example.com',
            'token' => 'token_invalido',
            'password' => 'nueva_contraseña_123',
            'password_confirmation' => 'nueva_contraseña_123',
        ]);

        $response->assertStatus(400);
        $response->assertJson(['message' => 'Token de restablecimiento inválido.']);
    }

    /**
     * Test 9: No puede restablecer con token expirado
     */
    public function test_no_puede_restablecer_con_token_expirado(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email' => 'usuario@example.com',
        ]);

        $token = Str::random(60);
        PasswordReset::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'created_at' => now()->subHours(2),
        ]);

        $response = $this->postJson('/api/reset-password', [
            'email' => 'usuario@example.com',
            'token' => $token,
            'password' => 'nueva_contraseña_123',
            'password_confirmation' => 'nueva_contraseña_123',
        ]);

        $response->assertStatus(400);
        $response->assertJson(['message' => 'El enlace de restablecimiento ha expirado.']);
    }

    /**
     * Test 10: Contraseña debe cumplir requisitos
     */
    public function test_contraseña_debe_tener_minimo_8_caracteres(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email' => 'usuario@example.com',
        ]);

        $token = Str::random(60);
        PasswordReset::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
        ]);

        $response = $this->postJson('/api/reset-password', [
            'email' => 'usuario@example.com',
            'token' => $token,
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    /**
     * Test 11: Contraseñas deben coincidir
     */
    public function test_contraseñas_deben_coincidir(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email' => 'usuario@example.com',
        ]);

        $token = Str::random(60);
        PasswordReset::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
        ]);

        $response = $this->postJson('/api/reset-password', [
            'email' => 'usuario@example.com',
            'token' => $token,
            'password' => 'nueva_contraseña_123',
            'password_confirmation' => 'diferente_123',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    /**
     * Test 12: Email es requerido para restablecer
     */
    public function test_reset_requiere_email(): void
    {
        $response = $this->postJson('/api/reset-password', [
            'token' => 'token',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    /**
     * Test 13: Token previos se eliminan al solicitar nuevo reset
     */
    public function test_tokens_previos_se_eliminan(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email' => 'usuario@example.com',
        ]);

        // Crear primer token
        $token1 = Str::random(60);
        PasswordReset::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token1),
        ]);

        // Solicitar nuevo reset (elimina el anterior)
        $this->postJson('/api/forgot-password', [
            'email' => 'usuario@example.com',
        ]);

        // Verificar que solo hay 1 token en BD (el nuevo)
        $this->assertEquals(1, PasswordReset::where('user_id', $user->id)->count());
    }

    /**
     * Test 14: Los tokens se revocan después de restablecer (logout de todos los dispositivos)
     */
    public function test_tokens_acceso_se_revocan_tras_reset(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email' => 'usuario@example.com',
            'password' => Hash::make('contraseña_antigua'),
        ]);

        // Crear tokens de acceso (simular sesión)
        $user->createToken('token1');
        $user->createToken('token2');

        // Verificar que hay 2 tokens
        $this->assertCount(2, $user->tokens);

        // Generar token de reset
        $resetToken = Str::random(60);
        PasswordReset::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $resetToken),
        ]);

        // Restablecer contraseña
        $this->postJson('/api/reset-password', [
            'email' => 'usuario@example.com',
            'token' => $resetToken,
            'password' => 'nueva_contraseña_123',
            'password_confirmation' => 'nueva_contraseña_123',
        ]);

        // Verificar que todos los tokens fueron revocados
        $user->refresh();
        $this->assertCount(0, $user->tokens);
    }
}
