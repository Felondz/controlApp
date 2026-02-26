<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Chat\Actions\SendMessageAction;
use App\Modules\Chat\DTOs\SendMessageDTO;

class SendMessageTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Sends a chat message to a project's chat channel. Optionally send a private message to a specific user.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        $dto = new SendMessageDTO(
            proyecto: $proyecto,
            userId: 1,
            content: (string) $request->get('content'),
            type: $request->get('type') ? (string) $request->get('type') : 'text',
            recipientId: $request->get('recipient_id') ? (int) $request->get('recipient_id') : null,
        );

        $message = app(SendMessageAction::class)->execute($dto);

        return Response::text("Success: Message sent with ID {$message->id}.");
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project.'),
            'content' => $schema->string()->description('Message content (max 1000 chars).'),
            'type' => $schema->string()->description('Optional: text (default), image, file.'),
            'recipient_id' => $schema->string()->description('Optional: user ID for private message.'),
        ];
        return $properties;
    }
}
