<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Module Registry
    |--------------------------------------------------------------------------
    |
    | This configuration defines all available modules in the system.
    | Modules are self-contained features that can be enabled/disabled
    | per project.
    |
    */

    'registry' => [
        'finance' => [
            'class' => \App\Modules\Finance\FinanceModule::class,
            'enabled' => true,
            'version' => '1.0.0',
            'description' => 'Financial management module with accounts, transactions, categories, and budgets',
        ],
        'tasks' => [
            'class' => \App\Modules\Tasks\TasksModule::class,
            'enabled' => true,
            'version' => '1.0.0',
            'description' => 'Task management with Kanban board and financial task integration',
        ],
        'chat' => [
            'class' => \App\Modules\Chat\ChatModule::class,
            'enabled' => true,
            'version' => '1.0.0',
            'description' => 'Real-time messaging and collaboration',
        ],
        // NOTE: 'analytics' and 'notifications' modules are legacy and have been removed.
        // These modules are no longer supported and should not be enabled for new projects.
    ],

    /*
    |--------------------------------------------------------------------------
    | Project Templates
    |--------------------------------------------------------------------------
    |
    | Pre-configured templates for common project types.
    | Each template defines a set of modules and default configurations.
    |
    */

    'templates' => [
        'freelancer' => [
            'class' => \App\Core\Templates\FreelancerTemplate::class,
            'name' => 'Freelancer',
            'description' => 'Perfect for freelancers managing clients and finances',
            'icon' => '💼',
            'modules' => ['finance', 'tasks'],
        ],
        'startup' => [
            'class' => \App\Core\Templates\StartupTemplate::class,
            'name' => 'Startup',
            'description' => 'Ideal for small teams building products',
            'icon' => '🚀',
            'modules' => ['finance', 'tasks', 'chat'],
        ],
        'enterprise' => [
            'class' => \App\Core\Templates\EnterpriseTemplate::class,
            'name' => 'Enterprise',
            'description' => 'Full-featured setup for large organizations',
            'icon' => '🏢',
            'modules' => ['finance', 'tasks', 'chat'],
        ],
        'custom' => [
            'class' => \App\Core\Templates\CustomTemplate::class,
            'name' => 'Custom',
            'description' => 'Build your own configuration from scratch',
            'icon' => '⚙️',
            'modules' => [],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Module Event Bus
    |--------------------------------------------------------------------------
    |
    | Configuration for the event bus that handles inter-module communication.
    |
    */

    'event_bus' => [
        'enabled' => true,
        'log_events' => env('MODULE_EVENT_LOG', false),
        'async' => env('MODULE_EVENT_ASYNC', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Module Discovery
    |--------------------------------------------------------------------------
    |
    | Paths where modules can be discovered automatically.
    |
    */

    'discovery' => [
        'paths' => [
            app_path('Modules'),
        ],
        'cache' => storage_path('framework/cache/modules.php'),
    ],
];
