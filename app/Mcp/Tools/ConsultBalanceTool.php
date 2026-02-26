<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;

class ConsultBalanceTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Gets the financial balance summary for a project: net worth, pending bills count, and transaction count this month.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        $balanceSql = "SUM(CASE WHEN tipo IN ('credito', 'prestamo') THEN -ABS(saldo_actual) ELSE saldo_actual END) as net_worth";

        $ownedBalance = $proyecto->cuentas()
            ->selectRaw($balanceSql)
            ->value('net_worth') ?? 0;

        $linkedBalance = $proyecto->cuentasAsociadas()
            ->selectRaw($balanceSql)
            ->value('net_worth') ?? 0;

        $pendingBills = $proyecto->transacciones()
            ->where('status', 'pending')
            ->count();

        $transactionCount = $proyecto->transacciones()
            ->where('status', 'completed')
            ->whereMonth('fecha', now()->month)
            ->whereYear('fecha', now()->year)
            ->count();

        $netWorth = $ownedBalance + $linkedBalance;
        $formatted = number_format((float) $netWorth / 100, 2);

        return Response::text(
            "Balance Summary for Project {$proyectoId}:\n" .
            "- Net Worth: \${$formatted}\n" .
            "- Pending Bills: {$pendingBills}\n" .
            "- Transactions This Month: {$transactionCount}"
        );
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
        ];
        return $properties;
    }
}
