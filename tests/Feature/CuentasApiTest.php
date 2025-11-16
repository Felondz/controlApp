<?php

namespace Tests\Feature;

use App\Models\Cuenta;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CuentasApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Admin puede crear una cuenta
     */
    public function test_admin_puede_crear_cuenta()
    {
        /** @var User $admin */
        $admin = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($admin, ['rol' => 'admin']);

        $response = $this->actingAs($admin)->postJson('/api/proyectos/' . $proyecto->id . '/cuentas', [
            'nombre' => 'Banco Principal',
            'banco' => 'Banco Nacional',
            'balance_inicial' => 500000,
            'tipo' => 'banco',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['id', 'nombre', 'banco', 'balance', 'tipo', 'created_at']);
        $this->assertDatabaseHas('cuentas', [
            'nombre' => 'Banco Principal',
            'banco' => 'Banco Nacional',
            'balance' => 500000,
            'tipo' => 'banco',
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
        ]);
    }

    /**
     * Test: Miembro no puede crear cuenta (no es admin)
     */
    public function test_miembro_no_puede_crear_cuenta()
    {
        /** @var User $miembro */
        $miembro = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($miembro, ['rol' => 'miembro']);

        $response = $this->actingAs($miembro)->postJson('/api/proyectos/' . $proyecto->id . '/cuentas', [
            'nombre' => 'Banco Principal',
            'banco' => 'Banco Nacional',
            'balance_inicial' => 500000,
            'tipo' => 'banco',
            'estado' => 'activa',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test: Admin puede obtener lista de cuentas activas
     */
    public function test_admin_puede_listar_cuentas()
    {
        /** @var User $admin */
        $admin = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($admin, ['rol' => 'admin']);

        /** @var Cuenta $cuenta1 */
        $cuenta1 = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
            'estado' => 'activa',
        ]);

        /** @var Cuenta $cuenta2 */
        $cuenta2 = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
            'estado' => 'activa',
        ]);

        $response = $this->actingAs($admin)->getJson('/api/proyectos/' . $proyecto->id . '/cuentas');

        $response->assertStatus(200);
        $response->assertJsonCount(2);
        $response->assertJsonStructure([['id', 'nombre', 'banco', 'balance', 'tipo', 'estado']]);
    }
    /**
     * Test: Admin puede actualizar una cuenta
     */
    public function test_admin_puede_actualizar_cuenta()
    {
        /** @var User $admin */
        $admin = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($admin, ['rol' => 'admin']);

        /** @var Cuenta $cuenta */
        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
        ]);

        $response = $this->actingAs($admin)->putJson(
            '/api/proyectos/' . $proyecto->id . '/cuentas/' . $cuenta->id,
            [
                'nombre' => 'Banco Actualizado',
                'banco' => 'Otro Banco',
            ]
        );

        $response->assertStatus(200);
        $this->assertDatabaseHas('cuentas', [
            'id' => $cuenta->id,
            'nombre' => 'Banco Actualizado',
            'banco' => 'Otro Banco',
        ]);
    }

    /**
     * Test: Admin puede inactivar una cuenta sin transacciones
     */
    public function test_admin_puede_inactivar_cuenta()
    {
        /** @var User $admin */
        $admin = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($admin, ['rol' => 'admin']);

        /** @var Cuenta $cuenta */
        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
            'estado' => 'activa',
        ]);

        $response = $this->actingAs($admin)->deleteJson(
            '/api/proyectos/' . $proyecto->id . '/cuentas/' . $cuenta->id
        );

        $response->assertStatus(204); // No Content
        $this->assertDatabaseMissing('cuentas', [
            'id' => $cuenta->id,
            'propietario_type' => 'proyecto',
        ]);
    }
    /**
     * Test: Usuario no autenticado no puede ver cuentas
     */
    public function test_usuario_no_autenticado_no_puede_ver_cuentas()
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();

        $response = $this->getJson('/api/proyectos/' . $proyecto->id . '/cuentas');

        $response->assertStatus(401);
    }
}
