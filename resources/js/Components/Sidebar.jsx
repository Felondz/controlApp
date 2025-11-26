import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { useTranslate } from '@/Hooks/useTranslate';
import { DashboardIcon, FolderIcon, CalendarIcon, PuzzleIcon, CalculatorIcon } from '@/Components/Icons';

export default function Sidebar({ user, className = '', collapsed = false }) {
    const { t } = useTranslate();

    return (
        <aside className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} ${className}`}>
            {/* Logo Section */}
            <div className="flex items-center justify-center h-12 shrink-0 overflow-hidden">
                <Link href={route('dashboard')}>
                    <ApplicationLogo className="h-8 w-auto" onlyIcon={collapsed} />
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')} collapsed={collapsed}>
                    <DashboardIcon className={`h-5 w-5 shrink-0 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && t('dashboard.title')}
                </ResponsiveNavLink>

                {/* Placeholders for future modules */}
                {!collapsed && (
                    <div className="pt-4 pb-2">
                        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {t('dashboard.apps', 'Aplicaciones')}
                        </p>
                    </div>
                )}
                {collapsed && <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>}

                <ResponsiveNavLink as="button" disabled className="opacity-50 cursor-not-allowed" collapsed={collapsed}>
                    <CalendarIcon className={`h-5 w-5 shrink-0 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && t('dashboard.calendar', 'Calendario')}
                </ResponsiveNavLink>

                <ResponsiveNavLink as="button" disabled className="opacity-50 cursor-not-allowed" collapsed={collapsed}>
                    <CalculatorIcon className={`h-5 w-5 shrink-0 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && t('dashboard.calculator', 'Calculadora Financiera')}
                </ResponsiveNavLink>

                <ResponsiveNavLink as="button" disabled className="opacity-50 cursor-not-allowed" collapsed={collapsed}>
                    <PuzzleIcon className={`h-5 w-5 shrink-0 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && t('dashboard.marketplace', 'Mercado')}
                </ResponsiveNavLink>
            </nav>

            {/* User Profile Section Removed - Moved to Topbar */}
        </aside>
    );
}
