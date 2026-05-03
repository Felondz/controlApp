<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use App\Models\User;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Transaccion;
use App\Modules\Finance\Models\Cuenta;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Tests for PayDirectly API endpoint.
 * Uses SQLite in-memory database with RefreshDatabase trait.
 * 
 * Endpoint: POST /api/proyectos/{proyecto}/bills/{transaccion}/pay-direct
 */
class PayDirectlyApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Proyecto $proyecto;
    protected Cuenta $cuenta;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test user and project
        $this->user = User::factory()->create();
        $this->proyecto = Proyecto::factory()->create();
        $this->proyecto->miembros()->attach($this->user->id, ['rol' => 'admin']);

        // Create a bank account using polymorphic relation
        $this->cuenta = Cuenta::factory()->create([
            'propietario_id' => $this->proyecto->id,
            'propietario_type' => 'proyecto',
            'tipo' => 'banco',
            'saldo_actual' => 100000,
        ]);

        Sanctum::actingAs($this->user);
    }

    #[Test]
    public function non_member_cannot_pay_bill(): void
    {
        // Create a pending bill with default account
        $bill = Transaccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_predeterminada_id' => $this->cuenta->id,
            'status' => 'pending',
            'monto' => -5000,
        ]);

        // Create another user who is not a member
        $otherUser = User::factory()->create();
        Sanctum::actingAs($otherUser);

        $response = $this->postJson("/api/proyectos/{$this->proyecto->uuid}/bills/{$bill->uuid}/pay-direct");

        $response->assertForbidden();
    }

    #[Test]
    public function cannot_pay_bill_without_default_account(): void
    {
        // Create a pending bill WITHOUT default account
        $bill = Transaccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_predeterminada_id' => null,
            'status' => 'pending',
            'monto' => -5000,
        ]);

        $response = $this->postJson("/api/proyectos/{$this->proyecto->uuid}/bills/{$bill->uuid}/pay-direct");

        $response->assertStatus(400);
        $response->assertJson(['error' => 'Esta factura no tiene cuenta predeterminada']);
    }

    #[Test]
    public function cannot_pay_already_completed_bill(): void
    {
        // Create a completed bill
        $bill = Transaccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_predeterminada_id' => $this->cuenta->id,
            'status' => 'completed',
            'monto' => -5000,
        ]);

        $response = $this->postJson("/api/proyectos/{$this->proyecto->uuid}/bills/{$bill->uuid}/pay-direct");

        $response->assertStatus(400);
        $response->assertJson(['error' => 'Esta factura ya fue pagada']);
    }

    #[Test]
    public function bill_from_other_project_returns_404(): void
    {
        // Create another project with a bill
        $otherProject = Proyecto::factory()->create();
        $otherBill = Transaccion::factory()->create([
            'proyecto_id' => $otherProject->id,
            'status' => 'pending',
        ]);

        // Try to pay other project's bill using our project's URL
        $response = $this->postJson("/api/proyectos/{$this->proyecto->uuid}/bills/{$otherBill->uuid}/pay-direct");

        $response->assertNotFound();
    }

    #[Test]
    public function unauthenticated_user_cannot_pay_bill(): void
    {
        $bill = Transaccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'status' => 'pending',
        ]);

        $this->app['auth']->forgetGuards();

        $response = $this->postJson("/api/proyectos/{$this->proyecto->uuid}/bills/{$bill->uuid}/pay-direct");

        $response->assertUnauthorized();
    }

    #[Test]
    public function successful_payment_returns_correct_response(): void
    {
        // Create a pending bill with default account
        $bill = Transaccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_predeterminada_id' => $this->cuenta->id,
            'status' => 'pending',
            'monto' => -5000,
            'descripcion' => 'Test Bill',
        ]);

        $response = $this->postJson("/api/proyectos/{$this->proyecto->uuid}/bills/{$bill->uuid}/pay-direct");

        $response->assertSuccessful();
        $response->assertJsonStructure([
            'success',
            'message',
            'payment',
        ]);
    }
}
