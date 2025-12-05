<?php

namespace Tests\Feature\Modules\Finance;

use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Models\Cuenta;
use App\Models\Categoria;
use App\Models\Transaccion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class ScheduledTransactionTest extends TestCase
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
        $this->proyecto = Proyecto::create([
            'nombre' => 'Test Project',
            'user_id' => $this->user->id,
            'moneda_default' => 'USD'
        ]);

        $this->proyecto->miembros()->attach($this->user->id, ['rol' => 'admin']);

        $this->cuenta = Cuenta::factory()->create([
            'propietario_id' => $this->user->id,
            'propietario_type' => User::class,
            'saldo_actual' => 1000.00,
            'moneda' => 'USD'
        ]);

        // Link account to project (if necessary by your logic, usually via ProjectAccountController logic but here direct model is fine for unit/feature test context if logic allows)
        // Assuming accounts are available to project via owner relationship or explicit link. 
        // For this test, we just need a valid cuenta_id.

        $this->categoria = Categoria::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'tipo' => 'gasto',
            'nombre' => 'Bills'
        ]);
    }

    public function test_pending_transaction_does_not_affect_balance()
    {
        Sanctum::actingAs($this->user);

        $initialBalance = $this->cuenta->fresh()->saldo_actual;

        $response = $this->postJson("/api/proyectos/{$this->proyecto->id}/transacciones", [
            'cuenta_id' => $this->cuenta->id,
            'categoria_id' => $this->categoria->id,
            // Will be converted to negative for expense in controller if logic exists, or we send negative. 
            // Controller logic: $finalAmount = activeTab === 'expense' ? -Math.abs(amount) : Math.abs(amount); -> Frontend does this.
            // Backend store: $transaccion->monto. 
            // Let's send negative as frontend would for expense.
            'monto' => -100.00,
            'descripcion' => 'Internet Bill',
            'fecha' => '2025-12-31',
            'status' => 'pending', // Key field
            'tipo' => 'expense'
        ]);

        $response->assertStatus(201);

        // Assert Transaction Created
        $this->assertDatabaseHas('transacciones', [
            'descripcion' => 'Internet Bill',
            'status' => 'pending',
            'monto' => -100.00
        ]);

        $this->assertEquals($initialBalance, $this->cuenta->fresh()->saldo_actual, 'Pending transaction should not change balance');
    }

    public function test_completing_transaction_updates_balance()
    {
        Sanctum::actingAs($this->user);

        // Create pending transaction directly
        $transaccion = Transaccion::create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_id' => $this->cuenta->id,
            'categoria_id' => $this->categoria->id,
            'user_id' => $this->user->id,
            'monto' => -100.00,
            'descripcion' => 'Pending Bill',
            'fecha' => '2025-12-31',
            'status' => 'pending'
        ]);

        $initialBalance = $this->cuenta->fresh()->saldo_actual;

        // Update to completed
        $response = $this->putJson("/api/proyectos/{$this->proyecto->id}/transacciones/{$transaccion->id}", [
            'cuenta_id' => $this->cuenta->id,
            'categoria_id' => $this->categoria->id,
            'monto' => -100.00,
            'descripcion' => 'Paid Bill',
            'fecha' => '2025-12-31',
            'status' => 'completed', // Key change
            'tipo' => 'expense'
        ]);

        $response->assertStatus(200);

        // Assert Balance Updated
        $expectedBalance = $initialBalance - 100.00;
        $this->assertEquals($expectedBalance, $this->cuenta->fresh()->saldo_actual, 'Completed transaction should update balance');
    }

    public function test_deleting_completed_transaction_reverts_balance()
    {
        Sanctum::actingAs($this->user);

        // Create completed transaction
        $transaccion = Transaccion::create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_id' => $this->cuenta->id,
            'categoria_id' => $this->categoria->id,
            'user_id' => $this->user->id,
            'monto' => -100.00,
            'descripcion' => 'Paid Bill',
            'fecha' => '2025-12-31',
            'status' => 'completed'
        ]);

        // Manually update balance to reflect it (since factory created it without controller logic)
        $this->cuenta->saldo_actual -= 100.00;
        $this->cuenta->save();

        $balanceBeforeDelete = $this->cuenta->fresh()->saldo_actual;

        // Delete
        $response = $this->deleteJson("/api/proyectos/{$this->proyecto->id}/transacciones/{$transaccion->id}");

        $response->assertStatus(204);

        // Assert Balance Reverted
        $expectedBalance = $balanceBeforeDelete + 100.00;
        $this->assertEquals($expectedBalance, $this->cuenta->fresh()->saldo_actual, 'Deleting completed transaction should revert balance');
    }

    public function test_deleting_pending_transaction_does_not_affect_balance()
    {
        Sanctum::actingAs($this->user);

        // Create pending transaction
        $transaccion = Transaccion::create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_id' => $this->cuenta->id,
            'categoria_id' => $this->categoria->id,
            'user_id' => $this->user->id,
            'monto' => -100.00,
            'descripcion' => 'Pending Bill',
            'fecha' => '2025-12-31',
            'status' => 'pending'
        ]);

        $balanceBeforeDelete = $this->cuenta->fresh()->saldo_actual;

        // Delete
        $response = $this->deleteJson("/api/proyectos/{$this->proyecto->id}/transacciones/{$transaccion->id}");

        $response->assertStatus(204);

        // Assert Balance Unchanged
        $this->assertEquals($balanceBeforeDelete, $this->cuenta->fresh()->saldo_actual, 'Deleting pending transaction should not affect balance');
    }
}
