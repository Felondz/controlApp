<?php

namespace Tests\Feature\Modules\Finance;

use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Transaccion;
use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Categoria;
use App\Modules\Finance\Jobs\ProcessAutoBills;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;
use PHPUnit\Framework\Attributes\Test;

class BillEnhancementTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Proyecto $proyecto;
    protected Cuenta $cuenta;
    protected Categoria $categoria;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->proyecto = Proyecto::factory()->create();
        $this->proyecto->miembros()->attach($this->user->id, ['rol' => 'admin']);

        $this->cuenta = Cuenta::factory()->create([
            'propietario_id' => $this->proyecto->id,
            'propietario_type' => 'proyecto',
            'tipo' => 'banco',
            'saldo_actual' => 100000,
        ]);

        $this->categoria = Categoria::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'tipo' => 'gasto',
        ]);

        Sanctum::actingAs($this->user);
    }

    #[Test]
    public function it_can_create_a_bill_with_new_fields()
    {
        $payload = [
            'categoria_id' => $this->categoria->id,
            'monto' => -5000,
            'descripcion' => 'Factura Internet',
            'fecha' => '2026-05-01',
            'status' => 'pending',
            'numero_factura' => 'INV-001',
            'fecha_emision' => '2026-04-25',
            'fecha_vencimiento' => '2026-05-05',
        ];

        $response = $this->postJson("/api/proyectos/{$this->proyecto->uuid}/transacciones", $payload);

        $response->assertStatus(201);
        
        $transaction = Transaccion::where('numero_factura', 'INV-001')->first();
        $this->assertNotNull($transaction);
        $this->assertEquals('2026-04-25', $transaction->fecha_emision->format('Y-m-d'));
        $this->assertEquals('2026-05-05', $transaction->fecha_vencimiento->format('Y-m-d'));
    }

    #[Test]
    public function due_date_is_required_for_pending_transactions()
    {
        $payload = [
            'categoria_id' => $this->categoria->id,
            'monto' => -5000,
            'descripcion' => 'Factura sin vencimiento',
            'fecha' => '2026-05-01',
            'status' => 'pending',
            // Missing fecha_vencimiento
        ];

        $response = $this->postJson("/api/proyectos/{$this->proyecto->uuid}/transacciones", $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['fecha_vencimiento']);
    }

    #[Test]
    public function paying_a_bill_sets_fecha_pago_and_preserves_fecha()
    {
        $originalFecha = '2026-05-01 10:00:00';
        $bill = Transaccion::create([
            'proyecto_id' => $this->proyecto->id,
            'user_id' => $this->user->id,
            'cuenta_id' => null,
            'categoria_id' => $this->categoria->id,
            'monto' => -5000,
            'descripcion' => 'Test Bill',
            'fecha' => $originalFecha,
            'status' => 'pending',
            'cuenta_predeterminada_id' => $this->cuenta->id,
            'fecha_vencimiento' => '2026-05-05',
        ]);

        Carbon::setTestNow('2026-05-08 12:00:00');

        $response = $this->postJson("/api/proyectos/{$this->proyecto->uuid}/bills/{$bill->uuid}/pay-direct");

        $response->assertSuccessful();

        $bill->refresh();
        $this->assertEquals('completed', $bill->status);
        $this->assertNotNull($bill->fecha_pago);
        $this->assertEquals('2026-05-08 12:00:00', $bill->fecha_pago->toDateTimeString());
        // Original fecha should be preserved (though it's stored as timestamp, so we compare as strings)
        $this->assertStringContainsString('2026-05-01', $bill->fecha->toDateTimeString());

        // Verify balance: 100000 + (-5000) = 95000
        $this->cuenta->refresh();
        $this->assertEquals(95000, $this->cuenta->saldo_actual);

        Carbon::setTestNow();
    }

    #[Test]
    public function autopay_sets_fecha_pago_and_preserves_fecha()
    {
        $originalFecha = '2026-05-01 10:00:00';
        $bill = Transaccion::create([
            'proyecto_id' => $this->proyecto->id,
            'user_id' => $this->user->id,
            'cuenta_id' => null,
            'categoria_id' => $this->categoria->id,
            'monto' => -5000,
            'descripcion' => 'Auto Bill',
            'fecha' => $originalFecha,
            'status' => 'pending',
            'cuenta_predeterminada_id' => $this->cuenta->id,
            'debito_automatico' => true,
            'fecha_autopago' => '2026-05-08',
            'fecha_vencimiento' => '2026-05-10',
        ]);

        Carbon::setTestNow('2026-05-08 09:00:00');

        (new ProcessAutoBills())->handle();

        $bill->refresh();
        $this->assertEquals('completed', $bill->status);
        $this->assertNotNull($bill->fecha_pago);
        $this->assertEquals('2026-05-08 09:00:00', $bill->fecha_pago->toDateTimeString());
        $this->assertStringContainsString('2026-05-01', $bill->fecha->toDateTimeString());

        Carbon::setTestNow();
    }

    #[Test]
    public function fecha_autopago_is_calculated_from_fecha_vencimiento()
    {
        $payload = [
            'categoria_id' => $this->categoria->id,
            'monto' => -5000,
            'descripcion' => 'Auto Bill TC',
            'fecha' => '2026-05-01',
            'fecha_vencimiento' => '2026-05-15',
            'status' => 'pending',
            'debito_automatico' => true,
            'cuenta_predeterminada_id' => $this->cuenta->id,
        ];

        // Ensure account is a credit card for autopay to be enabled in controller
        $this->cuenta->update(['tipo' => 'credito']);

        $response = $this->postJson("/api/proyectos/{$this->proyecto->uuid}/transacciones", $payload);

        $response->assertStatus(201);
        
        $transaction = Transaccion::where('descripcion', 'Auto Bill TC')->first();
        // 2026-05-15 - 3 days = 2026-05-12
        $this->assertStringContainsString('2026-05-12', $transaction->fecha_autopago);
    }
}
