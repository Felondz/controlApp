<?php

namespace Tests\Feature\Api;

use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProyectoMiembrosApiTest extends TestCase
{
    use RefreshDatabase;

    private ?User $admin = null;
    private ?User $miembro = null;
    private ?User $otroUsuario = null;
    private ?Proyecto $proyecto = null;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuarios
        /** @var User $admin */
        $admin = User::factory()->create([
            'email' => 'admin@test.com',
            'email_verified_at' => now(),
        ]);
        $this->admin = $admin;

        /** @var User $miembro */
        $miembro = User::factory()->create([
            'email' => 'miembro@test.com',
            'email_verified_at' => now(),
        ]);
        $this->miembro = $miembro;

        /** @var User $otroUsuario */
        $otroUsuario = User::factory()->create([
            'email' => 'otro@test.com',
            'email_verified_at' => now(),
        ]);
        $this->otroUsuario = $otroUsuario;

        // Crear proyecto con admin
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $this->proyecto = $proyecto;

        $this->admin->proyectos()->attach($this->proyecto->id, ['rol' => 'admin']);
        $this->miembro->proyectos()->attach($this->proyecto->id, ['rol' => 'miembro']);
    }

    /**
     * Test 1: Admin puede listar miembros del proyecto
     */
    public function test_admin_puede_listar_miembros(): void
    {
        $response = $this->actingAs($this->admin)
            ->getJson('/api/proyectos/' . $this->proyecto->id . '/miembros');

        $response->assertStatus(200)
            ->assertJsonCount(2); // Admin y miembro

        $response->assertJsonFragment(['email' => 'admin@test.com'])
            ->assertJsonFragment(['email' => 'miembro@test.com']);
    }

    /**
     * Test 2: Miembro puede listar otros miembros del proyecto
     */
    public function test_miembro_puede_listar_miembros(): void
    {
        $response = $this->actingAs($this->miembro)
            ->getJson('/api/proyectos/' . $this->proyecto->id . '/miembros');

        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    /**
     * Test 3: No-miembro no puede listar miembros del proyecto
     */
    public function test_no_miembro_no_puede_listar(): void
    {
        $response = $this->actingAs($this->otroUsuario)
            ->getJson('/api/proyectos/' . $this->proyecto->id . '/miembros');

        $response->assertStatus(403); // Forbidden
    }

    /**
     * Test 4: No autenticado no puede listar miembros
     */
    public function test_no_autenticado_no_puede_listar(): void
    {
        $response = $this->getJson('/api/proyectos/' . $this->proyecto->id . '/miembros');

        $response->assertStatus(401); // Unauthorized
    }

    /**
     * Test 5: Admin puede cambiar rol de miembro (miembro -> admin)
     */
    public function test_admin_puede_cambiar_rol_a_miembro(): void
    {
        $response = $this->actingAs($this->admin)
            ->putJson('/api/proyectos/' . $this->proyecto->id . '/miembros/' . $this->miembro->id, [
                'rol' => 'admin',
            ]);

        $response->assertStatus(200);

        // Verificar que el rol cambió
        $this->assertTrue(
            $this->miembro->esAdminDe($this->proyecto)
        );
    }

    /**
     * Test 6: Admin puede cambiar rol de miembro (admin -> miembro)
     */
    public function test_admin_puede_degradar_miembro(): void
    {
        // Agregar otro admin primero
        $otro = User::factory()->create();
        $otro->proyectos()->attach($this->proyecto->id, ['rol' => 'admin']);

        $response = $this->actingAs($this->admin)
            ->putJson('/api/proyectos/' . $this->proyecto->id . '/miembros/' . $otro->id, [
                'rol' => 'miembro',
            ]);

        $response->assertStatus(200);

        // Verificar que el rol cambió
        $this->assertFalse(
            $otro->esAdminDe($this->proyecto)
        );
    }

    /**
     * Test 7: Miembro no puede cambiar roles
     */
    public function test_miembro_no_puede_cambiar_roles(): void
    {
        $response = $this->actingAs($this->miembro)
            ->putJson('/api/proyectos/' . $this->proyecto->id . '/miembros/' . $this->miembro->id, [
                'rol' => 'admin',
            ]);

        $response->assertStatus(403); // Forbidden
    }

    /**
     * Test 8: No se puede cambiar rol a valor inválido
     */
    public function test_no_puede_cambiar_a_rol_invalido(): void
    {
        $response = $this->actingAs($this->admin)
            ->putJson('/api/proyectos/' . $this->proyecto->id . '/miembros/' . $this->miembro->id, [
                'rol' => 'superadmin', // Rol no válido
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['rol']);
    }

    /**
     * Test 9: No se puede eliminar el último admin del proyecto
     */
    public function test_no_puede_eliminar_ultimo_admin(): void
    {
        // El admin intenta eliminarse a sí mismo (es el único admin)
        $response = $this->actingAs($this->admin)
            ->deleteJson('/api/proyectos/' . $this->proyecto->id . '/miembros/' . $this->admin->id);

        $response->assertStatus(403)
            ->assertJsonFragment(['message' => 'No puedes eliminar/abandonar si eres el último administrador del proyecto.']);

        // Verificar que el admin sigue siendo miembro
        $this->assertTrue(
            $this->admin->esMiembroDe($this->proyecto)
        );
    }

    /**
     * Test 10: Admin puede eliminar miembro regular
     */
    public function test_admin_puede_eliminar_miembro(): void
    {
        $response = $this->actingAs($this->admin)
            ->deleteJson('/api/proyectos/' . $this->proyecto->id . '/miembros/' . $this->miembro->id);

        $response->assertStatus(204); // No Content

        // Verificar que el miembro fue eliminado
        $this->assertFalse(
            $this->miembro->esMiembroDe($this->proyecto)
        );
    }

    /**
     * Test 11: Miembro puede abandonar el proyecto por sí mismo
     */
    public function test_miembro_puede_abandonar_proyecto(): void
    {
        // Crear un nuevo proyecto para que el admin tenga un lugar donde quedarse
        $proyecto2 = Proyecto::factory()->create();
        $this->admin->proyectos()->attach($proyecto2->id, ['rol' => 'admin']);

        // Crear otro usuario para abandonar el proyecto
        /** @var User $usuario */
        $usuario = User::factory()->create();
        $usuario->proyectos()->attach($this->proyecto->id, ['rol' => 'miembro']);

        $response = $this->actingAs($usuario)
            ->deleteJson('/api/proyectos/' . $this->proyecto->id . '/miembros/' . $usuario->id);

        $response->assertStatus(204); // No Content

        // Verificar que el usuario fue eliminado
        $this->assertFalse(
            $usuario->esMiembroDe($this->proyecto)
        );
    }

    /**
     * Test 12: No-miembro no puede eliminar a otros
     */
    public function test_no_miembro_no_puede_eliminar(): void
    {
        $response = $this->actingAs($this->otroUsuario)
            ->deleteJson('/api/proyectos/' . $this->proyecto->id . '/miembros/' . $this->miembro->id);

        $response->assertStatus(403); // Forbidden

        // Verificar que el miembro sigue ahí
        $this->assertTrue(
            $this->miembro->esMiembroDe($this->proyecto)
        );
    }
}
