<?php

namespace App\Core\Templates\Contracts;

use App\Models\Proyecto;

/**
 * Interface ProjectTemplate
 * 
 * Defines the contract for project templates.
 * Templates provide pre-configured module setups for common use cases.
 */
interface ProjectTemplate
{
    /**
     * Get the template identifier.
     *
     * @return string Template ID (e.g., 'freelancer', 'startup', 'enterprise')
     */
    public function getId(): string;

    /**
     * Get the template display name.
     *
     * @return string Human-readable name
     */
    public function getName(): string;

    /**
     * Get the template description.
     *
     * @return string
     */
    public function getDescription(): string;

    /**
     * Get the icon/emoji for this template.
     *
     * @return string
     */
    public function getIcon(): string;

    /**
     * Get the list of modules included in this template.
     *
     * @return array<string> Module names
     */
    public function getModules(): array;

    /**
     * Get the default configuration for each module.
     *
     * @return array<string, array> Module name => Configuration
     */
    public function getModuleConfigurations(): array;

    /**
     * Get the default project settings for this template.
     *
     * @return array{
     *     theme?: string,
     *     typography?: string,
     *     moneda_default?: string,
     *     widgets?: array<string, bool>
     * }
     */
    public function getDefaultSettings(): array;

    /**
     * Apply this template to a project.
     *
     * @param Proyecto $project
     * @return void
     */
    public function apply(Proyecto $project): void;

    /**
     * Get the wizard steps for this template (if any).
     *
     * @return array<array{
     *     id: string,
     *     title: string,
     *     description: string,
     *     fields: array
     * }>
     */
    public function getWizardSteps(): array;

    /**
     * Check if this template is suitable for a given use case.
     *
     * @param array $requirements User requirements
     * @return bool
     */
    public function matches(array $requirements): bool;
}
