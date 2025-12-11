<?php

namespace App\Modules\Inventory;

use App\Core\Modules\AbstractModule;
use App\Models\Proyecto;

/**
 * InventoryModule
 * 
 * Centralized inventory management module.
 * Handles Items (SKUs), Warehouses, and Stock Movements.
 * Independent core module required by Operations/Sales.
 */
class InventoryModule extends AbstractModule
{
    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'inventory';
    }

    /**
     * {@inheritdoc}
     */
    public function getVersion(): string
    {
        return '1.0.0';
    }

    /**
     * {@inheritdoc}
     */
    public function getDependencies(): array
    {
        return []; // Core module, independent.
    }

    /**
     * {@inheritdoc}
     */
    public function getCapabilities(): array
    {
        return [
            'provides' => [
                'inventory_items',    // SKUs / Products / Raw Materials
                'stock_management',   // Stock levels
                'warehouses',         // Locations (future)
            ],
            'consumes' => [],
            'exposes' => [
                'api' => [
                    '/api/proyectos/{proyecto}/inventory/items',
                    '/api/proyectos/{proyecto}/inventory/transactions',
                ],
                'events' => [
                    'inventory.item.created',
                    'inventory.stock.updated', // Low stock alerts logic triggers here
                    'inventory.stock.low',
                ],
                'widgets' => [
                    'StockLevelsWidget',
                    'LowStockAlertWidget',
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getRoutes(): array
    {
        return [
            'web' => __DIR__ . '/routes/web.php',
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getEventListeners(): array
    {
        return [
            // Listen for Finance Contract Execution to create Draft Inventory Entries
            \App\Modules\Finance\Events\SupplyContractExecuted::class => [
                \App\Modules\Inventory\Listeners\CreateInventoryDraftEntry::class,
            ],
            // Alert logic
            \App\Modules\Inventory\Events\InventoryLowStock::class => [
                \App\Modules\Inventory\Listeners\CreateReplenishmentTask::class,
            ],
            // Production Finished -> Add Stock
            \App\Modules\Operations\Events\LoteFinished::class => [
                \App\Modules\Inventory\Listeners\CreateFinishedGoodsEntry::class,
            ],
        ];
    }

    /**
     * Boot the module.
     */
    public function boot(): void
    {
        \App\Modules\Inventory\Models\InventoryTransaction::observe(\App\Modules\Inventory\Observers\InventoryTransactionObserver::class);
    }

    /**
     * Hook called when module is installed.
     *
     * @param Proyecto $project
     * @param array $config
     */
    protected function onInstall(Proyecto $project, array $config): void
    {
        // Setup initial default warehouse?
    }

    /**
     * {@inheritdoc}
     */
    protected function onUninstall(Proyecto $project): void
    {
        // Prevent accidental data loss of inventory
    }
}
