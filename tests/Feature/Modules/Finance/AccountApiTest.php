<?php

namespace Tests\Feature\Modules\Finance;

use App\Modules\Finance\Models\Cuenta;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountApiTest extends TestCase
{
    use RefreshDatabase;

    private function crearDatosPrueba($user, $rol = 'admin')
    {
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($user->id, ['rol' => $rol]);

        return [
            'user' => $user,
            'proyecto' => $proyecto
        ];
    }

    /**
     * Test: Admin puede crear una cuenta de tipo crédito
     */
    public function test_puede_crear_cuenta_credito()
    {
        $datos = $this->crearDatosPrueba(User::factory()->create());

        $response = $this->actingAs($datos['user'])->postJson('/api/proyectos/' . $datos['proyecto']->uuid . '/cuentas', [
            'nombre' => 'Tarjeta de Crédito',
            'banco' => 'Banco Nacional',
            'tipo' => 'credito',
            'saldo_inicial' => 0,
            'moneda' => 'USD',
            'tasa_interes_anual' => 24.99,
            'fecha_vencimiento' => now()->addYears(3)->format('Y-m-d'),
            'dia_corte' => 15,
            'dia_pago' => 5,
            'limite_credito' => 1000000,
            'descripcion' => 'Tarjeta de crédito oro',
            'color' => '#3b82f6',
            'icono' => 'credit-card'
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'id',
            'nombre',
            'banco',
            'tipo',
            'saldo_inicial',
            'saldo_actual',
            'tasa_interes_anual',
            'fecha_vencimiento',
            'dia_corte',
            'dia_pago',
            'limite_credito'
        ]);

        $this->assertDatabaseHas('cuentas', [
            'nombre' => 'Tarjeta de Crédito',
            'tipo' => 'credito',
            'tasa_interes_anual' => 24.99,
            'limite_credito' => 1000000
        ]);
    }

    /**
     * Test: Validación de campos requeridos para cuenta de crédito
     */
    public function test_validacion_campos_requeridos_credito()
    {
        $datos = $this->crearDatosPrueba(User::factory()->create());

        $response = $this->actingAs($datos['user'])->postJson('/api/proyectos/' . $datos['proyecto']->uuid . '/cuentas', [
            'nombre' => 'Tarjeta Inválida',
            'tipo' => 'credito',
            'saldo_inicial' => 0
            // Faltan campos requeridos
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors([
            'tasa_interes_anual',
            'fecha_vencimiento',
            'dia_corte',
            'dia_pago',
            'limite_credito',
            'moneda'
        ]);
    }

    /**
     * Test: Miembro no puede crear cuenta (no es admin)
     */
    public function test_miembro_no_puede_crear_cuenta()
    {
        $datos = $this->crearDatosPrueba(User::factory()->create(), 'miembro');

        $response = $this->actingAs($datos['user'])->postJson('/api/proyectos/' . $datos['proyecto']->uuid . '/cuentas', [
            'nombre' => 'Cuenta de Ahorros',
            'tipo' => 'banco',
            'saldo_inicial' => 1000,
            'moneda' => 'USD'
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test: Filtrado de cuentas por tipo y estado
     */
    public function test_filtrar_cuentas_por_tipo_y_estado()
    {
        $datos = $this->crearDatosPrueba(User::factory()->create());

        // Crear cuentas de prueba
        Cuenta::factory()->create([
            'propietario_id' => $datos['proyecto']->id,
            'propietario_type' => 'proyecto',
            'tipo' => 'credito',
            'estado' => 'activa',
            'nombre' => 'Tarjeta de Crédito'
        ]);

        Cuenta::factory()->create([
            'propietario_id' => $datos['proyecto']->id,
            'propietario_type' => 'proyecto',
            'tipo' => 'banco',
            'estado' => 'inactiva',
            'nombre' => 'Cuenta Bancaria Inactiva'
        ]);

        // Filtrar por tipo 'credito'
        $response = $this->actingAs($datos['user'])
            ->getJson('/api/proyectos/' . $datos['proyecto']->uuid . '/cuentas?tipo=credito');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['nombre' => 'Tarjeta de Crédito']);

        // Filtrar por estado 'inactiva'
        $response = $this->actingAs($datos['user'])
            ->getJson('/api/proyectos/' . $datos['proyecto']->uuid . '/cuentas?estado=inactiva');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['nombre' => 'Cuenta Bancaria Inactiva']);
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
        $proyecto->miembros()->attach($admin->id, ['rol' => 'admin']);

        /** @var Cuenta $cuenta */
        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
        ]);

        $response = $this->actingAs($admin)->putJson(
            '/api/proyectos/' . $proyecto->uuid . '/cuentas/' . $cuenta->uuid,
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
        $proyecto->miembros()->attach($admin->id, ['rol' => 'admin']);

        /** @var Cuenta $cuenta */
        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
            'estado' => 'activa',
        ]);

        $response = $this->actingAs($admin)->deleteJson(
            '/api/proyectos/' . $proyecto->uuid . '/cuentas/' . $cuenta->uuid
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

        $response = $this->getJson('/api/proyectos/' . $proyecto->uuid . '/cuentas');

        $response->assertStatus(401);
    }
}
