import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { DashboardIcon, PuzzleIcon, CalculatorIcon } from '@/Components/Icons';
import { useTranslate } from '@/Hooks/useTranslate';
import ToolsSheet from '@/Components/ToolsSheet';
import { getBottomNavClasses } from '@/Utils/navStyles';
import { useGlobalTheme } from '@/Contexts/GlobalThemeContext';

export default function BottomNavigation() {
    const { t } = useTranslate();
    const { theme, isDark } = useGlobalTheme();
    const currentRoute = route().current();
    const [showToolsSheet, setShowToolsSheet] = useState(false);

    const navItems = [
        {
            name: t('dashboard.title', 'Dashboard'),
            route: 'dashboard',
            icon: DashboardIcon,
        },
        {
            name: t('dashboard.marketplace', 'Mercado'),
            route: 'dashboard', // TODO: Change to marketplace when implemented
            icon: PuzzleIcon,
            disabled: true,
        },
        {
            name: t('dashboard.tools', 'Herramientas'),
            action: () => setShowToolsSheet(true),
            icon: CalculatorIcon,
        },
    ];

    return (
        <>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-inset-bottom">
                <div className="grid grid-cols-3 h-16">
                    {navItems.map((item) => {
                        const isActive = currentRoute === item.route;
                        const Icon = item.icon;

                        // If item has an action instead of route
                        if (item.action) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={item.action}
                                    className={getBottomNavClasses(theme, isDark, false, false, true)}
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
                                    className={getBottomNavClasses(theme, isDark, false, true, false)}
                                >
                                    <Icon className="h-6 w-6" />
                                    <span className="text-xs font-medium">{item.name}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={route(item.route)}
                                className={getBottomNavClasses(theme, isDark, isActive, false, false)}
                            >
                                <Icon className="h-6 w-6" />
                                <span className="text-xs font-medium">{item.name}</span>
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
