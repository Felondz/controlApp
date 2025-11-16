<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Proyecto;
use App\Models\Cuenta;
use App\Models\Categoria;
use App\Models\Transaccion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinanzasPersonalesTest extends TestCase
{
    use RefreshDatabase;

    protected ?User $user = null;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuario para tests con email único
        $this->user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test' . uniqid() . '@example.com',
        ]);
    }

    /**
     * Obtiene el proyecto personal del usuario (el UserObserver lo crea automáticamente)
     */
    protected function getPersonalProject()
    {
        return $this->user->proyectosPersonales()
            ->where('es_personal', true)
            ->first();
    }

    /**
     * Test: Se puede crear un proyecto personal directamente
     */
    public function test_personal_project_can_be_created_directly(): void
    {
        $user = User::factory()->create([
            'email' => 'test' . uniqid() . '@example.com',
        ]);

        $proyecto = Proyecto::create([
            'nombre' => 'Finanzas Personales',
            'moneda_default' => 'COP',
            'user_id' => $user->id,
            'es_personal' => true,
            'visible_en_listado' => false,
        ]);

        $this->assertDatabaseHas('proyectos', [
            'id' => $proyecto->id,
            'user_id' => $user->id,
            'nombre' => 'Finanzas Personales',
            'es_personal' => true,
            'visible_en_listado' => false,
            'moneda_default' => 'COP',
        ]);
    }

    /**
     * Test: El proyecto personal tiene es_personal = true
     */
    public function test_personal_project_has_es_personal_flag(): void
    {
        $proyecto = $this->getPersonalProject();
        $this->assertTrue($proyecto->esPersonal());
        $this->assertTrue($proyecto->es_personal);
    }

    /**
     * Test: El proyecto personal no aparece en listado
     */
    public function test_personal_project_is_hidden_from_listing(): void
    {
        $proyecto = $this->getPersonalProject();
        $this->assertFalse($proyecto->visible_en_listado);
    }

    /**
     * Test: GET /api/finanzas-personales retorna proyecto personal
     */
    public function test_authenticated_user_can_get_personal_finances(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/finanzas-personales');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'nombre',
            'moneda_default',
            'user_id',
            'es_personal',
            'visible_en_listado',
            'cuentas',
            'categorias',
            'transacciones',
        ]);
        $response->assertJsonPath('es_personal', true);
        $response->assertJsonPath('nombre', 'Finanzas Personales');
    }

    /**
     * Test: GET /api/finanzas-personales requiere autenticación
     */
    public function test_unauthenticated_user_cannot_get_personal_finances(): void
    {
        $response = $this->getJson('/api/finanzas-personales');
        $response->assertStatus(401);
    }

    /**
     * Test: GET /api/finanzas-personales/transacciones retorna lista vacía
     */
    public function test_authenticated_user_can_get_personal_transactions(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/finanzas-personales/transacciones');

        $response->assertStatus(200);
        $this->assertIsArray($response->json());
    }

    /**
     * Test: GET /api/finanzas-personales/transacciones con transacciones
     */
    public function test_authenticated_user_can_get_personal_transactions_with_data(): void
    {
        $proyecto = $this->getPersonalProject();

        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
        ]);

        $categoria = Categoria::factory()->create([
            'proyecto_id' => $proyecto->id,
        ]);

        $transaccion = Transaccion::factory()->create([
            'proyecto_id' => $proyecto->id,
            'cuenta_id' => $cuenta->id,
            'categoria_id' => $categoria->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/finanzas-personales/transacciones');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonPath('0.id', $transaccion->id);
    }

    /**
     * Test: GET /api/finanzas-personales/cuentas retorna lista vacía
     */
    public function test_authenticated_user_can_get_personal_accounts(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/finanzas-personales/cuentas');

        $response->assertStatus(200);
        $this->assertIsArray($response->json());
    }

    /**
     * Test: GET /api/finanzas-personales/cuentas con cuentas
     */
    public function test_authenticated_user_can_get_personal_accounts_with_data(): void
    {
        $proyecto = $this->getPersonalProject();

        $cuenta = Cuenta::factory()->create([
            'nombre' => 'Mi Banco Personal',
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/finanzas-personales/cuentas');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonPath('0.id', $cuenta->id);
        $response->assertJsonPath('0.nombre', 'Mi Banco Personal');
    }

    /**
     * Test: GET /api/finanzas-personales/categorias retorna lista vacía
     */
    public function test_authenticated_user_can_get_personal_categories(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/finanzas-personales/categorias');

        $response->assertStatus(200);
        $this->assertIsArray($response->json());
    }

    /**
     * Test: GET /api/finanzas-personales/categorias con categorías
     */
    public function test_authenticated_user_can_get_personal_categories_with_data(): void
    {
        $proyecto = $this->getPersonalProject();

        $categoria = Categoria::factory()->create([
            'proyecto_id' => $proyecto->id,
            'nombre' => 'Comida',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/finanzas-personales/categorias');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonPath('0.id', $categoria->id);
        $response->assertJsonPath('0.nombre', 'Comida');
    }

    /**
     * Test: Usuario no autenticado no puede acceder a endpoint
     */
    public function test_unauthenticated_user_cannot_get_personal_transactions(): void
    {
        $response = $this->getJson('/api/finanzas-personales/transacciones');
        $response->assertStatus(401);
    }

    /**
     * Test: Cada usuario solo ve sus propias finanzas personales
     */
    public function test_user_can_only_see_own_personal_finances(): void
    {
        $user1 = $this->user;
        $user2 = User::factory()->create([
            'email' => 'test' . uniqid() . '@example.com',
        ]);

        $proyecto1 = $this->getPersonalProject();
        $proyecto2 = $user2->proyectosPersonales()->first();

        $response = $this->actingAs($user1, 'sanctum')
            ->getJson('/api/finanzas-personales');

        $response->assertStatus(200);
        $this->assertEquals($proyecto1->id, $response->json('id'));
        $this->assertEquals($user1->id, $response->json('user_id'));
        $this->assertNotEquals($response->json('id'), $proyecto2->id);
    }

    /**
     * Test: Proyecto personal tiene moneda_default = COP
     */
    public function test_personal_project_has_cop_currency(): void
    {
        $proyecto = $this->getPersonalProject();
        $this->assertEquals('COP', $proyecto->moneda_default);
    }

    /**
     * Test: CheckPersonalProjectAccess middleware bloquea acceso no autorizado
     */
    public function test_middleware_blocks_unauthorized_access_to_personal_project(): void
    {
        $proyecto = $this->getPersonalProject();
        $user2 = User::factory()->create();

        $response = $this->actingAs($user2, 'sanctum')
            ->patchJson("/api/proyectos/{$proyecto->id}", [
                'nombre' => 'Nombre Modificado',
            ]);

        $response->assertStatus(403);
        $this->assertTrue(
            str_contains($response->json('message'), 'permiso') ||
                str_contains($response->json('message'), 'administrador')
        );
    }

    /**
     * Test: Propietario puede acceder a su proyecto personal
     */
    public function test_owner_can_access_own_personal_project(): void
    {
        $proyecto = $this->getPersonalProject();

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/proyectos/{$proyecto->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('id', $proyecto->id);
    }
}
