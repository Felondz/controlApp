<?php

namespace App\Modules\Notifications;

use App\Core\Modules\AbstractModule;
use App\Models\Proyecto;

/**
 * NotificationsModule
 * 
 * Multi-channel notification system that listens to important events.
 */
class NotificationsModule extends AbstractModule
{
    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'notifications';
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
        return []; // No dependencies - passive module
    }

    /**
     * {@inheritdoc}
     */
    public function getCapabilities(): array
    {
        return [
            'provides' => [
                'in_app_notifications',
                'email_notifications',
                'notification_preferences',
            ],
            'consumes' => [
                'finance.transaction.created',
                'finance.account.balance_low',
                'tasks.task.created',
                'tasks.task.completed',
                'tasks.financial_task.created',
                'chat.message.sent',
            ],
            'exposes' => [
                'api' => [
                    '/api/notifications',
                    '/api/notifications/{id}/read',
                    '/api/notifications/preferences',
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getRoutes(): array
    {
        // Routes managed in routes/api.php
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getEventListeners(): array
    {
        return [
            'finance.transaction.created' => [
                [\App\Modules\Notifications\Listeners\FinanceEventListener::class, 'handleTransactionCreated'],
            ],
            'finance.account.balance_low' => [
                [\App\Modules\Notifications\Listeners\FinanceEventListener::class, 'handleBalanceLow'],
            ],
            'tasks.task.created' => [
                [\App\Modules\Notifications\Listeners\TaskEventListener::class, 'handleTaskCreated'],
            ],
            'tasks.task.completed' => [
                [\App\Modules\Notifications\Listeners\TaskEventListener::class, 'handleTaskCompleted'],
            ],
            'tasks.financial_task.created' => [
                [\App\Modules\Notifications\Listeners\TaskEventListener::class, 'handleFinancialTaskCreated'],
            ],
            'chat.message.sent' => [
                [\App\Modules\Notifications\Listeners\ChatEventListener::class, 'handleMessageSent'],
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
        // No special installation needed
    }

    /**
     * Hook called when module is uninstalled.
     *
     * @param Proyecto $project
     * @return void
     */
    protected function onUninstall(Proyecto $project): void
    {
        // Don't delete notifications, just disable module
    }
}
