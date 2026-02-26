<?php declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Mcp\Tools\ConsultStockTool;
use App\Mcp\Tools\CreateInventoryItemTool;
use App\Mcp\Tools\UpdateInventoryItemTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Mcp\Request;
use Mockery;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class InventoryMcpTest extends TestCase
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
    public function validate_schema_for_consult_stock_tool()
    {
        $tool = new ConsultStockTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
    }

    #[Test]
    public function validate_schema_for_create_inventory_item_tool()
    {
        $tool = new CreateInventoryItemTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('name', $schema);
        $this->assertArrayHasKey('unit', $schema);
        $this->assertArrayHasKey('type', $schema);
    }

    #[Test]
    public function validate_schema_for_update_inventory_item_tool()
    {
        $tool = new UpdateInventoryItemTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('item_id', $schema);
    }
}
