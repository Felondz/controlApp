<?php

namespace App\Modules\Operations;

use App\Core\Modules\AbstractModule;
use App\Models\Proyecto;

/**
 * OperationsModule
 * 
 * Production control.
 * Integrates with Tasks (automation) and Finance (costing).
 */
class OperationsModule extends AbstractModule
{
    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'operations';
    }

    /**
     * {@inheritdoc}
     */
    public function getVersion(): string
    {
        return '1.0.0'; // v1.3 Design Implementation
    }

    /**
     * {@inheritdoc}
     */
    public function getDependencies(): array
    {
        return ['tasks', 'finance', 'inventory']; // Depends on Inventory for raw materials
    }

    /**
     * {@inheritdoc}
     */
    public function getCapabilities(): array
    {
        return [
            'provides' => [
                'production_batches', // Lotes
                'iot_integration',    // Mediciones
            ],
            'consumes' => [
                'tasks',     // Uses tasks for workflow automation
                'finance',   // Uses finance for costing
                'inventory', // Uses inventory for raw materials/products
            ],
            'exposes' => [
                'api' => [
                    '/api/proyectos/{proyecto}/operations/lotes',
                    '/api/proyectos/{proyecto}/operations/inventory',
                ],
                'events' => [
                    'operations.lote.created',
                    'operations.lote.stage_changed',
                    'operations.lote.finished',
                    'operations.lote.discarded',
                    'operations.insumo.low_stock',
                    'operations.insumo.purchased',
                    'operations.sensordata.alert',
                ],
                'widgets' => [
                    'ActiveBatchesWidget',
                    'InventoryAlertsWidget',
                ],
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function getRoutes(): array
    {
        return [
            'web' => __DIR__ . '/routes/web.php',
        ];
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function getEventListeners(): array
    {
        return [
            'operations.lote.created' => [
                \App\Modules\Operations\Listeners\HandleLoteCreated::class,
                \App\Modules\Operations\Listeners\HydrateLoteInputs::class,
            ],
            'operations.lote.input_added' => [
                \App\Modules\Operations\Listeners\HandleLoteInput::class,
            ],
            'operations.lote.stage_changed' => [
                \App\Modules\Operations\Listeners\GenerateStageTasks::class,
            ],
            'operations.lote.finished' => [
                \App\Modules\Operations\Listeners\HandleLoteFinish::class,
            ],
            'operations.lote.discarded' => [
                \App\Modules\Operations\Listeners\HandleLoteDiscard::class,
            ],

        ];
    }

    /**
     * Hook called when module is installed.
     *
     * @param Proyecto $project
     * @param array $config
     * @return void
     */
    protected function onInstall(Proyecto $project, array $config): void
    {
        // Setup initial inventory categories or default stages?
    }

    /**
     * Hook called when module is uninstalled.
     *
     * @param Proyecto $project
     * @return void
     */
    protected function onUninstall(Proyecto $project): void
    {
        // Cleanup logic if needed
    }
}
