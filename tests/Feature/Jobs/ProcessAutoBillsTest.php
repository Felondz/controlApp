<?php

namespace Tests\Feature\Jobs;

use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use App\Modules\Finance\Jobs\ProcessAutoBills;
use App\Modules\Finance\Models\Transaccion;
use App\Modules\Finance\Models\Cuenta;
use App\Models\Proyecto;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Tests for ProcessAutoBills scheduled job.
 * Uses SQLite in-memory database with RefreshDatabase trait.
 */
class ProcessAutoBillsTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Proyecto $proyecto;
    protected Cuenta $cuenta;

    protected function setUp(): void
    {
        parent::setUp();

        // Create user and project
        $this->user = User::factory()->create();
        $this->proyecto = Proyecto::factory()->create();
        $this->proyecto->miembros()->attach($this->user->id, ['rol' => 'admin']);

        // Create a credit card account using polymorphic relation
        $this->cuenta = Cuenta::factory()->create([
            'propietario_id' => $this->proyecto->id,
            'propietario_type' => 'proyecto',
            'tipo' => 'credito',
            'saldo_actual' => 0,
        ]);
    }

    #[Test]
    public function job_can_be_instantiated(): void
    {
        $job = new ProcessAutoBills();

        $this->assertInstanceOf(ProcessAutoBills::class, $job);
    }

    /** @test */
    public function job_processes_pending_bills_with_autopay_due_today(): void
    {
        // Create a bill scheduled for autopay today
        $bill = Transaccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_predeterminada_id' => $this->cuenta->id,
            'status' => 'pending',
            'debito_automatico' => true,
            'fecha_autopago' => Carbon::today(),
            'monto' => -5000,
        ]);

        $job = new ProcessAutoBills();
        $job->handle();

        // Verify bill was processed
        $bill->refresh();
        $this->assertEquals('completed', $bill->status);
    }

    /** @test */
    public function job_does_not_process_future_autopay_bills(): void
    {
        // Create a bill scheduled for future autopay
        $bill = Transaccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_predeterminada_id' => $this->cuenta->id,
            'status' => 'pending',
            'debito_automatico' => true,
            'fecha_autopago' => Carbon::today()->addDays(5),
            'monto' => -5000,
        ]);

        $job = new ProcessAutoBills();
        $job->handle();

        // Verify bill was NOT processed
        $bill->refresh();
        $this->assertEquals('pending', $bill->status);
    }

    /** @test */
    public function job_skips_bills_without_default_account(): void
    {
        // Create a bill with autopay but no default account
        $bill = Transaccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_predeterminada_id' => null,
            'status' => 'pending',
            'debito_automatico' => true,
            'fecha_autopago' => Carbon::today(),
            'monto' => -5000,
        ]);

        $job = new ProcessAutoBills();
        $job->handle();

        // Verify bill was NOT processed (still pending)
        $bill->refresh();
        $this->assertEquals('pending', $bill->status);
    }

    /** @test */
    public function job_does_not_process_completed_bills(): void
    {
        // Create an already completed bill
        $bill = Transaccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_predeterminada_id' => $this->cuenta->id,
            'status' => 'completed',
            'debito_automatico' => true,
            'fecha_autopago' => Carbon::today(),
            'monto' => -5000,
        ]);

        $job = new ProcessAutoBills();
        $job->handle();

        // Verify status is still completed
        $bill->refresh();
        $this->assertEquals('completed', $bill->status);
    }

    /** @test */
    public function job_updates_account_balance(): void
    {
        $initialBalance = $this->cuenta->saldo_actual;

        // Create a bill that will be processed
        $bill = Transaccion::factory()->create([
            'proyecto_id' => $this->proyecto->id,
            'cuenta_predeterminada_id' => $this->cuenta->id,
            'status' => 'pending',
            'debito_automatico' => true,
            'fecha_autopago' => Carbon::today(),
            'monto' => -5000, // Expense (negative)
        ]);

        $job = new ProcessAutoBills();
        $job->handle();

        // Verify account balance was updated
        $this->cuenta->refresh();
        $this->assertEquals($initialBalance - 5000, $this->cuenta->saldo_actual);
    }

    /** @test */
    public function job_uses_correct_queue(): void
    {
        $job = new ProcessAutoBills();

        // Verify it implements ShouldQueue
        $this->assertInstanceOf(\Illuminate\Contracts\Queue\ShouldQueue::class, $job);
    }
}
