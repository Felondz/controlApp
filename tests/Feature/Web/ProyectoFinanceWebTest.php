<?php

namespace Tests\Feature\Web;

use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class ProyectoFinanceWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_project_finance_dashboard()
    {
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create(['user_id' => $user->id]);
        $proyecto->miembros()->attach($user->id, ['rol' => 'admin']);
        $proyecto->update(['modules' => ['finance']]);

        $response = $this->actingAs($user)->get(route('mis-proyectos.finance', $proyecto));

        $response->assertStatus(200);
        $response->assertInertia(
            fn(Assert $page) => $page
                ->component('Projects/Finance/ProjectDashboard')
                ->has('proyecto')
                ->has('proyecto.cuentas') // Cuentas are loaded on the project model
                ->has('transacciones')
        );
    }
}
