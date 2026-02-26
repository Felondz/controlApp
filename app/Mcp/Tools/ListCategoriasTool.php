<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Modules\Finance\Models\Categoria;

class ListCategoriasTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Lists financial categories for a project. Optionally filter by type (income, expense).
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        $query = Categoria::where('proyecto_id', $proyectoId);

        $tipo = $request->get('tipo');
        if ($tipo) {
            $query->where('tipo', (string) $tipo);
        }

        $categorias = $query->get();

        if ($categorias->isEmpty()) {
            return Response::text("No categories found for project {$proyectoId}.");
        }

        $result = "Categories:\n";
        foreach ($categorias as $cat) {
            $result .= "- [{$cat->id}] {$cat->nombre} | Type: {$cat->tipo}\n";
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
            'tipo' => $schema->string()->description('Optional: income or expense.'),
        ];
        return $properties;
    }
}
