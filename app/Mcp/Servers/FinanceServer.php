<?php declare(strict_types=1);

namespace App\Mcp\Servers;

use App\Mcp\Tools\ConsultBalanceTool;
use App\Mcp\Tools\ListTransaccionesTool;
use App\Mcp\Tools\CreateTransaccionTool;
use App\Mcp\Tools\ListCuentasTool;
use App\Mcp\Tools\CreateCuentaTool;
use App\Mcp\Tools\PayBillTool;
use App\Mcp\Tools\ListCategoriasTool;
use Laravel\Mcp\Server;

class FinanceServer extends Server
{
    protected string $name = 'ControlApp-Finance';

    protected string $version = '1.0.0';

    protected string $instructions = <<<'MARKDOWN'
        Use these tools to query and manage financial data for ControlApp.
        All monetary amounts are stored in CENTS (e.g. 10000 = $100.00).
        Accounts have types: efectivo, banco, credito, prestamo, inversion, otro.
        Categories classify transactions as income or expense.
        When providing `proyecto_id`, this is the project/hacienda context.
    MARKDOWN;

    /**
     * @return array<int, class-string>
     */
    protected function tools(): array
    {
        return [
            ConsultBalanceTool::class,
            ListTransaccionesTool::class,
            CreateTransaccionTool::class,
            ListCuentasTool::class,
            CreateCuentaTool::class,
            PayBillTool::class,
            ListCategoriasTool::class,
        ];
    }

    /**
     * @return array<int, class-string>
     */
    protected function prompts(): array
    {
        return [];
    }
}
