<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Modules\Operations\Models\ProductionProcess;

class ListProductionProcessesTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Lists production processes for a given project. Optionally filter by name.
        Returns process name, description, stages count, active lotes count, and whether it's active.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');
        $search = $request->get('search');

        $query = ProductionProcess::where('proyecto_id', $proyectoId)
            ->withCount(['etapas', 'lotes' => function ($q) {
                $q->where('status', 'active');
            }]);

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $processes = $query->get();

        if ($processes->isEmpty()) {
            return Response::text("No production processes found for project {$proyectoId}.");
        }

        $result = "Production Processes:\n";
        foreach ($processes as $process) {
            $status = $process->is_active ? '✅ Active' : '❌ Inactive';
            $result .= "- [{$process->id}] {$process->name} ({$status}) | Stages: {$process->etapas_count} | Active Lotes: {$process->lotes_count}";
            if ($process->description) {
                $result .= " | {$process->description}";
            }
            $result .= "\n";
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
            'search' => $schema->string()->description('Optional name filter for processes.'),
        ];
        return $properties;
    }
}
