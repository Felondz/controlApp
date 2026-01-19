<?php

namespace Tests\Feature\Modules\Finance;

use App\Modules\Finance\Models\Cuenta;
use App\Modules\Inventory\Models\InventoryItem;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BalanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_balance_includes_inventory_value_if_module_active()
    {
        // 1. Setup Project with Finance and Inventory
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create([
            'modules' => ['finance', 'inventory']
        ]);
        $proyecto->miembros()->attach($user->id, ['rol' => 'admin']);

        // 2. Create Bank Account with Balance
        Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
            'saldo_actual' => 1000,
            'estado' => 'activa',
            'tipo' => 'banco'
        ]);

        // 3. Create Inventory Item
        // Try creating directly if factory exists, or manually
        InventoryItem::create([
            'proyecto_id' => $proyecto->id,
            'name' => 'Test Item',
            'sku' => 'TEST-001',
            'current_stock' => 10,
            'cost_price' => 50, // Total Value = 500
            'sale_price' => 100,
            'min_stock_level' => 5
        ]);

        // 4. Call API
        $response = $this->actingAs($user)
            ->getJson("/api/proyectos/{$proyecto->id}/finance/balance");
        


        // 5. Assert Balance = 1000 cents + (50 * 10 * 100) cents = 1000 + 50000 = 51000
        $response->assertStatus(200);
        $response->assertJson([
            'balance' => 51000
        ]);
    }

    public function test_balance_excludes_inventory_value_if_module_inactive()
    {
        // 1. Setup Project with ONLY Finance
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create([
            'modules' => ['finance']
        ]);
        $proyecto->miembros()->attach($user->id, ['rol' => 'admin']);

        // 2. Create Bank Account with Balance
        Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
            'saldo_actual' => 1000,
            'estado' => 'activa',
            'tipo' => 'banco'
        ]);

        // 3. Create Inventory Item (should be ignored)
        InventoryItem::create([
            'proyecto_id' => $proyecto->id,
            'name' => 'Test Item',
            'sku' => 'TEST-001',
            'current_stock' => 10,
            'cost_price' => 50, // Total Value = 500
            'sale_price' => 100,
            'min_stock_level' => 5
        ]);

        // 4. Call API
        $response = $this->actingAs($user)
            ->getJson("/api/proyectos/{$proyecto->id}/finance/balance");

        // 5. Assert Balance = 1000 (Inventory ignored)
        $response->assertStatus(200);
        $response->assertJson([
            'balance' => 1000
        ]);
    }

    public function test_balance_handles_liabilities_correctly()
    {
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create(['modules' => ['finance']]);
        $proyecto->miembros()->attach($user->id, ['rol' => 'admin']);

        // Asset (Bank): 1000
        Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
            'saldo_actual' => 1000,
            'tipo' => 'banco'
        ]);

        // Liability (Credit Card) with POSITIVE balance (representing debt magnitude)
        Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
            'saldo_actual' => 200, // Debt of 200
            'tipo' => 'credito'
        ]);

        // Liability (Loan) with NEGATIVE balance (representing debt)
        Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => 'proyecto',
            'saldo_actual' => -300, // Debt of 300
            'tipo' => 'prestamo'
        ]);

        // Expected Net Worth: 1000 - |200| - |-300| = 1000 - 200 - 300 = 500.

        $response = $this->actingAs($user)
            ->getJson("/api/proyectos/{$proyecto->id}/finance/balance");

        $response->assertStatus(200);
        $response->assertJson([
            'balance' => 500
        ]);
    }
}
