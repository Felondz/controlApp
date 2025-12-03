<?php

namespace App\Core\Templates;

use App\Core\Templates\Contracts\ProjectTemplate;
use App\Models\Proyecto;

/**
 * EnterpriseTemplate
 * 
 * Full-featured template for large organizations.
 * Includes all available modules.
 */
class EnterpriseTemplate implements ProjectTemplate
{
    public function getId(): string
    {
        return 'enterprise';
    }

    public function getName(): string
    {
        return 'Enterprise';
    }

    public function getDescription(): string
    {
        return 'Full-featured setup for large organizations. Includes all modules and advanced analytics.';
    }

    public function getIcon(): string
    {
        return '🏢';
    }

    public function getModules(): array
    {
        return ['finance', 'tasks', 'chat', 'analytics', 'notifications', 'marketplace'];
    }

    public function getModuleConfigurations(): array
    {
        return [
            'finance' => ['enable_budgets' => true, 'enable_audit' => true],
            'tasks' => ['enable_financial_tasks' => true, 'default_view' => 'list'],
            'chat' => ['enable_private_chat' => true, 'enable_group_chat' => true, 'retention' => 365],
            'analytics' => ['async_processing' => true],
            'notifications' => ['channels' => ['database', 'mail']],
        ];
    }

    public function getDefaultSettings(): array
    {
        return [
            'theme' => 'slate-corporate',
            'typography' => 'serif',
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
        return [];
    }

    public function matches(array $requirements): bool
    {
        $keywords = ['enterprise', 'corp', 'large', 'organization', 'full'];
        $description = strtolower($requirements['description'] ?? '');

        foreach ($keywords as $keyword) {
            if (str_contains($description, $keyword)) {
                return true;
            }
        }

        return false;
    }
}
