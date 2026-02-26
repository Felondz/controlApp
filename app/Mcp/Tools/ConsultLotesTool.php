<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Modules\Operations\Models\LoteProduccion;

class ConsultLotesTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Queries production lotes (batches) for a project. Filter by status (active, finished, discarded) or search by code.
        Returns lote code, process name, current stage, status, and dates.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        $query = LoteProduccion::where('proyecto_id', $proyectoId)
            ->with(['productionProcess', 'stage', 'assignee']);

        $status = $request->get('status');
        if ($status) {
            $query->where('status', (string) $status);
        }

        $search = $request->get('search');
        if ($search) {
            $query->where('code', 'like', "%{$search}%");
        }

        $lotes = $query->orderByDesc('created_at')->limit(20)->get();

        if ($lotes->isEmpty()) {
            return Response::text("No lotes found for project {$proyectoId}.");
        }

        $result = "Production Lotes:\n";
        foreach ($lotes as $lote) {
            $processName = $lote->productionProcess->name;
            $stageName = $lote->stage->name;
            $assigneeName = $lote->assignee->name ?? 'Unassigned';
            $result .= "- [{$lote->id}] {$lote->code} | Process: {$processName} | Stage: {$stageName} | Status: {$lote->status} | Assigned: {$assigneeName} | Start: {$lote->start_date}\n";
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
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'status' => $schema->string()->description('Optional filter: active, finished, or discarded.'),
            'search' => $schema->string()->description('Optional search by lote code.'),
        ];
        return $properties;
    }
}
