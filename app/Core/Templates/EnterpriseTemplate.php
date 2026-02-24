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
        return 'Full-featured setup for large organizations. Includes all modules.';
    }

    public function getIcon(): string
    {
        return '🏢';
    }

    public function getModules(): array
    {
        return ['finance', 'tasks', 'chat', 'inventory', 'operations'];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function getModuleConfigurations(): array
    {
        return [
            'finance' => ['enable_budgets' => true, 'enable_audit' => true],
            'tasks' => ['enable_financial_tasks' => true, 'default_view' => 'list'],
            'chat' => ['enable_private_chat' => true, 'enable_group_chat' => true, 'retention' => 365],
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
        $settings = $this->getDefaultSettings();

        $project->update([
            'modules' => $this->getModules(),
            'theme' => $settings['theme'] ?? 'slate-corporate',
            'typography' => $settings['typography'] ?? 'serif',
            'moneda_default' => $settings['moneda_default'] ?? 'USD',
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

    /**
     * @return array<int, mixed>
     */
    public function getWizardSteps(): array
    {
        return [];
    }

    /**
     * @param array<string, mixed> $requirements
     */
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
