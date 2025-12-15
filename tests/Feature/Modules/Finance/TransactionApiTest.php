<?php

namespace Tests\Feature\Modules\Finance;

use App\Modules\Finance\Models\Categoria;
use App\Modules\Finance\Models\Cuenta;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Transaccion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Miembro puede crear una transacción
     */
    public function test_miembro_puede_crear_transaccion()
    {
        /** @var User $miembro */
        $miembro = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($miembro, ['rol' => 'miembro']);

        /** @var Categoria $categoria */
        $categoria = Categoria::factory()->create(['proyecto_id' => $proyecto->id]);

        /** @var Cuenta $cuenta */
        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'App\Models\Proyecto',
            'balance' => 1000000,
        ]);

        $response = $this->actingAs($miembro)->postJson(
            '/api/proyectos/' . $proyecto->id . '/transacciones',
            [
                'categoria_id' => $categoria->id,
                'cuenta_id' => $cuenta->id,
                'monto' => -50000,
                'descripcion' => 'Compra de materiales',
                'fecha' => '2025-01-15',
            ]
        );

        $response->assertStatus(201);
        $response->assertJsonStructure(['id', 'monto', 'descripcion', 'fecha', 'user_id', 'created_at']);
        $this->assertDatabaseHas('transacciones', [
            'monto' => -50000,
            'descripcion' => 'Compra de materiales',
            'user_id' => $miembro->id,
            'proyecto_id' => $proyecto->id,
            'categoria_id' => $categoria->id,
            'cuenta_id' => $cuenta->id,
        ]);
    }

    /**
     * Test: Usuario no miembro no puede crear transacción
     */
    public function test_usuario_no_miembro_no_puede_crear_transaccion()
    {
        /** @var User $outsider */
        $outsider = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();

        /** @var Categoria $categoria */
        $categoria = Categoria::factory()->create(['proyecto_id' => $proyecto->id]);

        /** @var Cuenta $cuenta */
        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'App\Models\Proyecto',
        ]);

        $response = $this->actingAs($outsider)->postJson(
            '/api/proyectos/' . $proyecto->id . '/transacciones',
            [
                'categoria_id' => $categoria->id,
                'cuenta_id' => $cuenta->id,
                'monto' => -50000,
                'descripcion' => 'Compra de materiales',
                'fecha' => '2025-01-15',
            ]
        );

        $response->assertStatus(403);
    }

    /**
     * Test: Miembro puede obtener lista de transacciones del proyecto
     */
    public function test_miembro_puede_listar_transacciones()
    {
        /** @var User $miembro */
        $miembro = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($miembro, ['rol' => 'miembro']);

        /** @var Transaccion $transaccion1 */
        $transaccion1 = Transaccion::factory()->create(['proyecto_id' => $proyecto->id, 'user_id' => $miembro->id]);

        /** @var Transaccion $transaccion2 */
        $transaccion2 = Transaccion::factory()->create(['proyecto_id' => $proyecto->id, 'user_id' => $miembro->id]);

        $response = $this->actingAs($miembro)->getJson('/api/proyectos/' . $proyecto->id . '/transacciones');

        $response->assertStatus(200);
        $response->assertJsonCount(2);
        $response->assertJsonStructure([['id', 'monto', 'descripcion', 'fecha']]);
    }

    /**
     * Test: Miembro puede actualizar transacción creada por él
     */
    public function test_miembro_puede_actualizar_transaccion_propia()
    {
        /** @var User $miembro */
        $miembro = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($miembro, ['rol' => 'miembro']);

        /** @var Transaccion $transaccion */
        $transaccion = Transaccion::factory()->create([
            'proyecto_id' => $proyecto->id,
            'user_id' => $miembro->id,
            'monto' => 50000,
        ]);

        $response = $this->actingAs($miembro)->putJson(
            '/api/proyectos/' . $proyecto->id . '/transacciones/' . $transaccion->id,
            [
                'monto' => 75000,
                'descripcion' => 'Descripción actualizada',
            ]
        );

        $response->assertStatus(200);
        $this->assertDatabaseHas('transacciones', [
            'id' => $transaccion->id,
            'monto' => 75000,
            'descripcion' => 'Descripción actualizada',
        ]);
    }

    /**
     * Test: Miembro no puede actualizar transacción de otro usuario
     */
    public function test_miembro_no_puede_actualizar_transaccion_ajena()
    {
        /** @var User $miembro1 */
        $miembro1 = User::factory()->create();

        /** @var User $miembro2 */
        $miembro2 = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($miembro1, ['rol' => 'miembro']);
        $proyecto->miembros()->attach($miembro2, ['rol' => 'miembro']);

        /** @var Transaccion $transaccion */
        $transaccion = Transaccion::factory()->create([
            'proyecto_id' => $proyecto->id,
            'user_id' => $miembro1->id,
        ]);

        $response = $this->actingAs($miembro2)->putJson(
            '/api/proyectos/' . $proyecto->id . '/transacciones/' . $transaccion->id,
            [
                'monto' => 75000,
            ]
        );

        $response->assertStatus(403);
    }

    /**
     * Test: Miembro puede eliminar transacción creada por él
     */
    public function test_miembro_puede_eliminar_transaccion_propia()
    {
        /** @var User $miembro */
        $miembro = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($miembro, ['rol' => 'miembro']);

        /** @var Transaccion $transaccion */
        $transaccion = Transaccion::factory()->create([
            'proyecto_id' => $proyecto->id,
            'user_id' => $miembro->id,
        ]);

        $response = $this->actingAs($miembro)->deleteJson(
            '/api/proyectos/' . $proyecto->id . '/transacciones/' . $transaccion->id
        );

        $response->assertStatus(204); // No Content
        $this->assertDatabaseMissing('transacciones', ['id' => $transaccion->id]);
    }

    /**
     * Test: Balance de cuenta se actualiza con nueva transacción (Observer)
     */
    public function test_balance_cuenta_se_actualiza_con_transaccion()
    {
        /** @var User $miembro */
        $miembro = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($miembro, ['rol' => 'miembro']);

        /** @var Categoria $categoria */
        $categoria = Categoria::factory()->create(['proyecto_id' => $proyecto->id]);

        /** @var Cuenta $cuenta */
        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'App\Models\Proyecto',
            'saldo_inicial' => 1000000,
        ]);

        $response = $this->actingAs($miembro)->postJson(
            '/api/proyectos/' . $proyecto->id . '/transacciones',
            [
                'categoria_id' => $categoria->id,
                'cuenta_id' => $cuenta->id,
                'monto' => -50000,
                'descripcion' => 'Gasto de prueba',
                'fecha' => '2025-01-15',
            ]
        );

        // Verificar que la transacción se creó exitosamente
        $response->assertStatus(201);

        // Verificar que la transacción existe
        $this->assertDatabaseHas('transacciones', [
            'cuenta_id' => $cuenta->id,
            'monto' => -50000,
        ]);
    }

    /**
     * Test: Usuario no autenticado no puede crear transacción
     */
    public function test_usuario_no_autenticado_no_puede_crear_transaccion()
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();

        $response = $this->postJson(
            '/api/proyectos/' . $proyecto->id . '/transacciones',
            [
                'categoria_id' => 1,
                'cuenta_id' => 1,
                'monto' => -50000,
                'descripcion' => 'Test',
                'fecha' => '2025-01-15',
            ]
        );

        $response->assertStatus(401);
    }
}
