<?php

namespace App\Core\Templates;

use App\Core\Templates\Contracts\ProjectTemplate;
use App\Models\Proyecto;

/**
 * CustomTemplate
 * 
 * Empty template for custom configuration.
 */
class CustomTemplate implements ProjectTemplate
{
    public function getId(): string
    {
        return 'custom';
    }

    public function getName(): string
    {
        return 'Custom';
    }

    public function getDescription(): string
    {
        return 'Build your own configuration from scratch. Select modules manually.';
    }

    public function getIcon(): string
    {
        return '⚙️';
    }

    public function getModules(): array
    {
        return [];
    }

    public function getModuleConfigurations(): array
    {
        return [];
    }

    public function getDefaultSettings(): array
    {
        return [
            'theme' => 'gray-minimal',
            'typography' => 'sans',
            'moneda_default' => 'USD',
        ];
    }

    public function apply(Proyecto $project): void
    {
        $project->update([
            'modules' => [],
            'theme' => $this->getDefaultSettings()['theme'],
            'typography' => $this->getDefaultSettings()['typography'],
            'moneda_default' => $this->getDefaultSettings()['moneda_default'],
            'settings' => [],
        ]);
    }

    public function getWizardSteps(): array
    {
        return [];
    }

    public function matches(array $requirements): bool
    {
        return false;
    }
}
