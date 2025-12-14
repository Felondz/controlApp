<?php

namespace Tests\Feature\Modules\Finance;

use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Modules\Finance\Models\SupplyContract;
use App\Modules\Finance\Jobs\ProcessSupplyContracts;
use App\Modules\Finance\Events\SupplyContractExecuted;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ProcessSupplyContractsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_processes_due_contracts_and_dispatches_event()
    {
        // Fake events to verify dispatch
        Event::fake([SupplyContractExecuted::class]);

        // Arrange
        $user = User::factory()->create();
        $proyecto = Proyecto::factory()->create(); // Fixed project factory usage
        
        try {
            // Create dependencies
            $category = \App\Modules\Finance\Models\Categoria::factory()->create(['proyecto_id' => $proyecto->id, 'tipo' => 'gasto']);
            $account = \App\Modules\Finance\Models\Cuenta::factory()->create([
                'propietario_id' => $proyecto->id, 
                'propietario_type' => get_class($proyecto)
            ]);
            $provider = \App\Modules\Finance\Models\Provider::factory()->create(['proyecto_id' => $proyecto->id]);
        
            $contract = SupplyContract::create([
                'proyecto_id' => $proyecto->id,
                'provider_id' => $provider->id,
                'name' => 'Weekly Coffee',
                'frequency' => 'weekly',
                'status' => 'active',
                'next_run_at' => Carbon::now()->subHour(), // Past due
                'last_run_at' => null,
                'total_amount' => 500,
                'currency_code' => 'USD',
                'auto_generate_invoice' => true,
                'billing_category_id' => $category->id,
                'target_account_id' => $account->id,
            ]);
        } catch (\Exception $e) {
             fwrite(STDERR, "SETUP ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString());
             throw $e;
        }

        // Act
        try {
            $job = new ProcessSupplyContracts();
            $job->handle();
        } catch (\Exception $e) {
             fwrite(STDERR, "JOB ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString());
             throw $e;
        }

        // Assert
        $contract->refresh();
        
        // 1. Next run should be updated (approx +1 week from previous scheduled time)
        // Note: Logic adds week to 'next_run_at'.
        $expectedNext = Carbon::parse($contract->next_run_at);
        $this->assertTrue($expectedNext->isFuture());
        
        // 2. Event dispatched
        Event::assertDispatched(SupplyContractExecuted::class, function ($event) use ($contract) {
            return $event->contract->id === $contract->id
                && $event->invoice !== null
                && $event->invoice->monto == 500;
        });

        // 3. Database has transaction
        $this->assertDatabaseHas('transacciones', [
            'proyecto_id' => $proyecto->id,
            'monto' => 500,
            'descripcion' => "Auto-generated from Supply Contract #{$contract->id}",
        ]);
    }
}
