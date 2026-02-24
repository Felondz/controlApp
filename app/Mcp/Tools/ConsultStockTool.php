<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Modules\Inventory\Models\InventoryItem;

class ConsultStockTool extends Tool
{
    /**
     * The tool's description.
     */
    protected string $description = <<<'MARKDOWN'
        Consults the stock levels of an inventory item by its name or SKU within a specific project.
    MARKDOWN;

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');
        $search = (string) $request->get('search');

        $items = InventoryItem::where('proyecto_id', $proyectoId)
            ->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            })
            ->get();

        if ($items->isEmpty()) {
            return Response::text("No items found matching '{$search}'.");
        }

        $result = "Stock Results:\n";
        foreach ($items as $item) {
            $result .= "- {$item->name} (SKU: {$item->sku}): {$item->current_stock} {$item->unit}\n";
        }

        return Response::text($result);
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'search' => $schema->string()->description('The name or SKU of the inventory item to search for.'),
        ];
        return $properties;
    }
}
