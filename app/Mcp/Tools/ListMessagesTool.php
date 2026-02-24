<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Modules\Chat\Models\Message;

class ListMessagesTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Lists recent chat messages for a project. Returns sender, content, timestamp, and read status.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');
        $limit = $request->get('limit') ? (int) $request->get('limit') : 20;

        $messages = Message::where('proyecto_id', $proyectoId)
            ->whereNull('recipient_id')
            ->with('user:id,name')
            ->latest()
            ->limit(min($limit, 50))
            ->get();

        if ($messages->isEmpty()) {
            return Response::text("No messages found for project {$proyectoId}.");
        }

        $result = "Messages:\n";
        foreach ($messages as $msg) {
            $sender = $msg->user->name ?? 'Unknown';
            $time = $msg->created_at->format('Y-m-d H:i');
            $read = $msg->read_at ? '✓' : '○';
            $result .= "- [{$read}] {$sender} ({$time}): {$msg->content}\n";
        }

        return Response::text($result);
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project.'),
            'limit' => $schema->integer()->description('Optional: number of messages (default 20, max 50).'),
        ];
        return $properties;
    }
}
