<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Operations\Models\ProductionProcess;
use App\Modules\Operations\Actions\DeleteProductionProcessAction;

class DeleteProductionProcessTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Deletes a production process. Will fail if it has active lotes.
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

        try {
            app(DeleteProductionProcessAction::class)->execute($process);
            return Response::text("Success: Production process '{$process->name}' (ID {$process->id}) deleted.");
        } catch (\Exception $e) {
            return Response::text("Error: {$e->getMessage()}");
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'process_id' => $schema->integer()->description('The ID of the production process to delete.'),
        ];
        return $properties;
    }
}
