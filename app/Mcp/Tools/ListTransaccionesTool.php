<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Modules\Finance\Models\Transaccion;

class ListTransaccionesTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Lists recent transactions for a project. Optionally filter by status (completed, pending).
        Returns amount, description, date, account, and category info.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');
        $status = $request->get('status') ? (string) $request->get('status') : 'completed';

        $transacciones = Transaccion::where('proyecto_id', $proyectoId)
            ->where('status', $status)
            ->with(['cuenta', 'categoria'])
            ->orderByDesc('fecha')
            ->limit(20)
            ->get();

        if ($transacciones->isEmpty()) {
            return Response::text("No transactions found for project {$proyectoId} with status '{$status}'.");
        }

        $result = "Transactions ({$status}):\n";
        foreach ($transacciones as $t) {
            $amount = number_format((float) $t->monto / 100, 2);
            $cuentaName = $t->cuenta->nombre ?? 'N/A';
            $catName = $t->categoria->nombre ?? 'N/A';
            $result .= "- [{$t->id}] \${$amount} | {$t->descripcion} | {$t->fecha} | Account: {$cuentaName} | Category: {$catName}\n";
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
            'status' => $schema->string()->description('Optional: completed (default) or pending.'),
        ];
        return $properties;
    }
}
