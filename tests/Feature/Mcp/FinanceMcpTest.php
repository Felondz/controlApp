<?php declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Mcp\Tools\ConsultBalanceTool;
use App\Mcp\Tools\CreateCuentaTool;
use App\Mcp\Tools\CreateTransaccionTool;
use App\Mcp\Tools\ListCategoriasTool;
use App\Mcp\Tools\ListCuentasTool;
use App\Mcp\Tools\ListTransaccionesTool;
use App\Mcp\Tools\PayBillTool;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Mockery;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class FinanceMcpTest extends TestCase
{
    use RefreshDatabase;

    private JsonSchema $schemaMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->schemaMock = Mockery::mock(JsonSchema::class);
        $this->schemaMock->shouldReceive('integer')->andReturnSelf();
        $this->schemaMock->shouldReceive('string')->andReturnSelf();
        $this->schemaMock->shouldReceive('number')->andReturnSelf();
        $this->schemaMock->shouldReceive('boolean')->andReturnSelf();
        $this->schemaMock->shouldReceive('description')->andReturnSelf();
        $this->schemaMock->shouldReceive('enum')->andReturnSelf();
        $this->schemaMock->shouldReceive('type')->andReturnSelf();
    }

    #[Test]
    public function consult_balance_tool_returns_schema_and_requires_project()
    {
        $tool = new ConsultBalanceTool();
        $schema = $tool->schema($this->schemaMock);
        
        $this->assertArrayHasKey('proyecto_id', $schema);

        $request = new Request(['proyecto_id' => 9999]);
        $response = $tool->handle($request);
        
        $this->assertStringContainsString('not found', (string) $response->content());
    }

    #[Test]
    public function create_cuenta_tool_validates_schema()
    {
        $tool = new CreateCuentaTool();
        $schema = $tool->schema($this->schemaMock);
        
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('nombre', $schema);
        $this->assertArrayHasKey('tipo', $schema);
    }

    #[Test]
    public function list_categorias_tool_validates_schema()
    {
        $tool = new ListCategoriasTool();
        $schema = $tool->schema($this->schemaMock);
        
        $this->assertArrayHasKey('proyecto_id', $schema);
    }

    #[Test]
    public function list_cuentas_tool_validates_schema()
    {
        $tool = new ListCuentasTool();
        $schema = $tool->schema($this->schemaMock);
        
        $this->assertArrayHasKey('proyecto_id', $schema);
    }

    #[Test]
    public function create_transaccion_tool_validates_schema()
    {
        $tool = new CreateTransaccionTool();
        $schema = $tool->schema($this->schemaMock);
        
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('monto', $schema);
        $this->assertArrayHasKey('cuenta_id', $schema);
    }

    #[Test]
    public function list_transacciones_tool_validates_schema()
    {
        $tool = new ListTransaccionesTool();
        $schema = $tool->schema($this->schemaMock);
        
        $this->assertArrayHasKey('proyecto_id', $schema);
    }

    #[Test]
    public function pay_bill_tool_enforces_confirm_action_security()
    {
        $tool = new PayBillTool();
        $schema = $tool->schema($this->schemaMock);
        
        $this->assertArrayHasKey('confirm_action', $schema);
        
        // Setup missing confirm_action
        $requestWithoutConfirmation = new Request([
            'proyecto_id' => 1,
            'transaccion_id' => 1,
        ]);
        
        $response = $tool->handle($requestWithoutConfirmation);
        
        $this->assertStringContainsString('Error: This is a destructive action.', (string) $response->content());
        
        // Setup confirm_action: false
        $requestWithFalseConfirmation = new Request([
            'proyecto_id' => 1,
            'transaccion_id' => 1,
            'confirm_action' => false
        ]);
        
        $responseFalse = $tool->handle($requestWithFalseConfirmation);
        $this->assertStringContainsString('Error: This is a destructive action.', (string) $responseFalse->content());
    }
}
