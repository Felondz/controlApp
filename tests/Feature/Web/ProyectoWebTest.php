<?php

namespace Tests\Feature\Web;

use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class ProyectoWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_project_create_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('mis-proyectos.create'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn(Assert $page) => $page
                ->component('Projects/CreateProject')
        );
    }

    public function test_user_can_create_project()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('mis-proyectos.store'), [
            'nombre' => 'Nuevo Proyecto Web',
            'moneda_default' => 'USD',
            'descripcion' => 'Descripción de prueba',
            'modules' => ['finance', 'tasks'],
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertDatabaseHas('proyectos', [
            'nombre' => 'Nuevo Proyecto Web',
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_view_project_edit_page()
    {
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create(['user_id' => $user->id]);
        $proyecto->miembros()->attach($user->id, ['rol' => 'admin']);

        $response = $this->actingAs($user)->get(route('mis-proyectos.edit', $proyecto));

        $response->assertStatus(200);
        $response->assertInertia(
            fn(Assert $page) => $page
                ->component('Projects/Edit')
                ->has('proyecto')
        );
    }

    public function test_user_can_update_project()
    {
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create(['user_id' => $user->id]);
        $proyecto->miembros()->attach($user->id, ['rol' => 'admin']);

        $response = $this->actingAs($user)->put(route('mis-proyectos.update', $proyecto), [
            'nombre' => 'Proyecto Actualizado',
            'moneda_default' => 'EUR',
            'descripcion' => 'Nueva descripción',
        ]);

        $response->assertRedirect(route('mis-proyectos.show', $proyecto));
        $this->assertDatabaseHas('proyectos', [
            'id' => $proyecto->id,
            'nombre' => 'Proyecto Actualizado',
            'moneda_default' => 'EUR',
        ]);
    }

    public function test_user_can_delete_project()
    {
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create(['user_id' => $user->id]);
        $proyecto->miembros()->attach($user->id, ['rol' => 'admin']);

        $response = $this->actingAs($user)->delete(route('mis-proyectos.destroy', $proyecto), [
            'password' => 'password',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertSoftDeleted($proyecto);
    }

    public function test_non_admin_cannot_update_project()
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();
        $proyecto = Proyecto::factory()->create(['user_id' => $owner->id]);
        $proyecto->miembros()->attach($member->id, ['rol' => 'miembro']);

        $response = $this->actingAs($member)->put(route('mis-proyectos.update', $proyecto), [
            'nombre' => 'Hacked Project',
            'moneda_default' => 'USD',
        ]);

        $response->assertStatus(403);
    }
}
