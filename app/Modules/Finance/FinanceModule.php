<?php

namespace App\Modules\Finance;

use App\Core\Modules\AbstractModule;
use App\Models\Proyecto;

/**
 * FinanceModule
 * 
 * Financial management module providing accounts, transactions, categories, and budgets.
 */
class FinanceModule extends AbstractModule
{
    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'finance';
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
        return []; // No dependencies
    }

    /**
     * {@inheritdoc}
     */
    public function getCapabilities(): array
    {
        return [
            'provides' => [
                'transactions',
                'accounts',
                'categories',
                'budgets',
                'financial_reports',
            ],
            'consumes' => [],
            'exposes' => [
                'api' => [
                    '/api/proyectos/{proyecto}/transacciones',
                    '/api/proyectos/{proyecto}/cuentas',
                    '/api/proyectos/{proyecto}/categorias',
                ],
                'events' => [
                    'finance.transaction.created',
                    'finance.transaction.updated',
                    'finance.transaction.deleted',
                    'finance.account.created',
                    'finance.account.balance_low',
                    'finance.budget.exceeded',
                ],
                'widgets' => [
                    'BalanceSummary',
                    'UpcomingObligations',
                    'RecentTransactions',
                    'FinancialCharts',
                    'AccountChart',
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getRoutes(): array
    {
        // Routes are still managed in routes/api.php for now
        // Future: Can be moved here for full module encapsulation
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getEventListeners(): array
    {
        return [];
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
        // Create default categories if needed
        $this->createDefaultCategories($project);

        // Create default account if needed
        $this->createDefaultAccount($project, $config);
    }

    /**
     * Hook called when module is uninstalled.
     *
     * @param Proyecto $project
     * @return void
     */
    protected function onUninstall(Proyecto $project): void
    {
        // Don't delete financial data, just disable module
        // Data preservation is important for historical records
    }

    /**
     * Create default categories for a project.
     *
     * @param Proyecto $project
     * @return void
     */
    private function createDefaultCategories(Proyecto $project): void
    {
        $defaultCategories = [
            ['nombre' => 'Alimentación', 'color' => '#FF6B6B', 'icono' => '🍔'],
            ['nombre' => 'Transporte', 'color' => '#4ECDC4', 'icono' => '🚗'],
            ['nombre' => 'Servicios', 'color' => '#45B7D1', 'icono' => '💡'],
            ['nombre' => 'Salud', 'color' => '#96CEB4', 'icono' => '⚕️'],
            ['nombre' => 'Entretenimiento', 'color' => '#FFEAA7', 'icono' => '🎬'],
            ['nombre' => 'Educación', 'color' => '#A29BFE', 'icono' => '📚'],
            ['nombre' => 'Hogar', 'color' => '#FD79A8', 'icono' => '🏠'],
            ['nombre' => 'Otros', 'color' => '#DFE6E9', 'icono' => '📦'],
        ];

        foreach ($defaultCategories as $category) {
            $project->categorias()->firstOrCreate(
                ['nombre' => $category['nombre']],
                $category
            );
        }
    }

    /**
     * Create default account for a project.
     *
     * @param Proyecto $project
     * @param array $config
     * @return void
     */
    private function createDefaultAccount(Proyecto $project, array $config): void
    {
        if ($project->cuentas()->count() === 0) {
            $project->cuentas()->create([
                'nombre' => $config['account_name'] ?? 'Cuenta Principal',
                'tipo' => $config['account_type'] ?? 'banco',
                'saldo_inicial' => $config['initial_balance'] ?? 0,
                'color' => $config['account_color'] ?? '#6C5CE7',
                'estado' => 'activa',
            ]);
        }
    }
}
