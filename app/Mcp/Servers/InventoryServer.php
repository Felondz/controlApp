<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\ConsultStockTool;
use App\Mcp\Tools\CreateInventoryItemTool;
use App\Mcp\Tools\UpdateInventoryItemTool;
use Laravel\Mcp\Server;

class InventoryServer extends Server
{
    /**
     * The server's name.
     */
    protected string $name = 'ControlApp-Inventory';

    /**
     * The server's version.
     */
    protected string $version = '1.0.0';

    /**
     * The instructions that should be provided to the client.
     */
    protected string $instructions = <<<'MARKDOWN'
        Use these tools to consult or modify the Inventory items for ControlApp.
        When providing `proyecto_id`, this is the project or "hacienda" context you are working on.
        Stock values automatically resolve against related models. 
    MARKDOWN;

    /**
     * The tools that should be made available to the client.
     *
     * @return array<int, class-string>
     */
    protected function tools(): array
    {
        return [
            ConsultStockTool::class,
            CreateInventoryItemTool::class,
            UpdateInventoryItemTool::class,
        ];
    }

    /**
     * The prompts that should be made available to the client.
     *
     * @return array<int, class-string>
     */
    protected function prompts(): array
    {
        return [
            //
        ];
    }
}
