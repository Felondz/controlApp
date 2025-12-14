<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Proyecto;
use App\Modules\Finance\Models\SupplyContract;
use App\Modules\Finance\Models\Provider;
use App\Modules\Finance\Models\Categoria;
use App\Modules\Finance\Models\Cuenta;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OnlySupplyContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_supply_contract()
    {
        $proyecto = Proyecto::factory()->create();
        $provider = Provider::factory()->create(['proyecto_id' => $proyecto->id]);
        $categoria = Categoria::factory()->create(['proyecto_id' => $proyecto->id, 'tipo' => 'gasto']);
        $cuenta = Cuenta::factory()->create([
            'propietario_id' => $proyecto->id,
            'propietario_type' => get_class($proyecto)
        ]);
        
        $contract = SupplyContract::factory()->create([
            'proyecto_id' => $proyecto->id,
            'provider_id' => $provider->id,
            'billing_category_id' => $categoria->id,
            'target_account_id' => $cuenta->id,
        ]);
        
        $this->assertDatabaseHas('supply_contracts', ['id' => $contract->id]);
    }
}
