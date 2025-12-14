<?php

namespace Tests\Feature;

use App\Modules\Finance\Models\Cuenta;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_delete_project_account()
    {
        // 1. Create User and Project
        $user = User::factory()->create();
        $project = Proyecto::create([
            'nombre' => 'Test Project',
            'user_id' => $user->id,
            'moneda_default' => 'COP',
            'es_personal' => false,
            'visible_en_listado' => true,
            'modules' => [],
        ]);

        // Attach user as admin
        $project->miembros()->attach($user->id, ['rol' => 'admin']);

        // 2. Create Project Account
        $account = Cuenta::create([
            'nombre' => 'Test Account',
            'tipo' => 'banco',
            'saldo_inicial' => 0,
            'saldo_actual' => 0,
            'propietario_id' => $project->id,
            'propietario_type' => 'App\Models\Proyecto',
            'moneda' => 'COP',
            'estado' => 'activa',
        ]);

        // 3. Act: Delete the account
        $response = $this->actingAs($user)
            ->delete(route('finance.accounts.destroy', [
                'proyecto' => $project->id,
                'account' => $account->id
            ]));

        // 4. Assert
        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('cuentas', ['id' => $account->id]);
    }

    public function test_non_admin_cannot_delete_project_account()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $project = Proyecto::create([
            'nombre' => 'Test Project',
            'user_id' => $otherUser->id,
            'moneda_default' => 'COP',
            'es_personal' => false,
            'visible_en_listado' => true,
            'modules' => [],
        ]);

        // Attach user as member (not admin)
        $project->miembros()->attach($user->id, ['rol' => 'member']);

        $account = Cuenta::create([
            'nombre' => 'Test Account',
            'tipo' => 'banco',
            'saldo_inicial' => 0,
            'saldo_actual' => 0,
            'propietario_id' => $project->id,
            'propietario_type' => 'App\Models\Proyecto',
            'moneda' => 'COP',
            'estado' => 'activa',
        ]);

        $response = $this->actingAs($user)
            ->delete(route('finance.accounts.destroy', [
                'proyecto' => $project->id,
                'account' => $account->id
            ]));

        $response->assertStatus(403);
        $this->assertDatabaseHas('cuentas', ['id' => $account->id]);
    }
}
