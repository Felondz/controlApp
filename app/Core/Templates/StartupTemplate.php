<?php

namespace App\Core\Templates;

use App\Core\Templates\Contracts\ProjectTemplate;
use App\Models\Proyecto;

/**
 * StartupTemplate
 * 
 * Pre-configured template for startups.
 * Includes Finance, Tasks, and Chat modules.
 */
class StartupTemplate implements ProjectTemplate
{
    public function getId(): string
    {
        return 'startup';
    }

    public function getName(): string
    {
        return 'Startup';
    }

    public function getDescription(): string
    {
        return 'Ideal for small teams building products. Includes finance, tasks, and real-time chat.';
    }

    public function getIcon(): string
    {
        return '🚀';
    }

    public function getModules(): array
    {
        return ['finance', 'tasks', 'chat'];
    }

    public function getModuleConfigurations(): array
    {
        return [
            'finance' => [
                'default_currency' => 'USD',
                'enable_budgets' => true,
            ],
            'tasks' => [
                'enable_financial_tasks' => true,
                'default_view' => 'kanban',
            ],
            'chat' => [
                'enable_private_chat' => true,
                'enable_group_chat' => true,
            ],
        ];
    }

    public function getDefaultSettings(): array
    {
        return [
            'theme' => 'blue-modern',
            'typography' => 'sans',
            'moneda_default' => 'USD',
        ];
    }

    public function apply(Proyecto $project): void
    {
        $project->update([
            'modules' => $this->getModules(),
            'theme' => $this->getDefaultSettings()['theme'],
            'typography' => $this->getDefaultSettings()['typography'],
            'moneda_default' => $this->getDefaultSettings()['moneda_default'],
            'settings' => [
                'modules' => $this->getModuleConfigurations(),
            ],
        ]);

        $registry = app(\App\Core\Modules\ModuleRegistry::class);

        foreach ($this->getModules() as $moduleName) {
            $module = $registry->get($moduleName);
            if ($module) {
                $config = $this->getModuleConfigurations()[$moduleName] ?? [];
                $module->install($project, $config);
            }
        }
    }

    public function getWizardSteps(): array
    {
        return [
            [
                'id' => 'currency',
                'title' => 'Select Currency',
                'description' => 'Choose your default currency',
                'fields' => [
                    [
                        'name' => 'moneda_default',
                        'label' => 'Currency',
                        'type' => 'select',
                        'required' => true,
                        'options' => [
                            ['value' => 'USD', 'label' => 'US Dollar (USD)'],
                            ['value' => 'EUR', 'label' => 'Euro (EUR)'],
                        ],
                        'default' => 'USD',
                    ],
                ],
            ],
        ];
    }

    public function matches(array $requirements): bool
    {
        $keywords = ['startup', 'team', 'product', 'saas', 'collaboration'];
        $description = strtolower($requirements['description'] ?? '');

        foreach ($keywords as $keyword) {
            if (str_contains($description, $keyword)) {
                return true;
            }
        }

        return false;
    }
}
