<?php

namespace Tests\Feature\Api;

use App\Models\Cuenta;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectAccountTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_available_accounts()
    {
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create(['user_id' => $user->id]);

        // Account 1: Personal, not linked
        $cuenta1 = Cuenta::factory()->create([
            'propietario_id' => $user->id,
            'propietario_type' => User::class,
            'nombre' => 'Personal Account'
        ]);

        // Account 2: Already linked
        $cuenta2 = Cuenta::factory()->create([
            'propietario_id' => $user->id,
            'propietario_type' => User::class,
            'nombre' => 'Linked Account'
        ]);
        $proyecto->cuentasAsociadas()->attach($cuenta2);

        // Account 3: Project owned (should not appear)
        $cuenta3 = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => Proyecto::class,
            'nombre' => 'Project Account'
        ]);

        $response = $this->actingAs($user)
            ->getJson(route('proyectos.cuentas.available', $proyecto));

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['id' => $cuenta1->id])
            ->assertJsonMissing(['id' => $cuenta2->id])
            ->assertJsonMissing(['id' => $cuenta3->id]);
    }

    public function test_can_link_account()
    {
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create(['user_id' => $user->id]);
        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $user->id,
            'propietario_type' => User::class
        ]);

        $response = $this->actingAs($user)
            ->postJson(route('proyectos.cuentas.link', $proyecto), [
                'cuenta_id' => $cuenta->id
            ]);

        $response->assertOk();
        $this->assertTrue($proyecto->cuentasAsociadas()->where('cuenta_id', $cuenta->id)->exists());
    }

    public function test_cannot_link_others_account()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $proyecto = Proyecto::factory()->create(['user_id' => $user->id]);
        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $otherUser->id,
            'propietario_type' => User::class
        ]);

        $response = $this->actingAs($user)
            ->postJson(route('proyectos.cuentas.link', $proyecto), [
                'cuenta_id' => $cuenta->id
            ]);

        $response->assertStatus(403);
        $this->assertFalse($proyecto->cuentasAsociadas()->where('cuenta_id', $cuenta->id)->exists());
    }

    public function test_can_unlink_account()
    {
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create(['user_id' => $user->id]);
        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $user->id,
            'propietario_type' => User::class
        ]);
        $proyecto->cuentasAsociadas()->attach($cuenta);

        $response = $this->actingAs($user)
            ->deleteJson(route('proyectos.cuentas.unlink', [$proyecto, $cuenta]));

        $response->assertOk();
        $this->assertFalse($proyecto->cuentasAsociadas()->where('cuenta_id', $cuenta->id)->exists());
    }
}
