<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use App\Models\User;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Categoria;
use App\Modules\Finance\Models\Transaccion;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Tests for ExportController API endpoints.
 * Uses SQLite in-memory database with RefreshDatabase trait.
 */
class ExportControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Proyecto $proyecto;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test user
        $this->user = User::factory()->create();

        // Create project and attach user as admin
        $this->proyecto = Proyecto::factory()->create();
        $this->proyecto->miembros()->attach($this->user->id, ['rol' => 'admin']);

        // Create accounts using polymorphic relation (propietario, not proyecto_id)
        Cuenta::factory()->count(2)->create([
            'propietario_id' => $this->proyecto->id,
            'propietario_type' => 'proyecto',
        ]);

        // Create categories
        Categoria::factory()->count(3)->create(['proyecto_id' => $this->proyecto->id]);

        Sanctum::actingAs($this->user);
    }

    #[Test]
    public function member_can_export_transactions_to_csv(): void
    {
        $response = $this->getJson("/api/proyectos/{$this->proyecto->id}/export/csv?type=transactions");

        $response->assertSuccessful();
        $response->assertJson([
            'status' => 'processing',
            'message' => 'El proceso de exportación CSV ha comenzado. Se te notificará cuando esté listo.'
        ]);
    }

    #[Test]
    public function member_can_export_accounts_to_csv(): void
    {
        $response = $this->getJson("/api/proyectos/{$this->proyecto->id}/export/csv?type=accounts");

        $response->assertSuccessful();
        $response->assertJson([
            'status' => 'processing',
            'message' => 'El proceso de exportación CSV ha comenzado. Se te notificará cuando esté listo.'
        ]);
    }

    #[Test]
    public function member_can_export_categories_to_csv(): void
    {
        $response = $this->getJson("/api/proyectos/{$this->proyecto->id}/export/csv?type=categories");

        $response->assertSuccessful();
        $response->assertJson([
            'status' => 'processing',
            'message' => 'El proceso de exportación CSV ha comenzado. Se te notificará cuando esté listo.'
        ]);
    }

    #[Test]
    public function csv_export_supports_date_filtering(): void
    {
        $response = $this->getJson("/api/proyectos/{$this->proyecto->id}/export/csv?type=transactions&from=2024-01-01&to=2024-12-31");

        $response->assertSuccessful();
    }

    #[Test]
    public function non_member_cannot_export_csv(): void
    {
        $otherUser = User::factory()->create();
        Sanctum::actingAs($otherUser);

        $response = $this->getJson("/api/proyectos/{$this->proyecto->id}/export/csv");

        $response->assertForbidden();
    }

    #[Test]
    public function member_can_export_pdf_summary(): void
    {
        $response = $this->postJson("/api/proyectos/{$this->proyecto->id}/export/pdf", [
            'type' => 'summary',
        ]);

        $response->assertSuccessful();
        $response->assertJson([
            'status' => 'processing',
            'message' => 'El reporte PDF se está generando en segundo plano. Podrás descargarlo pronto.'
        ]);
    }

    #[Test]
    public function pdf_export_supports_date_range(): void
    {
        $response = $this->postJson("/api/proyectos/{$this->proyecto->id}/export/pdf", [
            'type' => 'all',
            'from' => '2024-01-01',
            'to' => '2024-12-31',
        ]);

        $response->assertSuccessful();
    }

    #[Test]
    public function non_member_cannot_export_pdf(): void
    {
        $otherUser = User::factory()->create();
        Sanctum::actingAs($otherUser);

        $response = $this->postJson("/api/proyectos/{$this->proyecto->id}/export/pdf");

        $response->assertForbidden();
    }

    #[Test]
    public function csv_export_validates_type_parameter(): void
    {
        $response = $this->getJson("/api/proyectos/{$this->proyecto->id}/export/csv?type=invalid");

        $response->assertUnprocessable();
    }

    #[Test]
    public function pdf_export_validates_type_parameter(): void
    {
        $response = $this->postJson("/api/proyectos/{$this->proyecto->id}/export/pdf", [
            'type' => 'invalid',
        ]);

        $response->assertUnprocessable();
    }

    #[Test]
    public function unauthenticated_user_cannot_export(): void
    {
        // Clear authentication
        $this->app['auth']->forgetGuards();

        $response = $this->getJson("/api/proyectos/{$this->proyecto->id}/export/csv");

        $response->assertUnauthorized();
    }
}
