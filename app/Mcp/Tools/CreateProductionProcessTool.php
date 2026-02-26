<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Operations\Actions\CreateProductionProcessAction;
use App\Modules\Operations\DTOs\CreateProductionProcessDTO;

class CreateProductionProcessTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Creates a new production process in the specified project.
        Requires a name. Optionally provide description and inventory_item_id for the output product.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        $dto = new CreateProductionProcessDTO(
            proyecto: $proyecto,
            name: (string) $request->get('name'),
            description: $request->get('description') ? (string) $request->get('description') : null,
            inventoryItemId: $request->get('inventory_item_id') ? (int) $request->get('inventory_item_id') : null,
            stages: []
        );

        $process = app(CreateProductionProcessAction::class)->execute($dto);

        return Response::text("Success: Production process '{$process->name}' created with ID {$process->id}.");
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'name' => $schema->string()->description('Name of the production process (e.g. "Proceso Café Lavado").'),
            'description' => $schema->string()->description('Optional description of the process.'),
            'inventory_item_id' => $schema->integer()->description('Optional ID of the output inventory item.'),
        ];
        return $properties;
    }
}
