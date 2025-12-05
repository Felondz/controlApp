<?php

namespace App\Modules\Analytics;

use App\Core\Modules\AbstractModule;
use App\Models\Proyecto;

/**
 * AnalyticsModule
 * 
 * Analytics and insights module that listens to all events and generates metrics.
 */
class AnalyticsModule extends AbstractModule
{
    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'analytics';
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
                'metrics_collection',
                'insights_generation',
                'reports',
                'analytics_dashboard',
            ],
            'consumes' => [
                'finance.*',
                'tasks.*',
                'chat.*',
            ],
            'exposes' => [
                'api' => [
                    '/api/proyectos/{proyecto}/analytics/metrics',
                    '/api/proyectos/{proyecto}/analytics/insights',
                    '/api/proyectos/{proyecto}/analytics/reports',
                ],
                'widgets' => [
                    'AnalyticsDashboard',
                    'MetricsChart',
                    'InsightsSummary',
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
            // Finance events - use wildcard to catch all
            'finance.transaction.*' => [
                [\App\Modules\Analytics\Listeners\FinanceEventListener::class, 'handleFinanceEvent'],
            ],

            // Tasks events
            'tasks.task.*' => [
                [\App\Modules\Analytics\Listeners\TaskEventListener::class, 'handleTaskEvent'],
            ],

            // Chat events
            'chat.message.*' => [
                [\App\Modules\Analytics\Listeners\ChatEventListener::class, 'handleChatEvent'],
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
        // Initialize analytics for the project
        // Create baseline metrics if needed
    }

    /**
     * Hook called when module is uninstalled.
     *
     * @param Proyecto $project
     * @return void
     */
    protected function onUninstall(Proyecto $project): void
    {
        // Don't delete metrics, just disable collection
        // Historical data is valuable
    }
}
