<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock Notification to prevent actual email sending
        // Tests will use Notification::assertSentTo() to verify verification emails
        Notification::fake();
    }

    /**
     * Test: Usuario registrado puede verificar email con enlace válido
     */
    public function test_usuario_puede_verificar_email_con_enlace_valido()
    {
        // Crear usuario sin email verificado
        /** @var User $user */
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        // Generar hash válido para el usuario
        $hash = sha1($user->getEmailForVerification());

        // Hacer GET al endpoint de verificación
        $response = $this->getJson("/api/email/verify/{$user->id}/{$hash}");

        $response->assertStatus(200);
        $response->assertJsonStructure(['message']);
        $response->assertJson(['message' => '¡Email verificado exitosamente! Ahora puedes loguearte.']);

        // Verificar que el email fue marcado como verificado en BD
        $user->refresh();
        $this->assertNotNull($user->email_verified_at);
    }

    /**
     * Test: Enlace de verificación inválido devuelve error
     */
    public function test_enlace_verificacion_invalido_devuelve_error()
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        // Hash inválido
        $invalidHash = 'hash_invalido_12345';

        $response = $this->getJson("/api/email/verify/{$user->id}/{$invalidHash}");

        $response->assertStatus(400);
        $response->assertJson(['message' => 'El enlace de verificación es inválido o ha expirado.']);

        // Verificar que el email NO fue marcado como verificado
        $user->refresh();
        $this->assertNull($user->email_verified_at);
    }

    /**
     * Test: Usuario inexistente devuelve 404
     */
    public function test_usuario_inexistente_devuelve_404()
    {
        $fakeUserId = 9999;
        $fakeHash = 'cualquier_hash';

        $response = $this->getJson("/api/email/verify/{$fakeUserId}/{$fakeHash}");

        $response->assertStatus(404);
        $response->assertJson(['message' => 'Usuario no encontrado.']);
    }

    /**
     * Test: Email ya verificado devuelve error
     */
    public function test_email_ya_verificado_devuelve_error()
    {
        // Crear usuario ya verificado
        /** @var User $user */
        $user = User::factory()->create();

        $hash = sha1($user->getEmailForVerification());

        $response = $this->getJson("/api/email/verify/{$user->id}/{$hash}");

        $response->assertStatus(400);
        $response->assertJson(['message' => 'El email ya había sido verificado.']);
    }

    /**
     * Test: Usuario autenticado puede re-enviar enlace de verificación
     */
    public function test_usuario_autenticado_puede_reenviar_enlace_verificacion()
    {
        // Crear usuario sin email verificado
        /** @var User $user */
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $response = $this->actingAs($user)->postJson('/api/email/verification-notification');

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Enlace de verificación enviado a tu email.']);
    }

    /**
     * Test: Usuario con email verificado no puede re-enviar enlace
     */
    public function test_usuario_verificado_no_puede_reenviar_enlace()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/email/verification-notification');

        $response->assertStatus(422);
        $response->assertJson(['message' => 'Email ya verificado.']);
    }

    /**
     * Test: Usuario no autenticado no puede re-enviar enlace
     */
    public function test_usuario_no_autenticado_no_puede_reenviar_enlace()
    {
        $response = $this->postJson('/api/email/verification-notification');

        $response->assertStatus(401);
    }
}
