import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    DashboardIcon,
    PuzzleIcon,
    FolderIcon,
    CurrencyDollarIcon,
    CalculatorIcon,
    CalendarIcon
} from '@/Components/Icons';
import { useTranslate } from '@/Hooks/useTranslate';
import ToolsSheet from '@/Components/ToolsSheet';

export default function BottomNavigation({ user, project = null }) {
    const { t } = useTranslate();
    const currentRoute = route().current();
    const [showToolsSheet, setShowToolsSheet] = useState(false);
    const enabledTools = user?.enabled_tools || [];

    // Build navigation items based on context (global vs project)
    const getNavItems = () => {
        if (project) {
            // Project context navigation
            const modules = project.modules || ['finance'];
            const items = [
                {
                    name: t('dashboard.title', 'Dashboard'),
                    route: 'dashboard',
                    icon: DashboardIcon,
                },
                {
                    name: project.nombre || t('projects.project', 'Proyecto'),
                    route: 'mis-proyectos.show',
                    routeParams: project.id,
                    icon: FolderIcon,
                    matchRoutes: ['mis-proyectos.show', 'mis-proyectos.edit'],
                },
            ];

            // Add finance if module is enabled
            if (modules.includes('finance')) {
                items.push({
                    name: t('modules.finance', 'Finanzas'),
                    route: 'mis-proyectos.finance',
                    routeParams: project.id,
                    icon: CurrencyDollarIcon,
                });
            }

            return items;
        }

        // Global navigation
        return [
            {
                name: t('dashboard.title', 'Dashboard'),
                route: 'dashboard',
                icon: DashboardIcon,
            },
            {
                name: t('dashboard.marketplace', 'Mercado'),
                route: 'tools.index',
                icon: PuzzleIcon,
            },
            {
                name: t('dashboard.tools', 'Herramientas'),
                action: () => setShowToolsSheet(true),
                icon: CalculatorIcon,
            },
        ];
    };

    const navItems = getNavItems();

    return (
        <>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-inset-bottom">
                <div className={`grid h-16 ${navItems.length === 3 ? 'grid-cols-3' : navItems.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                    {navItems.map((item) => {
                        // Check if current route matches
                        const isActive = item.matchRoutes
                            ? item.matchRoutes.some(r => currentRoute === r || currentRoute?.startsWith(r))
                            : currentRoute === item.route;

                        const Icon = item.icon;

                        // Base classes using CSS variables (modern theme system)
                        const baseClasses = 'flex flex-col items-center justify-center gap-1 transition-all duration-200';
                        const activeClasses = 'text-primary-600 dark:text-primary-400';
                        const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400';
                        const disabledClasses = 'text-gray-300 dark:text-gray-600 cursor-not-allowed';

                        // If item has an action instead of route
                        if (item.action) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={item.action}
                                    className={`${baseClasses} ${inactiveClasses}`}
                                >
                                    <Icon className="h-6 w-6" />
                                    <span className="text-xs font-medium">{item.name}</span>
                                </button>
                            );
                        }

                        // Disabled items
                        if (item.disabled) {
                            return (
                                <button
                                    key={item.name}
                                    disabled
                                    className={`${baseClasses} ${disabledClasses}`}
                                >
                                    <Icon className="h-6 w-6" />
                                    <span className="text-xs font-medium">{item.name}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.routeParams ? route(item.route, item.routeParams) : route(item.route)}
                                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                            >
                                <Icon className="h-6 w-6" />
                                <span className="text-xs font-medium truncate px-1">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Tools Bottom Sheet */}
            <ToolsSheet isOpen={showToolsSheet} onClose={() => setShowToolsSheet(false)} />
        </>
    );
}
