<?php declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Mcp\Tools\AddLoteInputTool;
use App\Mcp\Tools\ConsultLotesTool;
use App\Mcp\Tools\ConsumeLoteInputTool;
use App\Mcp\Tools\CreateLoteTool;
use App\Mcp\Tools\CreateProductionProcessTool;
use App\Mcp\Tools\DeleteProductionProcessTool;
use App\Mcp\Tools\DiscardLoteTool;
use App\Mcp\Tools\FinishLoteTool;
use App\Mcp\Tools\ListProductionProcessesTool;
use App\Mcp\Tools\UpdateLoteStageTool;
use App\Mcp\Tools\UpdateLoteTool;
use App\Mcp\Tools\UpdateProductionProcessTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Mcp\Request;
use Mockery;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class OperationsMcpTest extends TestCase
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
        $this->schemaMock->shouldReceive('array')->andReturnSelf();
        $this->schemaMock->shouldReceive('items')->andReturnSelf();
    }

    #[Test]
    public function validate_schema_for_add_lote_input_tool()
    {
        $tool = new AddLoteInputTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('lote_id', $schema);
        $this->assertArrayHasKey('inventory_item_id', $schema);
    }

    #[Test]
    public function validate_schema_for_consult_lotes_tool()
    {
        $tool = new ConsultLotesTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
    }

    #[Test]
    public function validate_schema_for_create_lote_tool()
    {
        $tool = new CreateLoteTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('production_process_id', $schema);
    }

    #[Test]
    public function validate_schema_for_create_production_process_tool()
    {
        $tool = new CreateProductionProcessTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('name', $schema);
    }

    #[Test]
    public function validate_schema_for_list_production_processes_tool()
    {
        $tool = new ListProductionProcessesTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
    }

    #[Test]
    public function validate_schema_for_update_lote_stage_tool()
    {
        $tool = new UpdateLoteStageTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('lote_id', $schema);
    }

    #[Test]
    public function validate_schema_for_update_lote_tool()
    {
        $tool = new UpdateLoteTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('lote_id', $schema);
    }

    #[Test]
    public function validate_schema_for_update_production_process_tool()
    {
        $tool = new UpdateProductionProcessTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('process_id', $schema);
    }

    // Protected Tools
    #[Test]
    public function consume_lote_input_enforces_confirm_action()
    {
        $tool = new ConsumeLoteInputTool();
        $this->assertArrayHasKey('confirm_action', $tool->schema($this->schemaMock));
        
        $request = new Request(['proyecto_id' => 1, 'lote_id' => 1]);
        $response = $tool->handle($request);
        $this->assertStringContainsString('Error: This is a destructive action.', (string) $response->content());
    }

    #[Test]
    public function delete_production_process_enforces_confirm_action()
    {
        $tool = new DeleteProductionProcessTool();
        $this->assertArrayHasKey('confirm_action', $tool->schema($this->schemaMock));
        
        $request = new Request(['proyecto_id' => 1, 'process_id' => 1]);
        $response = $tool->handle($request);
        $this->assertStringContainsString('Error: This is a destructive action.', (string) $response->content());
    }

    #[Test]
    public function discard_lote_enforces_confirm_action()
    {
        $tool = new DiscardLoteTool();
        $this->assertArrayHasKey('confirm_action', $tool->schema($this->schemaMock));
        
        $request = new Request(['proyecto_id' => 1, 'lote_id' => 1]);
        $response = $tool->handle($request);
        $this->assertStringContainsString('Error: This is a destructive action.', (string) $response->content());
    }

    #[Test]
    public function finish_lote_enforces_confirm_action()
    {
        $tool = new FinishLoteTool();
        $this->assertArrayHasKey('confirm_action', $tool->schema($this->schemaMock));
        
        $request = new Request(['proyecto_id' => 1, 'lote_id' => 1]);
        $response = $tool->handle($request);
        $this->assertStringContainsString('Error: This is a destructive action.', (string) $response->content());
    }
}
