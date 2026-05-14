import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { MenuFoldIcon, MenuUnfoldIcon, IconES, IconEN, UserCircleIcon, ArrowLeftIcon, InboxIcon, FolderIcon, BugIcon, EnvelopeIcon } from '@/Components/Icons';
import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';
import SearchInput from '@/Components/SearchInput';
import { Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { useInactivityTimeout } from '@/Hooks/useInactivityTimeout';
import SessionExpiredModal from '@/Components/SessionExpiredModal';
import BottomNavigation from '@/Components/BottomNavigation';
import AiChatWidget from '@/Components/AiChatWidget';
import BugReporterWidget from '@/Components/BugReporterWidget';
import PtrBanner from '@/Components/PtrBanner';
import { useGlobalTheme } from '@/Contexts/GlobalThemeContext';
import { getThemeStyle } from '@/Utils/themeStyles';
import Toast from '@/Components/Toast';

export default function AuthenticatedLayout({ header, children, projectTheme = null, project = null, showBackButton = true }) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    // Watch for flash messages
    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
        } else if (flash?.error) {
            setToast({ message: flash.error, type: 'error' });
        } else if (flash?.status) {
            setToast({ message: flash.status, type: 'info' });
        }
    }, [flash]);

    return (
        <>
            <LayoutContent user={user} header={header} projectTheme={projectTheme} project={project} showBackButton={showBackButton}>{children}</LayoutContent>
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </>
    );
}

function LayoutContent({ user, header, children, projectTheme, project, showBackButton }) {
    const { t } = useTranslate();
    const { is_ptr } = usePage().props;
    const isSuperAdmin = user?.is_super_admin ?? false;
    const { theme, isDark, setThemeLocal } = useGlobalTheme();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showSessionExpired, setShowSessionExpired] = useState(false);
    const [bugModalOpen, setBugModalOpen] = useState(false);
    const [bugCount, setBugCount] = useState(0);

    // Sync project theme
    useEffect(() => {
        if (project?.es_personal) {
            // Personal Finance ALWAYS uses Global Theme
            setThemeLocal(user.global_theme);
        } else if (projectTheme) {
            setThemeLocal(projectTheme);
        } else if (project?.theme) {
            setThemeLocal(project.theme);
        } else if (user.global_theme) {
            setThemeLocal(user.global_theme);
        }
    }, [projectTheme, project, user.global_theme, setThemeLocal]);

    // Fetch bug count for super admins
    useEffect(() => {
        if (!is_ptr || !isSuperAdmin) return;
        import('axios').then(axios => {
            axios.default.get('/ptr/bug-reports/stats').then(r => setBugCount(r.data.open_count || 0)).catch(() => { });
        });
    }, [is_ptr, isSuperAdmin]);

    // Auto-logout on inactivity (30 minutes)
    useInactivityTimeout(30 * 60 * 1000, () => {
        setShowSessionExpired(true);
    });


    // Helper function for user roles
    const hasRole = (role) => {
        return user?.role === role;
    };

    const hasActiveAi = user?.has_active_ai || false;

    // Helper function for icon colors based on theme - REPLACED by dynamic CSS variables
    const iconClasses = 'transition-colors duration-200 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300';

    return (
        <div className={`h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex font-${project?.typography || 'sans'}`}>
            {/* PTR Banner */}
            {usePage().props.is_ptr && <PtrBanner />}
            
            {/* Desktop Sidebar */}
            <Sidebar user={user} className="hidden md:flex" collapsed={!isSidebarOpen} project={project} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Mobile Header & Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Desktop Topbar */}
                <header
                    className="hidden md:flex items-center justify-between h-12 bg-white dark:bg-gray-800 px-6 shrink-0 z-30 relative border-b border-gray-200 dark:border-gray-700"
                >
                    <div className="flex-1 flex items-center gap-4">
                        {/* Sidebar Toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="focus:outline-none transition-all duration-200 mr-2"
                            title={isSidebarOpen ? 'Colapsar menú' : 'Expandir menú'}
                        >
                            {isSidebarOpen ? (
                                <MenuFoldIcon className={`h-6 w-6 ${iconClasses}`} />
                            ) : (
                                <MenuUnfoldIcon className={`h-6 w-6 ${iconClasses}`} />
                            )}
                        </button>
                        {showBackButton && (
                            <button
                                onClick={() => window.history.back()}
                                className="focus:outline-none transition-all duration-200"
                                title="Go Back"
                            >
                                <ArrowLeftIcon className={`h-5 w-5 ${iconClasses}`} />
                            </button>
                        )}
                        {header}
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Bug Reporter Trigger (Desktop) */}
                        {is_ptr && (
                            <div className="hidden lg:flex items-center">
                                <button
                                    onClick={() => setBugModalOpen(true)}
                                    className="p-1 rounded-full text-danger-500 hover:text-danger-600 focus:outline-none transition-colors relative"
                                    title={t('bug_reporter.title', 'Report a Bug')}
                                >
                                    <BugIcon className="h-6 w-6" />
                                    {isSuperAdmin && bugCount > 0 && (
                                        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 bg-danger-500 transform translate-x-1/4 -translate-y-1/4"></span>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Global Search */}
                        <div className="hidden lg:block w-48 xl:w-56">
                            <SearchInput
                                className="w-full"
                                inputClasses="py-1.5 text-sm bg-gray-50 dark:bg-gray-900"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 pl-4">
                        <ThemeToggle />


                        {/* Inbox Dropdown */}
                        <div className="relative flex items-center">
                            <Dropdown width="80" contentClasses="py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Dropdown.Trigger>
                                    <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                        <span className="sr-only">{t('inbox.title', 'Buzón de entrada')}</span>
                                        <InboxIcon className={`h-6 w-6 ${iconClasses}`} />
                                        {(user.unread_messages_count > 0 || user.pending_invitations_count > 0 || (user.db_notifications_count || 0) > 0) && (
                                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
                                        )}
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {t('inbox.notifications', 'Notificaciones')}
                                        </span>
                                        {(user.unread_messages_count + user.pending_invitations_count + (user.db_notifications_count || 0)) > 0 && (
                                            <span className="text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400 px-1.5 py-0.5 rounded-full font-bold">
                                                {user.unread_messages_count + user.pending_invitations_count + (user.db_notifications_count || 0)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="max-h-80 overflow-y-auto overflow-x-hidden scrollbar-thin">
                                        {/* Invitations Section */}
                                        {user.pending_invitations && user.pending_invitations.length > 0 && (
                                            <div className="bg-amber-50/30 dark:bg-amber-900/10">
                                                <div className="px-4 py-1 text-[10px] uppercase font-bold text-amber-600 dark:text-amber-500 tracking-wider">
                                                    {t('invitations.pending_title', 'Invitaciones Pendientes')}
                                                </div>
                                                {user.pending_invitations.map((invitation) => (
                                                    <Dropdown.Link
                                                        key={`inv-${invitation.id}`}
                                                        href={route('invitations.index')}
                                                        className="flex items-center px-4 py-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors border-b border-amber-100/50 dark:border-amber-900/20"
                                                    >
                                                        <div className="shrink-0 mr-3">
                                                            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                                                                <EnvelopeIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {invitation.proyecto_nombre}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {t('invitations.invited_by', 'Invitado por')} {invitation.invitador_nombre}
                                                            </p>
                                                        </div>
                                                    </Dropdown.Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Task Mentions / Database Notifications Section */}
                                        {user.db_notifications && user.db_notifications.length > 0 && (
                                            <div className="bg-blue-50/30 dark:bg-blue-900/10">
                                                <div className="px-4 py-1 text-[10px] uppercase font-bold text-blue-600 dark:text-blue-500 tracking-wider">
                                                    {t('inbox.mentions', 'Menciones')}
                                                </div>
                                                {user.db_notifications.map((notif) => (
                                                    <Dropdown.Link
                                                        key={`notif-${notif.id}`}
                                                        href={notif.data.project_uuid
                                                            ? route('mis-proyectos.show', { proyecto: notif.data.project_uuid }) + '?tab=tasks&task=' + notif.data.task_uuid
                                                            : route('dashboard')
                                                        }
                                                        className="flex items-center px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-blue-100/50 dark:border-blue-900/20"
                                                    >
                                                        <div className="shrink-0 mr-3">
                                                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-sm">
                                                                @
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {notif.data.task_id_string} — {notif.data.task_title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {notif.data.mentioned_by_name} {t('inbox.mentioned_you', 'te mencionó')} · {notif.data.project_name}
                                                            </p>
                                                        </div>
                                                    </Dropdown.Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Chat Messages Section */}
                                        {user.unread_projects && user.unread_projects.length > 0 ? (
                                            <div>
                                                {(user.pending_invitations?.length > 0 || user.db_notifications?.length > 0) && (
                                                    <div className="px-4 py-1 text-[10px] uppercase font-bold text-primary-600 dark:text-primary-500 tracking-wider border-t border-gray-100 dark:border-gray-700">
                                                        {t('modules.chat.title', 'Mensajes de Chat')}
                                                    </div>
                                                )}
                                                {user.unread_projects.map((project) => (
                                                    <Dropdown.Link
                                                        key={`chat-${project.id}`}
                                                        href={route('mis-proyectos.chat', { proyecto: project.uuid })}
                                                        className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                    >
                                                        <div className="shrink-0 mr-3">
                                                            {project.image_url || project.image_path ? (
                                                                <img className="h-8 w-8 rounded-full object-cover border border-gray-100 dark:border-gray-700" src={project.image_url || `/storage/${project.image_path}`} alt="" />
                                                            ) : (
                                                                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                                                    <FolderIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {project.nombre}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {project.unread_count} {t('inbox.new_messages', 'mensajes nuevos')}
                                                            </p>
                                                        </div>
                                                        {project.unread_count > 0 && (
                                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                                {project.unread_count}
                                                            </span>
                                                        )}
                                                    </Dropdown.Link>
                                                ))}
                                            </div>
                                        ) : (
                                            (!user.pending_invitations || user.pending_invitations.length === 0) && (!user.db_notifications || user.db_notifications.length === 0) && (
                                                <div className="px-4 py-10 text-center flex flex-col items-center">
                                                    <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mb-3">
                                                        <InboxIcon className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                        {t('inbox.empty', 'No tienes notificaciones.')}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <div className="relative flex items-center">
                            <Dropdown className="flex items-center">
                                <Dropdown.Trigger className="flex items-center">
                                    <button
                                        type="button"
                                        className="inline-flex items-center border border-transparent text-sm leading-4 font-medium rounded-full bg-white dark:bg-gray-800 hover:opacity-80 focus:outline-none transition ease-in-out duration-150"
                                    >
                                        {user.profile_photo_url ? (
                                            <img
                                                className="h-8 w-8 rounded-full object-cover border-2 border-primary-600 dark:border-primary-400"
                                                src={user.profile_photo_url}
                                                alt={user.name}
                                            />
                                        ) : (
                                            <UserCircleIcon className={`h-8 w-8 ${iconClasses}`} />
                                        )}
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    {/* Account Management */}
                                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                                        <div className="font-medium text-base text-gray-800 dark:text-gray-200 truncate">{user.name}</div>
                                        <div className="font-medium text-sm text-gray-500 truncate">{user.email}</div>
                                    </div>

                                    <Dropdown.Link href={route('profile.edit')}>
                                        {t('profile.edit', 'Editar Perfil')}
                                    </Dropdown.Link>

                                    <Dropdown.Link href={route('inbox')}>
                                        <div className="flex justify-between items-center">
                                            <span>{t('inbox.title', 'Buzón de entrada')}</span>
                                            {user.unread_messages_count > 0 && (
                                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                                    {user.unread_messages_count}
                                                </span>
                                            )}
                                        </div>
                                    </Dropdown.Link>

                                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                                    {/* Language Switcher */}
                                    <div className="block px-4 py-2 text-xs text-gray-400">
                                        {t('common.language', 'Idioma')}
                                    </div>
                                    <Dropdown.Link
                                        href={route('language.switch', 'es')}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2"
                                        active={user.locale === 'es'}
                                    >
                                        <IconES className="w-5 h-5" />
                                        <span>Español</span>
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('language.switch', 'en')}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2"
                                        active={user.locale === 'en'}
                                    >
                                        <IconEN className="w-5 h-5" />
                                        <span>English</span>
                                    </Dropdown.Link>

                                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                                    {/* Theme Settings */}
                                    <Dropdown.Link href={route('settings.theme')}>
                                        {t('settings.theme.title', 'Tema Global')}
                                    </Dropdown.Link>

                                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                                    {/* Authentication */}
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        {t('auth.logout', 'Cerrar Sesión')}
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Mobile Header */}
                <nav className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shrink-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="shrink-0 flex items-center">
                                    <Link href={route('dashboard')}>
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-primary-600 dark:text-primary-400" />
                                    </Link>
                                </div>
                            </div>

                            <div className="-mr-2 flex items-center gap-2 md:hidden">
                                <ThemeToggle className="" />

                                {/* Bug Reporter Trigger (Mobile) */}
                                {is_ptr && (
                                    <button
                                        onClick={() => setBugModalOpen(true)}
                                        className="relative p-1 rounded-full text-danger-500 hover:text-danger-600 focus:outline-none transition-colors"
                                    >
                                        <BugIcon className="h-6 w-6" />
                                        {isSuperAdmin && bugCount > 0 && (
                                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 bg-danger-500 transform translate-x-1/4 -translate-y-1/4"></span>
                                        )}
                                    </button>
                                )}

                                {/* Mobile Inbox Icon */}
                                <Link
                                    href={route('inbox')}
                                    className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <span className="sr-only">{t('inbox.title', 'Buzón de entrada')}</span>
                                    <InboxIcon className="h-6 w-6 transition-colors duration-200 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300" />
                                    {(user.unread_messages_count > 0 || (user.db_notifications_count || 0) > 0) && (
                                        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
                                    )}
                                </Link>

                                {/* Profile Button */}
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="relative inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    {user.profile_photo_url ? (
                                        <img
                                            className="h-8 w-8 rounded-full object-cover border-2 border-primary-600 dark:border-primary-400"
                                            src={user.profile_photo_url}
                                            alt={user.name}
                                        />
                                    ) : (
                                        <UserCircleIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden'}>
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                {t('dashboard.title', 'Dashboard')}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('inbox')} active={route().current('inbox')}>
                                <div className="flex items-center justify-between">
                                    <span>{t('inbox.title', 'Buzón de entrada')}</span>
                                    {user.unread_messages_count > 0 && (
                                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                            {user.unread_messages_count}
                                        </span>
                                    )}
                                </div>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('invitations.index')} active={route().current('invitations.index')}>
                                {t('invitations.title', 'Invitaciones')}
                            </ResponsiveNavLink>
                        </div>

                        {/* User Info & Settings */}
                        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                            <div className="px-4 mb-3">
                                <div className="font-medium text-base text-gray-800 dark:text-gray-200">{user.name}</div>
                                <div className="font-medium text-sm text-gray-500">{user.email}</div>
                            </div>

                            <div className="space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    {t('profile.title', 'Perfil')}
                                </ResponsiveNavLink>

                                {/* Language Switcher */}
                                <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
                                <div className="px-4 text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-2 mt-2">
                                    {t('common.language', 'Idioma')}
                                </div>
                                <ResponsiveNavLink
                                    href={route('language.switch', 'es')}
                                    method="post"
                                    as="button"
                                    active={user.locale === 'es'}
                                    className="flex items-center gap-2"
                                >
                                    <IconES className="w-5 h-5" />
                                    <span>Español</span>
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('language.switch', 'en')}
                                    method="post"
                                    as="button"
                                    active={user.locale === 'en'}
                                    className="flex items-center gap-2"
                                >
                                    <IconEN className="w-5 h-5" />
                                    <span>English</span>
                                </ResponsiveNavLink>

                                {/* Theme Settings */}
                                <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
                                <ResponsiveNavLink href={route('settings.theme')}>
                                    {t('settings.theme.title', 'Tema Global')}
                                </ResponsiveNavLink>

                                {/* Logout */}
                                <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                    {t('auth.logout', 'Cerrar Sesión')}
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden focus:outline-none scrollbar-thin">
                    {header && (
                        <header className="md:hidden bg-white dark:bg-gray-800 shadow shrink-0">
                            <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    <div className="py-6 pb-20 md:pb-6">
                        <div className="w-full px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Mobile Bottom Navigation */}
                <BottomNavigation user={user} project={project} />
            </div >

            <SessionExpiredModal show={showSessionExpired} />
            {hasActiveAi && <AiChatWidget />}
            {is_ptr && (
                <BugReporterWidget
                    show={bugModalOpen}
                    onClose={() => setBugModalOpen(false)}
                />
            )}
        </div >
    );
}
