<?php

namespace Tests\Feature\Api;

use App\Models\Proyecto;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProyectosApiTest extends TestCase
{
    use RefreshDatabase;

    protected $usuario;
    protected $proyecto;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->usuario = User::factory()->create();
        $this->token = $this->usuario->createToken('test-token')->plainTextToken;
        $this->proyecto = Proyecto::factory()->create();
        $this->proyecto->miembros()->attach($this->usuario->id, ['rol' => 'admin']);
    }

    /**
     * Test 1: Usuario autenticado puede crear proyecto
     */
    public function test_authenticated_user_can_create_proyecto(): void
    {
        $response = $this->actingAs($this->usuario)->post('/api/proyectos', [
            'nombre' => 'Mi Proyecto',
            'moneda_default' => 'COP',
            'modules' => ['finance'],
            'theme' => 'purple-modern',
            'typography' => 'sans',
            'descripcion' => 'Una descripción de prueba',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'nombre',
                'moneda_default',
                'created_at',
                'updated_at',
                'miembros',
                'theme',
                'typography',
                'modules',
            ]);

        $this->assertDatabaseHas('proyectos', [
            'nombre' => 'Mi Proyecto',
            'moneda_default' => 'COP',
            'theme' => 'purple-modern',
            'typography' => 'sans',
        ]);

        // Verificar que el usuario es admin del nuevo proyecto
        $nuevoProyecto = Proyecto::where('nombre', 'Mi Proyecto')->first();
        $this->assertTrue($this->usuario->esAdminDe($nuevoProyecto));
    }

    /**
     * Test 1.1: Usuario puede crear proyecto con imagen
     */
    public function test_authenticated_user_can_create_proyecto_with_image(): void
    {
        Storage::fake('local');
        $file = UploadedFile::fake()->image('project.jpg');

        $response = $this->actingAs($this->usuario)->post('/api/proyectos', [
            'nombre' => 'Proyecto con Imagen',
            'moneda_default' => 'USD',
            'modules' => ['finance'],
            'image' => $file,
        ]);

        $response->assertStatus(201);

        $proyecto = Proyecto::where('nombre', 'Proyecto con Imagen')->first();
        $this->assertNotNull($proyecto->image_path);
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('local');
        $disk->assertExists($proyecto->image_path);
    }

    /**
     * Test 2: No se puede crear proyecto sin autenticación
     */
    public function test_unauthenticated_user_cannot_create_proyecto(): void
    {
        $response = $this->postJson('/api/proyectos', [
            'nombre' => 'Proyecto Intruso',
            'moneda_default' => 'USD',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test 3: Validación - Nombre requerido
     */
    public function test_crear_proyecto_requiere_nombre(): void
    {
        $response = $this->actingAs($this->usuario)->postJson('/api/proyectos', [
            'moneda_default' => 'USD',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nombre']);
    }

    /**
     * Test 4: Validación - Nombre máximo 255 caracteres
     */
    public function test_nombre_proyecto_maximo_255_caracteres(): void
    {
        $nombreLargo = str_repeat('a', 256);
        $response = $this->actingAs($this->usuario)->postJson('/api/proyectos', [
            'nombre' => $nombreLargo,
            'moneda_default' => 'USD',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nombre']);
    }

    /**
     * Test 5: Moneda default es opcional (pero si se envía, debe ser válida)
     */
    /**
     * Test 5: Moneda default es obligatoria
     */
    #[Test]
    public function moneda_default_es_opcional()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson(route('proyectos.store'), [
                'nombre' => 'Proyecto Sin Moneda',
                'modules' => ['finance'],
            ]);

        $response->assertStatus(201);
    }

    /**
     * Test 6: Usuario puede listar sus proyectos
     */
    public function test_usuario_puede_listar_sus_proyectos(): void
    {
        // El usuario ya tiene un proyecto creado en setUp
        $response = $this->actingAs($this->usuario)->getJson('/api/proyectos');

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['nombre' => $this->proyecto->nombre]);
    }

    /**
     * Test 7: Usuario no puede ver proyectos de otros donde no es miembro
     */
    public function test_usuario_no_puede_ver_proyectos_de_otros(): void
    {
        $otroUsuario = User::factory()->create();
        $otroProyecto = Proyecto::factory()->create();
        $otroProyecto->miembros()->attach($otroUsuario->id, ['rol' => 'admin']);

        $response = $this->actingAs($this->usuario)->getJson('/api/proyectos');

        $response->assertStatus(200)
            ->assertJsonMissing(['nombre' => $otroProyecto->nombre]);
    }

    /**
     * Test 8: No autenticado no puede listar
     */
    public function test_unauthenticated_user_cannot_list_proyectos(): void
    {
        $response = $this->getJson('/api/proyectos');
        $response->assertStatus(401);
    }

    /**
     * Test 9: Miembro puede ver detalles de proyecto
     */
    public function test_miembro_puede_ver_detalles_proyecto(): void
    {
        $response = $this->actingAs($this->usuario)->getJson('/api/proyectos/' . $this->proyecto->uuid);

        $response->assertStatus(200)
            ->assertJson(['id' => $this->proyecto->id]);
    }

    /**
     * Test 10: No miembro no puede ver proyecto (403 o 404)
     */
    public function test_no_miembro_no_puede_ver_proyecto(): void
    {
        $otroUsuario = User::factory()->create();

        $response = $this->actingAs($otroUsuario)->getJson('/api/proyectos/' . $this->proyecto->uuid);

        // Policy view: return $user->esMiembroDe($proyecto);
        $response->assertStatus(403);
    }

    /**
     * Test 11: No autenticado no puede ver proyecto
     */
    public function test_unauthenticated_cannot_view_proyecto(): void
    {
        $response = $this->getJson('/api/proyectos/' . $this->proyecto->uuid);
        $response->assertStatus(401);
    }

    /**
     * Test 12: Admin puede actualizar proyecto
     */
    public function test_admin_puede_actualizar_proyecto(): void
    {
        $response = $this->actingAs($this->usuario)
            ->putJson('/api/proyectos/' . $this->proyecto->uuid, [
                'nombre' => 'Proyecto Renombrado',
                'moneda_default' => 'EUR',
                'theme' => 'dark-blue',
                'typography' => 'serif',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['nombre' => 'Proyecto Renombrado']);

        $this->assertDatabaseHas('proyectos', [
            'id' => $this->proyecto->id,
            'nombre' => 'Proyecto Renombrado',
            'moneda_default' => 'EUR',
            'theme' => 'dark-blue',
            'typography' => 'serif',
        ]);
    }

    /**
     * Test 12.1: Admin puede actualizar imagen de proyecto
     */
    public function test_admin_can_update_project_image(): void
    {
        Storage::fake('local');
        $file = UploadedFile::fake()->image('new-cover.jpg');

        // Usar POST con _method: PUT para simular la actualización con archivo
        // Laravel no procesa multipart/form-data en PUT directo
        $response = $this->actingAs($this->usuario)
            ->post('/api/proyectos/' . $this->proyecto->uuid, [
                '_method' => 'PUT',
                'image' => $file,
            ]);

        $response->assertStatus(200);

        $this->proyecto->refresh();
        $this->assertNotNull($this->proyecto->image_path);
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('local');
        $disk->assertExists($this->proyecto->image_path);
    }

    /**
     * Test 13: No admin (miembro normal) no puede actualizar proyecto
     */
    public function test_no_admin_no_puede_actualizar_proyecto(): void
    {
        $miembro = User::factory()->create();
        $this->proyecto->miembros()->attach($miembro->id, ['rol' => 'editor']); // Rol no admin

        $response = $this->actingAs($miembro)
            ->putJson('/api/proyectos/' . $this->proyecto->uuid, [
                'nombre' => 'Intento de Hackeo',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test 14: No miembro no puede actualizar proyecto
     */
    public function test_no_miembro_no_puede_actualizar_proyecto(): void
    {
        $otroUsuario = User::factory()->create();

        $response = $this->actingAs($otroUsuario)
            ->putJson('/api/proyectos/' . $this->proyecto->uuid, [
                'nombre' => 'Intento de Hackeo Externo',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test 15: Admin puede actualizar solo algunos campos
     */
    public function test_admin_puede_actualizar_solo_nombre(): void
    {
        $response = $this->actingAs($this->usuario)
            ->putJson('/api/proyectos/' . $this->proyecto->uuid, [
                'nombre' => 'Solo Nombre',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('proyectos', [
            'id' => $this->proyecto->id,
            'nombre' => 'Solo Nombre',
            // moneda_default no debería cambiar si no se envía
        ]);
    }

    /**
     * Test 16: Admin puede eliminar proyecto
     */
    public function test_admin_puede_eliminar_proyecto(): void
    {
        $response = $this->actingAs($this->usuario)
            ->deleteJson('/api/proyectos/' . $this->proyecto->uuid);

        $response->assertStatus(204); // No Content

        $this->assertSoftDeleted('proyectos', ['id' => $this->proyecto->id]);
    }

    /**
     * Test 17: No admin no puede eliminar proyecto
     */
    public function test_no_admin_no_puede_eliminar_proyecto(): void
    {
        $miembro = User::factory()->create();
        $this->proyecto->miembros()->attach($miembro->id, ['rol' => 'editor']);

        $response = $this->actingAs($miembro)
            ->deleteJson('/api/proyectos/' . $this->proyecto->uuid);

        $response->assertStatus(403);
    }

    /**
     * Test 18: No miembro no puede eliminar proyecto
     */
    public function test_no_miembro_no_puede_eliminar_proyecto(): void
    {
        $otroUsuario = User::factory()->create();

        $response = $this->actingAs($otroUsuario)
            ->deleteJson('/api/proyectos/' . $this->proyecto->uuid);

        $response->assertStatus(403);
    }

    /**
     * Test 19: No autenticado no puede eliminar
     */
    public function test_unauthenticated_cannot_delete_proyecto(): void
    {
        $response = $this->deleteJson('/api/proyectos/' . $this->proyecto->uuid);
        $response->assertStatus(401);
    }

    /**
     * Test 20: Eliminar proyecto elimina relaciones (miembros)
     * Esto depende de la configuración de BD (cascada) o lógica de código.
     * Asumimos que la tabla pivote se limpia o no importa.
     * Pero podemos verificar que ya no hay registros en proyecto_user para ese proyecto.
     */
    public function test_eliminar_proyecto_mantiene_miembros_por_soft_delete(): void
    {
        // Al usar SoftDeletes, la relación en tabla pivote se mantiene (a menos que se fuerce borrado)

        $this->actingAs($this->usuario)->deleteJson('/api/proyectos/' . $this->proyecto->uuid);

        $this->assertDatabaseHas('proyecto_user', ['proyecto_id' => $this->proyecto->id]);
    }
}
