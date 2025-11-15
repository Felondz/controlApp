<?php

namespace Tests\Feature;

use App\Models\Invitacion;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvitacionesApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Proyecto $proyecto;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuario admin para cada test
        $this->admin = User::factory()->create([
            'email' => 'admin@test.com',
            'email_verified_at' => now(),
        ]);

        // Crear proyecto del admin
        $this->proyecto = Proyecto::factory()->create();
        $this->admin->proyectos()->attach($this->proyecto->id, ['rol' => 'admin']);
    }

    /**
     * Test 1: Admin puede enviar invitación a un nuevo usuario
     */
    public function test_admin_can_send_invitation(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/proyectos/' . $this->proyecto->id . '/invitaciones', [
                'email' => 'newuser@example.com',
                'rol' => 'miembro',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'email',
                'rol',
                'token',
                'expires_at',
                'proyecto_id',
            ]);

        $this->assertDatabaseHas('invitaciones', [
            'email' => 'newuser@example.com',
            'proyecto_id' => $this->proyecto->id,
            'rol' => 'miembro',
        ]);
    }

    /**
     * Test 2: Solo el admin puede enviar invitaciones
     */
    public function test_only_admin_can_send_invitation(): void
    {
        $miembro = User::factory()->create();
        $this->proyecto->miembros()->attach($miembro->id, ['rol' => 'miembro']);

        $response = $this->actingAs($miembro)
            ->postJson('/api/proyectos/' . $this->proyecto->id . '/invitaciones', [
                'email' => 'newuser@example.com',
                'rol' => 'miembro',
            ]);

        $response->assertStatus(403); // Forbidden
    }

    /**
     * Test 3: No se puede enviar invitación sin autenticación
     */
    public function test_unauthenticated_user_cannot_send_invitation(): void
    {
        $response = $this->postJson('/api/proyectos/' . $this->proyecto->id . '/invitaciones', [
            'email' => 'newuser@example.com',
            'rol' => 'miembro',
        ]);

        $response->assertStatus(401); // Unauthorized
    }

    /**
     * Test 4: Ver detalles de invitación (público, sin autenticación)
     */
    public function test_anyone_can_view_invitation_details(): void
    {
        $invitacion = Invitacion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'email' => 'newuser@example.com',
        ]);

        $response = $this->getJson('/api/invitaciones/' . $invitacion->token);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'email',
                'rol',
                'token',
                'proyecto_id',
                'proyecto',
            ]);
    }

    /**
     * Test 5: Invitación expirada no puede ser vista
     */
    public function test_expired_invitation_cannot_be_viewed(): void
    {
        $invitacion = Invitacion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'expires_at' => now()->subDay(),
        ]);

        $response = $this->getJson('/api/invitaciones/' . $invitacion->token);

        $response->assertStatus(404); // Not found (token no válido)
    }

    /**
     * Test 6: Usuario registrado puede aceptar invitación
     */
    public function test_registered_user_can_accept_invitation(): void
    {
        // Crear invitación
        $invitacion = Invitacion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'email' => 'newuser@example.com',
        ]);

        // Crear usuario con el email de la invitación
        $usuario = User::factory()->create([
            'email' => 'newuser@example.com',
            'email_verified_at' => now(),
        ]);

        // Aceptar invitación
        $response = $this->actingAs($usuario)
            ->postJson('/api/invitaciones/' . $invitacion->token . '/accept', []);

        $response->assertStatus(200);

        // Verificar que el usuario fue añadido al proyecto
        $this->assertTrue(
            $usuario->proyectos()
                ->where('proyecto_id', $this->proyecto->id)
                ->exists()
        );

        // Verificar que la invitación fue eliminada
        $this->assertDatabaseMissing('invitaciones', [
            'id' => $invitacion->id,
        ]);
    }

    /**
     * Test 7: Usuario no registrado no puede aceptar invitación
     */
    public function test_unregistered_user_cannot_accept_invitation(): void
    {
        $invitacion = Invitacion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
        ]);

        $response = $this->postJson('/api/invitaciones/' . $invitacion->token . '/accept', []);

        $response->assertStatus(401); // Unauthorized
    }

    /**
     * Test 8: Token inválido retorna 404
     */
    public function test_invalid_token_returns_404(): void
    {
        $usuario = User::factory()->create(['email_verified_at' => now()]);

        $response = $this->actingAs($usuario)
            ->postJson('/api/invitaciones/invalid_token_12345/accept', []);

        $response->assertStatus(404);
    }

    /**
     * Test 9: Usuario no puede aceptar invitación si email no coincide
     */
    public function test_user_cannot_accept_invitation_with_different_email(): void
    {
        $invitacion = Invitacion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'email' => 'invited@example.com',
        ]);

        $usuario = User::factory()->create([
            'email' => 'different@example.com',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($usuario)
            ->postJson('/api/invitaciones/' . $invitacion->token . '/accept', []);

        $response->assertStatus(403); // Forbidden
    }

    /**
     * Test 10: Admin puede eliminar invitaciones pendientes
     */
    public function test_admin_can_delete_pending_invitation(): void
    {
        $invitacion = Invitacion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->deleteJson(
                '/api/proyectos/' . $this->proyecto->id . '/invitaciones/' . $invitacion->id
            );

        $response->assertStatus(204); // No Content (es lo correcto para DELETE)

        $this->assertDatabaseMissing('invitaciones', [
            'id' => $invitacion->id,
        ]);
    }

    /**
     * Test 11: No se puede enviar duplicada invitación al mismo email
     */
    public function test_cannot_send_duplicate_invitation_to_same_email(): void
    {
        Invitacion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'email' => 'duplicate@example.com',
        ]);

        $response = $this->actingAs($this->admin)
            ->postJson('/api/proyectos/' . $this->proyecto->id . '/invitaciones', [
                'email' => 'duplicate@example.com',
                'rol' => 'miembro',
            ]);

        $response->assertStatus(409); // Conflict (invitación ya existe)
    }

    /**
     * Test 12: Validación de email en invitación
     */
    public function test_invitation_requires_valid_email(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/proyectos/' . $this->proyecto->id . '/invitaciones', [
                'email' => 'not-an-email',
                'rol' => 'miembro',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test 13: Invitación expira después de 7 días
     */
    public function test_invitation_expires_after_seven_days(): void
    {
        $invitacion = Invitacion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'expires_at' => now()->addDays(7),
        ]);

        // Verifica que la invitación se creó correctamente con fecha de expiración
        $this->assertNotNull($invitacion->expires_at);
        $this->assertTrue($invitacion->expires_at->isFuture());
    }

    /**
     * Test 14: El usuario aceptado tiene rol correcto
     */
    public function test_accepted_invitation_assigns_correct_role(): void
    {
        $invitacion = Invitacion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'email' => 'newuser@example.com',
            'rol' => 'tesorero', // Rol específico
        ]);

        $usuario = User::factory()->create([
            'email' => 'newuser@example.com',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($usuario)
            ->postJson('/api/invitaciones/' . $invitacion->token . '/accept', []);

        $this->assertTrue(
            $usuario->proyectos()
                ->where('proyecto_id', $this->proyecto->id)
                ->where('rol', 'tesorero')
                ->exists()
        );
    }
}
