<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Operations\Models\ProductionProcess;
use App\Modules\Operations\Actions\UpdateProductionProcessAction;
use App\Modules\Operations\DTOs\UpdateProductionProcessDTO;

class UpdateProductionProcessTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Updates an existing production process. Can change name, description, output product, and active status.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        /** @var ProductionProcess|null $process */
        $process = ProductionProcess::where('proyecto_id', $proyecto->id)->find((int) $request->get('process_id'));
        if (!$process) {
            return Response::text("Production process not found.");
        }

        $dto = new UpdateProductionProcessDTO(
            proyecto: $proyecto,
            process: $process,
            name: (string) $request->get('name'),
            description: $request->get('description') ? (string) $request->get('description') : null,
            inventoryItemId: $request->get('inventory_item_id') ? (int) $request->get('inventory_item_id') : null,
            isActive: $request->get('is_active') !== null ? (bool) $request->get('is_active') : true
        );

        $updated = app(UpdateProductionProcessAction::class)->execute($dto);

        return Response::text("Success: Production process '{$updated->name}' (ID {$updated->id}) updated.");
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'process_id' => $schema->integer()->description('The ID of the production process to update.'),
            'name' => $schema->string()->description('New name for the process.'),
            'description' => $schema->string()->description('Optional new description.'),
            'inventory_item_id' => $schema->integer()->description('Optional new output inventory item ID.'),
            'is_active' => $schema->boolean()->description('Whether the process should be active (default true).'),
        ];
        return $properties;
    }
}
