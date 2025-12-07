<?php

namespace Tests\Feature\Api;

use App\Models\Cuenta;
use App\Models\Proyecto;
use App\Models\User;
use App\Models\Categoria;
use App\Models\Transaccion;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class CreditCardTest extends TestCase
{
    use RefreshDatabase;

    public function test_credit_card_payment_creates_mirror_transaction()
    {
        // 1. Setup
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $proyecto = Proyecto::factory()->create(['user_id' => $user->id]);
        $proyecto->miembros()->attach($user->id, ['rol' => 'admin']);

        // Cuenta Origen (Banco)
        $cuentaBanco = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'nombre' => 'Banco Principal',
            'tipo' => 'banco',
            'saldo_actual' => 2000000, // 2M
        ]);

        // Cuenta Destino (TC) - Deuda de 500k
        $cuentaTC = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'nombre' => 'Mi Tarjeta',
            'tipo' => 'credito',
            'saldo_actual' => -500000, // Debt is negative
            'limite_credito' => 1000000,
            'dia_corte' => 5,
            'dia_pago' => 20
        ]);

        // 2. Action: Pay CC Bill via Endpoint
        $pagoMonto = 100000;
        $response = $this->postJson(route('api.cuentas.pay-cc-bill', [$proyecto->id, $cuentaTC->id]), [
            'monto' => $pagoMonto,
            'cuenta_origen_id' => $cuentaBanco->id,
            'tipo_pago' => 'minimo',
            'notes' => 'Pago parcial TC Test'
        ]);

        // 3. Assertions
        $response->assertStatus(200);
        $response->assertJson(['message' => 'Pago de factura TC registrado correctamente']);

        // Check Mirror Transactions
        // 1. Expense from Bank
        $this->assertDatabaseHas('transacciones', [
            'cuenta_id' => $cuentaBanco->id,
            'monto' => -($pagoMonto), // Expense is negative in DB
            'proyecto_id' => $proyecto->id,
        ]);

        // 2. Income to TC (The "Abono")
        $this->assertDatabaseHas('transacciones', [
            'cuenta_id' => $cuentaTC->id,
            'monto' => $pagoMonto,
            'proyecto_id' => $proyecto->id,
            'descripcion' => 'Abono pago factura: minimo'
        ]);

        // Check Balances
        $cuentaTC->refresh();
        // TC logic: Balance is Debt (Negative). Payment (Positive) reduces Debt.
        // -500,000 + 100,000 = -400,000
        $this->assertEquals(-400000, $cuentaTC->saldo_actual, 'TC Balance should decrease usage (become less negative)');

        $cuentaBanco->refresh();
        // Bank logic: Balance is Asset. Payment reduces Asset.
        // 2,000,000 - 100,000 = 1,900,000
        $this->assertEquals(1900000, $cuentaBanco->saldo_actual, 'Bank Balance should decrease by payment amount');
    }

    public function test_can_fetch_upcoming_bills()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
        $proyecto = Proyecto::factory()->create(['user_id' => $user->id]);
        $proyecto->miembros()->attach($user->id, ['rol' => 'admin']);

        $cuentaTC = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'tipo' => 'credito',
            'dia_corte' => 5,
            'dia_pago' => 20,
            'saldo_actual' => -500000
        ]);

        // Mock Service - Unconditional Return to Verify Injection
        $this->mock(\App\Services\CreditCardBillingService::class, function ($mock) use ($cuentaTC) {
            $mock->shouldReceive('getUpcomingBill')
                ->zeroOrMoreTimes() // Accept any number of calls
                ->andReturnUsing(function ($cuenta) use ($cuentaTC) {
                    // Always return mock data using the called account's ID
                    return [
                        'cuenta_id' => $cuenta->id,
                        'pago_minimo' => 50000,
                        'pago_total' => 500000,
                        'fecha_pago' => '2025-05-20'
                    ];
                });
        });

        $response = $this->getJson(route('api.finance.cc-bills', [$proyecto->id]));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['fecha_pago', 'pago_minimo', 'pago_total', 'cuenta_id']
        ]);

        $response->assertJsonFragment(['cuenta_id' => $cuentaTC->id]);
        $response->assertJsonFragment(['pago_total' => 500000]);
    }
}
