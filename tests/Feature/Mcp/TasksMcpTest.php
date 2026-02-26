<?php declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Mcp\Tools\CreateTaskTool;
use App\Mcp\Tools\ListTasksTool;
use App\Mcp\Tools\TaskSummaryTool;
use App\Mcp\Tools\UpdateTaskTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Mcp\Request;
use Mockery;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class TasksMcpTest extends TestCase
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
    public function validate_schema_for_create_task_tool()
    {
        $tool = new CreateTaskTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('title', $schema);
    }

    #[Test]
    public function validate_schema_for_list_tasks_tool()
    {
        $tool = new ListTasksTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
    }

    #[Test]
    public function validate_schema_for_task_summary_tool()
    {
        $tool = new TaskSummaryTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
    }

    #[Test]
    public function validate_schema_for_update_task_tool()
    {
        $tool = new UpdateTaskTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('task_id', $schema);
    }
}
