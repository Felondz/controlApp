<?php

namespace App\Modules\Tasks;

use App\Core\Modules\AbstractModule;
use App\Models\Proyecto;

/**
 * TasksModule
 * 
 * Task management module with Kanban board and financial task integration.
 */
class TasksModule extends AbstractModule
{
    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'tasks';
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
        return []; // Optional dependency on finance for financial tasks
    }

    /**
     * {@inheritdoc}
     */
    public function getCapabilities(): array
    {
        return [
            'provides' => [
                'task_management',
                'kanban_board',
                'financial_tasks',
                'task_assignments',
            ],
            'consumes' => [
                'finance.transactions', // For payment confirmation
            ],
            'exposes' => [
                'api' => [
                    '/api/proyectos/{proyecto}/tasks',
                ],
                'events' => [
                    'tasks.task.created',
                    'tasks.task.updated',
                    'tasks.task.completed',
                    'tasks.task.assigned',
                    'tasks.financial_task.created',
                    'tasks.financial_task.paid',
                ],
                'widgets' => [
                    'TasksWidget',
                    'KanbanBoard',
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getRoutes(): array
    {
        // Routes are still managed in routes/api.php
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getEventListeners(): array
    {
        return [
            'finance.transaction.created' => [
                [\App\Modules\Tasks\Listeners\FinanceEventListener::class, 'handleTransactionCreated'],
            ],
            'operations.lote.stage_changed' => [
                \App\Modules\Tasks\Listeners\GenerateStageTasks::class,
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
        // No special installation needed for tasks
        // Tasks are created on-demand by users
    }

    /**
     * Hook called when module is uninstalled.
     *
     * @param Proyecto $project
     * @return void
     */
    protected function onUninstall(Proyecto $project): void
    {
        // Don't delete tasks, just disable module
        // Historical task data is important
    }
}
