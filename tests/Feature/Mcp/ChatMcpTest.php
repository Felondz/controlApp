<?php declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Mcp\Tools\ListMessagesTool;
use App\Mcp\Tools\SendMessageTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Mcp\Request;
use Mockery;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ChatMcpTest extends TestCase
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
    public function validate_schema_for_list_messages_tool()
    {
        $tool = new ListMessagesTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
    }

    #[Test]
    public function validate_schema_for_send_message_tool()
    {
        $tool = new SendMessageTool();
        $schema = $tool->schema($this->schemaMock);
        $this->assertArrayHasKey('proyecto_id', $schema);
        $this->assertArrayHasKey('recipient_id', $schema);
        $this->assertArrayHasKey('content', $schema);
    }
}
