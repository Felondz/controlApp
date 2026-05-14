import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { useTranslate } from '@/Hooks/useTranslate';
import { useGlobalTheme } from '@/Contexts/GlobalThemeContext';
import {
    MenuFoldIcon, MenuUnfoldIcon, FactoryIcon, PackageIcon,
    DashboardIcon, PuzzleIcon, EnvelopeIcon, CalendarIcon, CalculatorIcon,
    PersonalFinanceIcon, FolderIcon, CurrencyDollarIcon, CheckListIcon,
    ChatIcon, UserCircleIcon, EllipsisVerticalIcon, ChevronDownIcon, ChevronUpIcon,
    BugIcon, UsersIcon, ServerStackIcon
} from '@/Components/Icons';
import { useState } from 'react';
import { getThemeStyle } from '@/Utils/themeStyles';

export default function Sidebar({ user, className = '', collapsed = false, project = null, onToggle }) {
    // Force rebuild v2
    const { t } = useTranslate();
    const { is_ptr } = usePage().props;
    const { theme, isDark } = useGlobalTheme();
    const enabledTools = user?.enabled_tools || [];
    const [isOperationsOpen, setIsOperationsOpen] = useState(true); // Default open for visibility

    const renderGlobalMenu = () => (
        <>
            <ResponsiveNavLink id="tour-nav-dashboard" href={route('dashboard')} active={route().current('dashboard')} collapsed={collapsed}>
                <DashboardIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && t('dashboard.title')}
            </ResponsiveNavLink>

            <ResponsiveNavLink id="tour-nav-marketplace" href={route('tools.index')} active={route().current('tools.index')} collapsed={collapsed}>
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

            {user?.is_super_admin && (
                <>
                    {!collapsed && (
                        <div className="pt-4 pb-2">
                            <p className={`px-3 text-xs font-semibold uppercase tracking-wider text-danger-600 dark:text-danger-400`}>
                                {t('admin.title', 'Administración')}
                            </p>
                        </div>
                    )}
                    {collapsed && <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>}

                    {is_ptr && window.route && window.route().has('ptr.bug-reports.index') && (
                        <ResponsiveNavLink href={route('ptr.bug-reports.index')} active={route().current('ptr.bug-reports.*')} collapsed={collapsed}>
                            <BugIcon className={`h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400 ${collapsed ? '' : 'mr-3'}`} />
                            {!collapsed && t('bug_reporter.dashboard_title', 'Reportes de Bugs')}
                        </ResponsiveNavLink>
                    )}

                    {window.route && window.route().has('admin.users.index') && (
                        <ResponsiveNavLink href={route('admin.users.index')} active={route().current('admin.users.*')} collapsed={collapsed}>
                            <UsersIcon className={`h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400 ${collapsed ? '' : 'mr-3'}`} />
                            {!collapsed && t('admin.users_title', 'Gestión de Usuarios')}
                        </ResponsiveNavLink>
                    )}

                    {user?.is_super_admin && (
                        <ResponsiveNavLink href={route('admin.server.index')} active={route().current('admin.server.*')} collapsed={collapsed}>
                            <ServerStackIcon className={`h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400 ${collapsed ? '' : 'mr-3'}`} />
                            {!collapsed && t('admin.server_title', 'Control de Servidor')}
                        </ResponsiveNavLink>
                    )}
                </>
            )}
        </>
    );

    const renderProjectMenu = () => {
        const modules = project.modules || ['finance'];

        // Universal parameters to handle Ziggy naming inconsistencies (proyecto vs mis_proyecto vs project)
        const projectParams = {
            proyecto: project.uuid,
            mis_proyecto: project.uuid,
            project: project.uuid
        };


        // Robust Image Detection (Same as ProjectCard)
        const imageUrl = project.image_url
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
                    href={route('mis-proyectos.show', projectParams)}
                    active={route().current('mis-proyectos.show', projectParams)}
                    collapsed={collapsed}
                >
                    <FolderIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && t('projects.overview', 'Resumen General')}
                </ResponsiveNavLink>

                {modules.includes('finance') && (
                    <ResponsiveNavLink
                        id="tour-nav-finance"
                        href={route('mis-proyectos.finance', projectParams)}
                        active={route().current('mis-proyectos.finance', projectParams)}
                        collapsed={collapsed}
                    >
                        <CurrencyDollarIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && t('modules.finance', 'Finanzas')}
                    </ResponsiveNavLink>
                )}

                {modules.includes('tasks') && (
                    <ResponsiveNavLink
                        id="tour-nav-tasks"
                        href={route('mis-proyectos.tasks.index', projectParams)}
                        active={route().current('mis-proyectos.tasks.index', projectParams)}
                        collapsed={collapsed}
                    >
                        <CheckListIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && t('modules.tasks', 'Tareas')}
                    </ResponsiveNavLink>
                )}

                {/* Operations Module Link with Submenu */}
                {modules.includes('operations') && (
                    <ResponsiveNavLink
                        id="tour-nav-operations"
                        href={route('operations.lotes.index', projectParams)}
                        active={route().current('operations.lotes.*', projectParams)}
                        collapsed={collapsed}
                    >
                        <FactoryIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && <span className="truncate">{t('operations.title', 'Operaciones')}</span>}
                    </ResponsiveNavLink>
                )}

                {/* Inventory Module Link */}
                {modules.includes('inventory') && (
                    <ResponsiveNavLink
                        id="tour-nav-inventory"
                        href={route('inventory.items.index', projectParams)}
                        active={route().current('inventory.items.*', projectParams)}
                        collapsed={collapsed}
                    >
                        <PackageIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && t('inventory.title', 'Inventario')}
                    </ResponsiveNavLink>
                )}

                {modules.includes('chat') && !project.es_personal && (
                    <ResponsiveNavLink
                        href={route('mis-proyectos.chat', projectParams)}
                        active={route().current('mis-proyectos.chat', projectParams)}
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
                        href={route('project.members.index', projectParams)}
                        active={route().current('project.members.index', projectParams)}
                        collapsed={collapsed}
                    >
                        <UserCircleIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && t('projects.members', 'Miembros')}
                    </ResponsiveNavLink>
                )}

                {!project.es_personal && (
                    <ResponsiveNavLink
                        href={route('mis-proyectos.edit', projectParams)}
                        active={route().current('mis-proyectos.edit', projectParams)}
                        collapsed={collapsed}
                    >
                        <EllipsisVerticalIcon className={`h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && t('projects.project_settings', 'Configuración')}
                    </ResponsiveNavLink>
                )}

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

                {user?.is_super_admin && (
                    <>
                        {!collapsed && (
                            <div className="pt-4 pb-2">
                                <p className={`px-3 text-xs font-semibold uppercase tracking-wider text-danger-600 dark:text-danger-400`}>
                                    {t('admin.title', 'Administración')}
                                </p>
                            </div>
                        )}
                        {collapsed && <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>}

                        {is_ptr && window.route && window.route().has('ptr.bug-reports.index') && (
                            <ResponsiveNavLink href={route('ptr.bug-reports.index')} active={route().current('ptr.bug-reports.*')} collapsed={collapsed}>
                                <BugIcon className={`h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400 ${collapsed ? '' : 'mr-3'}`} />
                                {!collapsed && t('bug_reporter.dashboard_title', 'Reportes de Bugs')}
                            </ResponsiveNavLink>
                        )}

                        {window.route && window.route().has('admin.users.index') && (
                            <ResponsiveNavLink href={route('admin.users.index')} active={route().current('admin.users.*')} collapsed={collapsed}>
                                <UsersIcon className={`h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400 ${collapsed ? '' : 'mr-3'}`} />
                                {!collapsed && t('admin.users_title', 'Gestión de Usuarios')}
                            </ResponsiveNavLink>
                        )}

                        {user?.is_super_admin && (
                            <ResponsiveNavLink href={route('admin.server.index')} active={route().current('admin.server.*')} collapsed={collapsed}>
                                <ServerStackIcon className={`h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400 ${collapsed ? '' : 'mr-3'}`} />
                                {!collapsed && t('admin.server_title', 'Control de Servidor')}
                            </ResponsiveNavLink>
                        )}
                    </>
                )}
            </>
        );
    };

    return (
        <aside
            className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} ${className}`}
        >
            {/* Header: Toggle Button + Logo */}
            <div className="flex items-center h-12 shrink-0 border-b border-gray-100 dark:border-gray-700 px-2">
                {/* Toggle Button Removed from here */}

                {/* App Logo - Adaptive */}
                <div className={`w-full flex ${collapsed ? 'justify-center' : 'px-4'}`}>
                    <Link href={route('dashboard')}>
                        <ApplicationLogo className="h-8 w-auto" onlyIcon={collapsed} />
                    </Link>
                </div>
            </div>

            {/* Spacer if Project Mode and NOT collapsed (to replace Logo space) */}
            {project && !collapsed && <div className="h-6"></div>}

            {/* Navigation Links */}
            <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin">
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
