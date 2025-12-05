import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { useTranslate } from '@/Hooks/useTranslate';
import { useGlobalTheme } from '@/Contexts/GlobalThemeContext';
import {
    DashboardIcon, FolderIcon, PuzzleIcon, CalendarIcon, CalculatorIcon,
    CurrencyDollarIcon, CheckListIcon, UserCircleIcon, EllipsisVerticalIcon, PersonalFinanceIcon, ChatIcon, EnvelopeIcon
} from '@/Components/Icons';
import { getThemeStyle } from '@/Utils/themeStyles';

export default function Sidebar({ user, className = '', collapsed = false, project = null }) {
    // Force rebuild v2
    const { t } = useTranslate();
    const { theme, isDark } = useGlobalTheme();
    const enabledTools = user?.enabled_tools || [];

    const renderGlobalMenu = () => (
        <>
            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')} collapsed={collapsed}>
                <DashboardIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && t('dashboard.title')}
            </ResponsiveNavLink>

            <ResponsiveNavLink href={route('tools.index')} active={route().current('tools.index')} collapsed={collapsed}>
                <PuzzleIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && t('dashboard.marketplace', 'Mercado')}
            </ResponsiveNavLink>

            <ResponsiveNavLink href={route('invitations.index')} active={route().current('invitations.index')} collapsed={collapsed}>
                <EnvelopeIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && t('invitations.title', 'Invitaciones')}
            </ResponsiveNavLink>

            {!collapsed && (
                <div className="pt-4 pb-2">
                    <p className={`px-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('dashboard.tools', 'Herramientas')}
                    </p>
                </div>
            )}
            {collapsed && <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>}

            {enabledTools.includes('calendar') && (
                <ResponsiveNavLink as="button" disabled className="opacity-50 cursor-not-allowed" collapsed={collapsed}>
                    <CalendarIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && t('dashboard.calendar', 'Calendario')}
                </ResponsiveNavLink>
            )}

            {enabledTools.includes('financial-calculator') && (
                <ResponsiveNavLink href={route('tools.calculator')} active={route().current('tools.calculator')} collapsed={collapsed}>
                    <CalculatorIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && t('dashboard.calculator', 'Calculadora Financiera')}
                </ResponsiveNavLink>
            )}
        </>
    );

    const renderProjectMenu = () => {
        const modules = project.modules || ['finance'];


        // Robust Image Detection (Same as ProjectCard)
        const imageUrl = project.image_url
            || project.imagen
            || (project.image_path ? `/storage/${project.image_path}` : null)
            || (project.icon && (project.icon.startsWith('http') || project.icon.startsWith('/')) ? project.icon : null);

        return (
            <>
                {/* Project Header */}
                <div className="px-4 mb-6 flex justify-center">
                    <div className="p-1 rounded-full border-2 border-primary-500/50">
                        <div className="shrink-0 h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={project.nombre}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                project.es_personal ? (
                                    <span className="text-3xl text-primary-600 dark:text-primary-400">
                                        <PersonalFinanceIcon className="h-8 w-8" />
                                    </span>
                                ) : (
                                    <span className="text-3xl text-primary-600 dark:text-primary-400">
                                        {/* Fallback Icon Logic */}
                                        {(() => {
                                            const IconComponent = {
                                                'folder': FolderIcon,
                                                'puzzle': PuzzleIcon,
                                                'calendar': CalendarIcon,
                                                'calculator': CalculatorIcon,
                                                'finance': CurrencyDollarIcon,
                                                'tasks': CheckListIcon,
                                            }[project.icon] || FolderIcon;
                                            return <IconComponent className="h-8 w-8" />;
                                        })()}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Project Links - Both personal and regular projects use same route */}
                <ResponsiveNavLink
                    href={route('mis-proyectos.show', project.id)}
                    active={route().current('mis-proyectos.show', project.id)}
                    collapsed={collapsed}
                >
                    <FolderIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && t('projects.overview', 'Resumen General')}
                </ResponsiveNavLink>

                {modules.includes('finance') && (
                    <ResponsiveNavLink
                        href={route('mis-proyectos.finance', project.id)}
                        active={route().current('mis-proyectos.finance', project.id)}
                        collapsed={collapsed}
                    >
                        <CurrencyDollarIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && t('modules.finance', 'Finanzas')}
                    </ResponsiveNavLink>
                )}

                {modules.includes('tasks') && (
                    <ResponsiveNavLink
                        as="button"
                        disabled // TODO: Implement route
                        className="opacity-50 cursor-not-allowed"
                        collapsed={collapsed}
                    >
                        <CheckListIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && t('modules.tasks', 'Tareas')}
                    </ResponsiveNavLink>
                )}

                {modules.includes('chat') && !project.es_personal && (
                    <ResponsiveNavLink
                        href={route('mis-proyectos.chat', project.id)}
                        active={route().current('mis-proyectos.chat', project.id)}
                        collapsed={collapsed}
                    >
                        <div className={`relative shrink-0 ${collapsed ? '' : 'mr-3'}`}>
                            <ChatIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            {project.unread_messages_count > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                    {project.unread_messages_count > 99 ? '99+' : project.unread_messages_count}
                                </span>
                            )}
                        </div>
                        {!collapsed && t('modules.chat.title', 'Chat de Equipo')}
                    </ResponsiveNavLink>
                )}

                {(!project.es_personal && project.es_personal !== 1) && (
                    <ResponsiveNavLink
                        href={route('project.members.index', project.id)}
                        active={route().current('project.members.index', project.id)}
                        collapsed={collapsed}
                    >
                        <UserCircleIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && t('projects.members', 'Miembros')}
                    </ResponsiveNavLink>
                )}

                <ResponsiveNavLink
                    href={route('mis-proyectos.edit', project.id)}
                    active={route().current('mis-proyectos.edit', project.id)}
                    collapsed={collapsed}
                >
                    <EllipsisVerticalIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && t('projects.project_settings', 'Configuración')}
                </ResponsiveNavLink>

                {/* Global Tools Section (Accessible from Project) */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-4 opacity-50"></div>

                <ResponsiveNavLink href={route('tools.index')} active={route().current('tools.index')} collapsed={collapsed}>
                    <PuzzleIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && t('dashboard.marketplace', 'Mercado')}
                </ResponsiveNavLink>

                {!collapsed && (
                    <div className="pt-4 pb-2">
                        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                            {t('dashboard.tools', 'Herramientas')}
                        </p>
                    </div>
                )}
                {collapsed && <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>}

                {enabledTools.includes('calendar') && (
                    <ResponsiveNavLink as="button" disabled className="opacity-50 cursor-not-allowed" collapsed={collapsed}>
                        <CalendarIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && t('dashboard.calendar', 'Calendario')}
                    </ResponsiveNavLink>
                )}

                {enabledTools.includes('financial-calculator') && (
                    <ResponsiveNavLink href={route('tools.calculator')} active={route().current('tools.calculator')} collapsed={collapsed}>
                        <CalculatorIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && t('dashboard.calculator', 'Calculadora Financiera')}
                    </ResponsiveNavLink>
                )}
            </>
        );
    };

    return (
        <aside
            className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} ${className}`}
        >
            {/* Logo Section - Only show if NO project (Global Mode) */}
            {!project && (
                <div className="flex items-center justify-center h-12 shrink-0 overflow-hidden">
                    <Link href={route('dashboard')}>
                        <ApplicationLogo className="h-8 w-auto" onlyIcon={collapsed} />
                    </Link>
                </div>
            )}

            {/* Spacer if Project Mode and NOT collapsed (to replace Logo space) */}
            {project && !collapsed && <div className="h-6"></div>}

            {/* Navigation Links */}
            <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto scrollbar-thin">
                {project ? renderProjectMenu() : renderGlobalMenu()}
            </nav>

            {/* Back to Dashboard Link (Bottom) */}
            {
                project && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0 flex justify-center">
                        <Link
                            href={route('dashboard')}
                            className="flex items-center justify-center p-3 rounded-lg transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 group"
                            style={getThemeStyle(theme)}
                            title={t('dashboard.title', 'Volver al Dashboard')}
                        >
                            <DashboardIcon className="w-6 h-6 text-primary-600 dark:text-primary-400 transition-colors" />
                        </Link>
                    </div>
                )
            }
        </aside >
    );
}
