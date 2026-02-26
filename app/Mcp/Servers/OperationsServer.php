<?php declare(strict_types=1);

namespace App\Mcp\Servers;

use App\Mcp\Tools\ListProductionProcessesTool;
use App\Mcp\Tools\CreateProductionProcessTool;
use App\Mcp\Tools\UpdateProductionProcessTool;
use App\Mcp\Tools\DeleteProductionProcessTool;
use App\Mcp\Tools\ConsultLotesTool;
use App\Mcp\Tools\CreateLoteTool;
use App\Mcp\Tools\UpdateLoteTool;
use App\Mcp\Tools\UpdateLoteStageTool;
use App\Mcp\Tools\FinishLoteTool;
use App\Mcp\Tools\DiscardLoteTool;
use App\Mcp\Tools\AddLoteInputTool;
use App\Mcp\Tools\ConsumeLoteInputTool;
use Laravel\Mcp\Server;

class OperationsServer extends Server
{
    protected string $name = 'ControlApp-Operations';

    protected string $version = '1.0.0';

    protected string $instructions = <<<'MARKDOWN'
        Use these tools to manage production processes and lotes for ControlApp.
        A production process defines stages (etapas) and recipes. Lotes are batches that progress through those stages.
        When providing `proyecto_id`, this is the project/hacienda context.
        Lotes have a lifecycle: active → finished or discarded.
        Inputs (insumos) can be added to lotes and consumed at each stage.
    MARKDOWN;

    /**
     * @return array<int, class-string>
     */
    protected function tools(): array
    {
        return [
            ListProductionProcessesTool::class,
            CreateProductionProcessTool::class,
            UpdateProductionProcessTool::class,
            DeleteProductionProcessTool::class,
            ConsultLotesTool::class,
            CreateLoteTool::class,
            UpdateLoteTool::class,
            UpdateLoteStageTool::class,
            FinishLoteTool::class,
            DiscardLoteTool::class,
            AddLoteInputTool::class,
            ConsumeLoteInputTool::class,
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
