<?php

namespace Tests\Feature\Modules\Finance;

use App\Modules\Finance\Models\Categoria;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Admin puede crear una categoría
     */
    public function test_admin_puede_crear_categoria()
    {
        /** @var User $admin */
        $admin = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($admin, ['rol' => 'admin']);

        $response = $this->actingAs($admin)->postJson('/api/proyectos/' . $proyecto->uuid . '/categorias', [
            'nombre' => 'Gastos Generales',
            'tipo' => 'gasto',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['id', 'nombre', 'tipo', 'proyecto_id', 'created_at']);
        $this->assertDatabaseHas('categorias', [
            'nombre' => 'Gastos Generales',
            'tipo' => 'gasto',
            'proyecto_id' => $proyecto->id,
        ]);
    }

    /**
     * Test: Miembro no puede crear categoría (no es admin)
     */
    public function test_miembro_no_puede_crear_categoria()
    {
        /** @var User $miembro */
        $miembro = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($miembro, ['rol' => 'miembro']);

        $response = $this->actingAs($miembro)->postJson('/api/proyectos/' . $proyecto->uuid . '/categorias', [
            'nombre' => 'Gastos Generales',
            'tipo' => 'gasto',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test: Admin puede obtener lista de categorías del proyecto
     */
    public function test_admin_puede_listar_categorias()
    {
        /** @var User $admin */
        $admin = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($admin, ['rol' => 'admin']);

        /** @var Categoria $categoria1 */
        $categoria1 = Categoria::factory()->create(['proyecto_id' => $proyecto->id]);

        /** @var Categoria $categoria2 */
        $categoria2 = Categoria::factory()->create(['proyecto_id' => $proyecto->id]);

        $response = $this->actingAs($admin)->getJson('/api/proyectos/' . $proyecto->uuid . '/categorias');

        $response->assertStatus(200);
        $response->assertJsonCount(12); // 10 default categories + 2 manually created
        $response->assertJsonStructure([['id', 'nombre', 'tipo']]);
    }
    /**
     * Test: Admin puede actualizar categoría
     */
    public function test_admin_puede_actualizar_categoria()
    {
        /** @var User $admin */
        $admin = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($admin, ['rol' => 'admin']);

        /** @var Categoria $categoria */
        $categoria = Categoria::factory()->create(['proyecto_id' => $proyecto->id]);

        $response = $this->actingAs($admin)->putJson(
            '/api/proyectos/' . $proyecto->uuid . '/categorias/' . $categoria->id,
            [
                'nombre' => 'Gastos Actualizados',
                'tipo' => 'ingreso',
            ]
        );

        $response->assertStatus(200);
        $this->assertDatabaseHas('categorias', [
            'id' => $categoria->id,
            'nombre' => 'Gastos Actualizados',
            'tipo' => 'ingreso',
        ]);
    }

    /**
     * Test: Admin puede eliminar categoría vacía (soft delete)
     */
    public function test_admin_puede_eliminar_categoria_vacia()
    {
        /** @var User $admin */
        $admin = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($admin, ['rol' => 'admin']);

        /** @var Categoria $categoria */
        $categoria = Categoria::factory()->create(['proyecto_id' => $proyecto->id]);

        $response = $this->actingAs($admin)->deleteJson(
            '/api/proyectos/' . $proyecto->uuid . '/categorias/' . $categoria->id
        );

        $response->assertStatus(204); // No Content
        // Verificar que fue eliminada suavemente (soft delete)
        $this->assertSoftDeleted('categorias', ['id' => $categoria->id]);
    }

    /**
     * Test: Admin NO puede eliminar categoría con transacciones
     */
    public function test_admin_no_puede_eliminar_categoria_con_transacciones()
    {
        /** @var User $admin */
        $admin = User::factory()->create();

        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();
        $proyecto->miembros()->attach($admin, ['rol' => 'admin']);

        /** @var Categoria $categoria */
        $categoria = Categoria::factory()->create(['proyecto_id' => $proyecto->id]);

        // Crear transacción asociada
        \App\Modules\Finance\Models\Transaccion::factory()->create([
            'proyecto_id' => $proyecto->id,
            'categoria_id' => $categoria->id,
        ]);

        $response = $this->actingAs($admin)->deleteJson(
            '/api/proyectos/' . $proyecto->uuid . '/categorias/' . $categoria->id
        );

        $response->assertStatus(422); // Unprocessable Entity
        $response->assertJson(['message' => 'No se puede eliminar la categoría porque tiene transacciones asociadas. Inhabilítala en su lugar.']);

        // Verificar que NO fue eliminada
        $this->assertDatabaseHas('categorias', ['id' => $categoria->id, 'deleted_at' => null]);
    }
    /**
     * Test: Usuario no autenticado no puede ver categorías
     */
    public function test_usuario_no_autenticado_no_puede_ver_categorias()
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::factory()->create();

        $response = $this->getJson('/api/proyectos/' . $proyecto->uuid . '/categorias');

        $response->assertStatus(401);
    }
}
