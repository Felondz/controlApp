<?php

namespace App\Core\Templates;

use App\Core\Templates\Contracts\ProjectTemplate;
use App\Models\Proyecto;

/**
 * FreelancerTemplate
 * 
 * Pre-configured template for freelancers.
 * Includes Finance and Tasks modules with sensible defaults.
 */
class FreelancerTemplate implements ProjectTemplate
{
    /**
     * {@inheritdoc}
     */
    public function getId(): string
    {
        return 'freelancer';
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'Freelancer';
    }

    /**
     * {@inheritdoc}
     */
    public function getDescription(): string
    {
        return 'Perfect for freelancers managing clients and finances. Includes financial tracking and task management.';
    }

    /**
     * {@inheritdoc}
     */
    public function getIcon(): string
    {
        return '💼';
    }

    /**
     * {@inheritdoc}
     */
    public function getModules(): array
    {
        return ['finance', 'tasks'];
    }

    /**
     * {@inheritdoc}
     */
    public function getModuleConfigurations(): array
    {
        return [
            'finance' => [
                'widgets' => [
                    'balance_summary' => true,
                    'upcoming_obligations' => true,
                    'recent_transactions' => true,
                    'financial_charts' => false, // Disabled for simplicity
                ],
                'default_currency' => 'USD',
                'enable_budgets' => true,
            ],
            'tasks' => [
                'enable_financial_tasks' => true,
                'default_view' => 'kanban',
                'enable_priorities' => true,
                'enable_due_dates' => true,
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getDefaultSettings(): array
    {
        return [
            'theme' => 'purple-modern',
            'typography' => 'sans',
            'moneda_default' => 'USD',
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function apply(Proyecto $project): void
    {
        // Update project with template settings
        $project->update([
            'modules' => $this->getModules(),
            'theme' => $this->getDefaultSettings()['theme'],
            'typography' => $this->getDefaultSettings()['typography'],
            'moneda_default' => $this->getDefaultSettings()['moneda_default'],
            'settings' => [
                'modules' => $this->getModuleConfigurations(),
            ],
        ]);

        // Install modules
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
     * {@inheritdoc}
     */
    public function getWizardSteps(): array
    {
        return [
            [
                'id' => 'currency',
                'title' => 'Select Currency',
                'description' => 'Choose your default currency for financial tracking',
                'fields' => [
                    [
                        'name' => 'moneda_default',
                        'label' => 'Currency',
                        'type' => 'select',
                        'required' => true,
                        'options' => [
                            ['value' => 'USD', 'label' => 'US Dollar (USD)'],
                            ['value' => 'EUR', 'label' => 'Euro (EUR)'],
                            ['value' => 'GBP', 'label' => 'British Pound (GBP)'],
                            ['value' => 'COP', 'label' => 'Colombian Peso (COP)'],
                        ],
                        'default' => 'USD',
                    ],
                ],
            ],
            [
                'id' => 'theme',
                'title' => 'Choose Theme',
                'description' => 'Select a color theme for your project',
                'fields' => [
                    [
                        'name' => 'theme',
                        'label' => 'Theme',
                        'type' => 'theme-selector',
                        'required' => true,
                        'default' => 'purple-modern',
                    ],
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function matches(array $requirements): bool
    {
        // Check if requirements match this template
        $keywords = ['freelance', 'solo', 'individual', 'client', 'invoice'];

        $description = strtolower($requirements['description'] ?? '');

        foreach ($keywords as $keyword) {
            if (str_contains($description, $keyword)) {
                return true;
            }
        }

        return false;
    }
}
