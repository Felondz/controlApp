<?php

namespace Tests\Feature;

use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProyectosApiTest extends TestCase
{
    use RefreshDatabase;

    private ?User $usuario = null;
    private ?User $otroUsuario = null;
    private ?Proyecto $proyecto = null;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuarios de prueba
        /** @var User $usuario */
        $usuario = User::factory()->create([
            'email' => 'usuario@test.com',
            'email_verified_at' => now(),
        ]);
        $this->usuario = $usuario;

        /** @var User $otroUsuario */
        $otroUsuario = User::factory()->create([
            'email' => 'otro@test.com',
            'email_verified_at' => now(),
        ]);
        $this->otroUsuario = $otroUsuario;

        // Crear un proyecto del usuario
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create([
            'nombre' => 'Proyecto Prueba',
            'moneda_default' => 'COP',
        ]);
        $this->proyecto = $proyecto;

        // El usuario es admin del proyecto
        $this->usuario->proyectos()->attach($this->proyecto->id, ['rol' => 'admin']);
    }

    /**
     * Test 1: Usuario autenticado puede crear proyecto
     */
    public function test_authenticated_user_can_create_proyecto(): void
    {
        $response = $this->actingAs($this->usuario)->post('/api/proyectos', [
            'nombre' => 'Mi Proyecto',
            'moneda_default' => 'COP',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'nombre',
                'moneda_default',
                'created_at',
                'updated_at',
                'miembros',
            ]);

        $this->assertDatabaseHas('proyectos', [
            'nombre' => 'Mi Proyecto',
            'moneda_default' => 'COP',
        ]);

        // Verificar que el usuario es admin del nuevo proyecto
        $nuevoProyecto = Proyecto::where('nombre', 'Mi Proyecto')->first();
        $this->assertTrue($this->usuario->esAdminDe($nuevoProyecto));
    }

    /**
     * Test 2: No se puede crear proyecto sin autenticación
     */
    public function test_unauthenticated_user_cannot_create_proyecto(): void
    {
        $response = $this->postJson('/api/proyectos', [
            'nombre' => 'Nuevo Proyecto',
            'moneda_default' => 'EUR',
        ]);

        $response->assertStatus(401); // Unauthorized
    }

    /**
     * Test 3: Validar campos requeridos al crear proyecto
     */
    public function test_crear_proyecto_requiere_nombre(): void
    {
        $response = $this->actingAs($this->usuario)
            ->postJson('/api/proyectos', [
                'moneda_default' => 'EUR',
                // Falta 'nombre'
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nombre']);
    }

    /**
     * Test 4: El nombre del proyecto debe tener máximo 255 caracteres
     */
    public function test_nombre_proyecto_maximo_255_caracteres(): void
    {
        $nombreMuyLargo = str_repeat('a', 256);

        $response = $this->actingAs($this->usuario)
            ->postJson('/api/proyectos', [
                'nombre' => $nombreMuyLargo,
                'moneda_default' => 'EUR',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nombre']);
    }

    /**
     * Test 5: Moneda por defecto es opcional (se puede crear sin ella)
     */
    public function test_moneda_default_es_opcional(): void
    {
        $response = $this->actingAs($this->usuario)
            ->postJson('/api/proyectos', [
                'nombre' => 'Proyecto sin Moneda',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'nombre',
                'created_at',
                'updated_at',
            ]);

        $this->assertDatabaseHas('proyectos', [
            'nombre' => 'Proyecto sin Moneda',
        ]);
    }
    /**
     * Test 6: Usuario puede listar sus propios proyectos
     */
    public function test_usuario_puede_listar_sus_proyectos(): void
    {
        // Crear otro proyecto para el usuario
        $proyecto2 = Proyecto::factory()->create(['nombre' => 'Proyecto 2']);
        $this->usuario->proyectos()->attach($proyecto2->id, ['rol' => 'miembro']);

        $response = $this->actingAs($this->usuario)
            ->getJson('/api/proyectos');

        $response->assertStatus(200)
            ->assertJsonCount(2); // Debe tener 2 proyectos

        $response->assertJsonFragment(['nombre' => 'Proyecto Prueba'])
            ->assertJsonFragment(['nombre' => 'Proyecto 2']);
    }

    /**
     * Test 7: Usuario solo ve sus propios proyectos (no los de otros)
     */
    public function test_usuario_no_puede_ver_proyectos_de_otros(): void
    {
        $proyectoOtro = Proyecto::factory()->create(['nombre' => 'Proyecto Privado']);
        $this->otroUsuario->proyectos()->attach($proyectoOtro->id, ['rol' => 'admin']);

        $response = $this->actingAs($this->usuario)
            ->getJson('/api/proyectos');

        $response->assertStatus(200)
            ->assertJsonCount(1) // Solo debe ver su proyecto
            ->assertJsonFragment(['nombre' => 'Proyecto Prueba']);

        // No debe aparecer el proyecto del otro usuario
        $response->assertJsonMissing(['nombre' => 'Proyecto Privado']);
    }

    /**
     * Test 8: Usuario no autenticado no puede listar proyectos
     */
    public function test_unauthenticated_user_cannot_list_proyectos(): void
    {
        $response = $this->getJson('/api/proyectos');

        $response->assertStatus(401); // Unauthorized
    }

    /**
     * Test 9: Miembro puede ver detalles del proyecto
     */
    public function test_miembro_puede_ver_detalles_proyecto(): void
    {
        $response = $this->actingAs($this->usuario)
            ->getJson('/api/proyectos/' . $this->proyecto->id);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'nombre',
                'moneda_default',
                'miembros',
                'cuentas',
                'categorias',
            ])
            ->assertJsonFragment(['nombre' => 'Proyecto Prueba']);
    }

    /**
     * Test 10: No-miembro no puede ver detalles del proyecto
     */
    public function test_no_miembro_no_puede_ver_proyecto(): void
    {
        $response = $this->actingAs($this->otroUsuario)
            ->getJson('/api/proyectos/' . $this->proyecto->id);

        $response->assertStatus(403); // Forbidden
    }

    /**
     * Test 11: Usuario no autenticado no puede ver proyecto
     */
    public function test_unauthenticated_cannot_view_proyecto(): void
    {
        $response = $this->getJson('/api/proyectos/' . $this->proyecto->id);

        $response->assertStatus(401); // Unauthorized
    }

    /**
     * Test 12: Admin puede actualizar proyecto
     */
    public function test_admin_puede_actualizar_proyecto(): void
    {
        $response = $this->actingAs($this->usuario)
            ->putJson('/api/proyectos/' . $this->proyecto->id, [
                'nombre' => 'Proyecto Renombrado',
                'moneda_default' => 'MXN',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['nombre' => 'Proyecto Renombrado']);

        $this->assertDatabaseHas('proyectos', [
            'id' => $this->proyecto->id,
            'nombre' => 'Proyecto Renombrado',
            'moneda_default' => 'MXN',
        ]);
    }

    /**
     * Test 13: No-admin no puede actualizar proyecto
     */
    public function test_no_admin_no_puede_actualizar_proyecto(): void
    {
        // Agregar otro usuario como miembro (no admin)
        $this->otroUsuario->proyectos()->attach($this->proyecto->id, ['rol' => 'miembro']);

        $response = $this->actingAs($this->otroUsuario)
            ->putJson('/api/proyectos/' . $this->proyecto->id, [
                'nombre' => 'Proyecto Renombrado Maliciosamente',
            ]);

        $response->assertStatus(403); // Forbidden

        // El proyecto no debe haber cambiado
        $this->assertDatabaseHas('proyectos', [
            'id' => $this->proyecto->id,
            'nombre' => 'Proyecto Prueba', // Nombre original
        ]);
    }

    /**
     * Test 14: No-miembro no puede actualizar proyecto
     */
    public function test_no_miembro_no_puede_actualizar_proyecto(): void
    {
        $response = $this->actingAs($this->otroUsuario)
            ->putJson('/api/proyectos/' . $this->proyecto->id, [
                'nombre' => 'Intento de Cambio',
            ]);

        $response->assertStatus(403); // Forbidden
    }

    /**
     * Test 15: Admin puede actualizar solo algunos campos
     */
    public function test_admin_puede_actualizar_solo_nombre(): void
    {
        $response = $this->actingAs($this->usuario)
            ->putJson('/api/proyectos/' . $this->proyecto->id, [
                'nombre' => 'Nuevo Nombre',
                // No enviamos moneda_default
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('proyectos', [
            'id' => $this->proyecto->id,
            'nombre' => 'Nuevo Nombre',
            'moneda_default' => $this->proyecto->moneda_default,
        ]);
    }

    /**
     * Test 16: Admin puede eliminar proyecto
     */
    public function test_admin_puede_eliminar_proyecto(): void
    {
        $proyectoId = $this->proyecto->id;

        $response = $this->actingAs($this->usuario)
            ->deleteJson('/api/proyectos/' . $proyectoId);

        $response->assertStatus(204); // No Content

        // Verificar que el proyecto fue eliminado
        $this->assertDatabaseMissing('proyectos', [
            'id' => $proyectoId,
        ]);
    }

    /**
     * Test 17: No-admin no puede eliminar proyecto
     */
    public function test_no_admin_no_puede_eliminar_proyecto(): void
    {
        $this->otroUsuario->proyectos()->attach($this->proyecto->id, ['rol' => 'miembro']);

        $response = $this->actingAs($this->otroUsuario)
            ->deleteJson('/api/proyectos/' . $this->proyecto->id);

        $response->assertStatus(403); // Forbidden

        // El proyecto no debe haber sido eliminado
        $this->assertDatabaseHas('proyectos', [
            'id' => $this->proyecto->id,
        ]);
    }

    /**
     * Test 18: No-miembro no puede eliminar proyecto
     */
    public function test_no_miembro_no_puede_eliminar_proyecto(): void
    {
        $response = $this->actingAs($this->otroUsuario)
            ->deleteJson('/api/proyectos/' . $this->proyecto->id);

        $response->assertStatus(403); // Forbidden

        // El proyecto no debe haber sido eliminado
        $this->assertDatabaseHas('proyectos', [
            'id' => $this->proyecto->id,
        ]);
    }

    /**
     * Test 19: Usuario no autenticado no puede eliminar proyecto
     */
    public function test_unauthenticated_cannot_delete_proyecto(): void
    {
        $response = $this->deleteJson('/api/proyectos/' . $this->proyecto->id);

        $response->assertStatus(401); // Unauthorized
    }

    /**
     * Test 20: Eliminar proyecto también elimina relaciones
     */
    public function test_eliminar_proyecto_elimina_miembros(): void
    {
        // Agregar otro miembro
        $this->otroUsuario->proyectos()->attach($this->proyecto->id, ['rol' => 'colaborador']);

        $proyectoId = $this->proyecto->id;

        $this->actingAs($this->usuario)
            ->deleteJson('/api/proyectos/' . $proyectoId);

        // Verificar que las relaciones se eliminaron
        $this->assertDatabaseMissing('proyecto_user', [
            'proyecto_id' => $proyectoId,
        ]);
    }
}
