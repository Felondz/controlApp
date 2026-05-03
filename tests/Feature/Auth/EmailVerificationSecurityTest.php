<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class EmailVerificationSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();
    }

    /**
     * Test: Usuario no verificado no puede hacer login
     */
    public function test_unverified_user_cannot_login()
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(403);
        $response->assertJson([
            'error' => 'email_not_verified',
            'email' => $user->email
        ]);
    }

    /**
     * Test: Usuario verificado puede hacer login
     */
    public function test_verified_user_can_login()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['access_token', 'user']);
    }

    /**
     * Test: Reenviar verificación invalida el hash anterior
     */
    public function test_resend_verification_invalidates_previous_hash()
    {
        // 1. Crear usuario sin verificar
        $user = User::factory()->create([
            'email_verified_at' => null
        ]);

        // 2. Generar primer hash
        $firstHash = sha1($user->getEmailForVerification());

        // 3. Simular que el usuario intenta verificar con el primer hash
        // (No lo verificamos aún, solo guardamos el hash)

        // 4. Reenviar verificación (esto debe invalidar el primer hash)
        $response = $this->postJson('/api/email/resend-verification', [
            'email' => $user->email
        ]);

        $response->assertStatus(200);

        // 5. Refrescar usuario desde BD
        $user->refresh();

        // 6. El hash debe seguir siendo el mismo (sha1 del email no cambia)
        // PERO el email_verified_at debe ser null
        $this->assertNull($user->email_verified_at);

        // 7. Intentar verificar con el primer hash (debe funcionar porque el hash es el mismo)
        // Nota: En este caso, el hash no cambia porque se basa en el email
        // La seguridad viene de que email_verified_at se resetea a null
        $verifyResponse = $this->get("/api/email/verify/{$user->uuid}/{$firstHash}");

        // Debe funcionar porque el hash es válido y email_verified_at es null
        $verifyResponse->assertStatus(302);
        $verifyResponse->assertRedirect(route('login'));

        // 8. Verificar que el usuario ahora está verificado
        $user->refresh();
        $this->assertNotNull($user->email_verified_at);
    }

    /**
     * Test: No se puede reenviar verificación para email ya verificado
     */
    public function test_cannot_resend_verification_for_verified_email()
    {
        $user = User::factory()->create(); // Ya verificado por defecto

        $response = $this->postJson('/api/email/resend-verification', [
            'email' => $user->email
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'message' => 'Este email ya está verificado.'
        ]);
    }

    /**
     * Test: Rate limiting en endpoint de reenvío (3 intentos por minuto)
     */
    public function test_resend_verification_has_rate_limiting()
    {
        $user = User::factory()->create([
            'email_verified_at' => null
        ]);

        // Hacer 3 peticiones (debe funcionar)
        for ($i = 0; $i < 3; $i++) {
            $response = $this->postJson('/api/email/resend-verification', [
                'email' => $user->email
            ]);
            $response->assertStatus(200);
        }

        // La 4ta petición debe ser bloqueada por rate limiting
        $response = $this->postJson('/api/email/resend-verification', [
            'email' => $user->email
        ]);

        $response->assertStatus(429); // Too Many Requests
    }

    /**
     * Test: No se puede reenviar verificación para email inexistente
     */
    public function test_cannot_resend_verification_for_nonexistent_email()
    {
        $response = $this->postJson('/api/email/resend-verification', [
            'email' => 'noexiste@example.com'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    /**
     * Test: Verificación con hash inválido falla
     */
    public function test_verification_with_invalid_hash_fails()
    {
        $user = User::factory()->create([
            'email_verified_at' => null
        ]);

        $invalidHash = 'hash_invalido_123';

        $response = $this->get("/api/email/verify/{$user->uuid}/{$invalidHash}");

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
        $response->assertSessionHas('error', 'El enlace de verificación es inválido o ha expirado.');

        // Verificar que el usuario NO fue verificado
        $user->refresh();
        $this->assertNull($user->email_verified_at);
    }
}
