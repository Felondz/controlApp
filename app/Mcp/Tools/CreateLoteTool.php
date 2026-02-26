<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Operations\Actions\CreateLoteAction;
use App\Modules\Operations\DTOs\CreateLoteDTO;

class CreateLoteTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Creates a new production lote (batch) for the specified production process.
        The lote starts at the first stage of the process. Requires a start date.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        $dto = new CreateLoteDTO(
            proyecto: $proyecto,
            productionProcessId: (int) $request->get('production_process_id'),
            startDate: (string) $request->get('start_date'),
            assignedTo: $request->get('assigned_to') ? (int) $request->get('assigned_to') : null,
            notes: $request->get('notes') ? (string) $request->get('notes') : null
        );

        try {
            $lote = app(CreateLoteAction::class)->execute($dto);
            return Response::text("Success: Lote '{$lote->code}' created with ID {$lote->id}. Status: {$lote->status}.");
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
            'production_process_id' => $schema->integer()->description('The ID of the production process to create the lote for.'),
            'start_date' => $schema->string()->description('Start date for the lote (YYYY-MM-DD format).'),
            'assigned_to' => $schema->integer()->description('Optional user ID to assign the lote to.'),
            'notes' => $schema->string()->description('Optional notes for the lote.'),
        ];
        return $properties;
    }
}
