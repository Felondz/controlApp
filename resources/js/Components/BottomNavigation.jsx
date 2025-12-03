import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    DashboardIcon,
    PuzzleIcon,
    FolderIcon,
    CurrencyDollarIcon,
    ChatIcon,
    EllipsisHorizontalIcon
} from '@/Components/Icons';
import { useTranslate } from '@/Hooks/useTranslate';
import NavigationSheet from '@/Components/NavigationSheet';

export default function BottomNavigation({ user, project = null }) {
    // Force rebuild v2
    const { t } = useTranslate();
    const currentRoute = route().current();
    const [showNavSheet, setShowNavSheet] = useState(false);

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
                    name: t('projects.overview', 'Resumen'),
                    route: 'mis-proyectos.show',
                    routeParams: project.id,
                    icon: FolderIcon,
                    matchRoutes: ['mis-proyectos.show', 'mis-proyectos.edit'],
                },
            ];

            // Smart Slot Logic (Priority: Chat > Finance)
            if (modules.includes('chat')) {
                items.push({
                    name: t('modules.chat.title', 'Chat'),
                    route: 'mis-proyectos.chat',
                    routeParams: project.id,
                    icon: ChatIcon,
                    badge: project.unread_messages_count
                });
            } else if (modules.includes('finance')) {
                items.push({
                    name: t('modules.finance', 'Finanzas'),
                    route: 'mis-proyectos.finance',
                    routeParams: project.id,
                    icon: CurrencyDollarIcon,
                });
            }

            // Menu Item (Always last)
            items.push({
                name: t('common.menu', 'Menú'),
                action: () => setShowNavSheet(true),
                icon: EllipsisHorizontalIcon,
            });

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
                name: t('common.menu', 'Menú'),
                action: () => setShowNavSheet(true),
                icon: EllipsisHorizontalIcon,
            },
        ];
    };

    const navItems = getNavItems();

    return (
        <>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-inset-bottom">
                <div className="flex flex-row h-16 w-full justify-between items-center px-2">
                    {navItems.map((item) => {
                        // Check if current route matches
                        const isActive = item.matchRoutes
                            ? item.matchRoutes.some(r => currentRoute === r || currentRoute?.startsWith(r))
                            : currentRoute === item.route;

                        const Icon = item.icon;

                        // Base classes using CSS variables (modern theme system)
                        const baseClasses = 'flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 h-full';
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
                                    aria-label={item.name}
                                >
                                    <Icon className="h-7 w-7" />
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
                                    aria-label={item.name}
                                >
                                    <Icon className="h-7 w-7" />
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.routeParams ? route(item.route, item.routeParams) : route(item.route)}
                                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                                aria-label={item.name}
                            >
                                <div className="relative">
                                    <Icon className="h-7 w-7" />
                                    {item.badge > 0 && (
                                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none">
                                            {item.badge > 99 ? '99+' : item.badge}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Navigation Sheet */}
            <NavigationSheet
                isOpen={showNavSheet}
                onClose={() => setShowNavSheet(false)}
                user={user}
                project={project}
            />
        </>
    );
}
