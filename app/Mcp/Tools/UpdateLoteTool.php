<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Operations\Models\LoteProduccion;
use App\Modules\Operations\Actions\UpdateLoteAction;
use App\Modules\Operations\DTOs\UpdateLoteDTO;

class UpdateLoteTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Updates notes and/or assigned user of an existing lote.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        /** @var LoteProduccion|null $lote */
        $lote = LoteProduccion::where('proyecto_id', $proyecto->id)->find((int) $request->get('lote_id'));
        if (!$lote) {
            return Response::text("Lote not found.");
        }

        $dto = new UpdateLoteDTO(
            lote: $lote,
            notes: $request->get('notes') ? (string) $request->get('notes') : null,
            assignedTo: $request->get('assigned_to') ? (int) $request->get('assigned_to') : null
        );

        $updated = app(UpdateLoteAction::class)->execute($dto);

        return Response::text("Success: Lote '{$updated->code}' (ID {$updated->id}) updated.");
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'lote_id' => $schema->integer()->description('The ID of the lote to update.'),
            'notes' => $schema->string()->description('Optional new notes.'),
            'assigned_to' => $schema->integer()->description('Optional new user ID to assign the lote to.'),
        ];
        return $properties;
    }
}
