import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { MenuFoldIcon, MenuUnfoldIcon, IconES, IconEN, UserCircleIcon, ArrowLeftIcon, InboxIcon, FolderIcon } from '@/Components/Icons';
import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';
import SearchInput from '@/Components/SearchInput';
import { Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import BottomNavigation from '@/Components/BottomNavigation';
import { useGlobalTheme } from '@/Contexts/GlobalThemeContext';
import { getThemeStyle } from '@/Utils/themeStyles';

export default function AuthenticatedLayout({ header, children, projectTheme = null, project = null }) {
    const user = usePage().props.auth.user;

    return (
        <LayoutContent user={user} header={header} projectTheme={projectTheme} project={project}>{children}</LayoutContent>
    );
}

function LayoutContent({ user, header, children, projectTheme, project }) {
    const { t } = useTranslate();
    const { theme, isDark, setThemeLocal } = useGlobalTheme();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

    // Helper function for icon colors based on theme - REPLACED by dynamic CSS variables
    const iconClasses = 'transition-colors duration-200 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300';

    return (
        <div className={`h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex font-${project?.typography || 'sans'}`}>
            {/* Desktop Sidebar */}
            <Sidebar user={user} className="hidden md:flex" collapsed={!isSidebarOpen} project={project} />

            {/* Mobile Header & Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Desktop Topbar */}
                <header
                    className="hidden md:flex items-center justify-between h-12 bg-white dark:bg-gray-800 px-6 shrink-0 z-10 relative border-b border-gray-200 dark:border-gray-700"
                >
                    <div className="flex-1 flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="focus:outline-none transition-all duration-200"
                        >
                            {isSidebarOpen ? (
                                <MenuFoldIcon className={`h-5 w-5 ${iconClasses}`} />
                            ) : (
                                <MenuUnfoldIcon className={`h-5 w-5 ${iconClasses}`} />
                            )}
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="focus:outline-none transition-all duration-200"
                            title="Go Back"
                        >
                            <ArrowLeftIcon className={`h-5 w-5 ${iconClasses}`} />
                        </button>
                        {header}
                    </div>
                    <div className="flex items-center gap-4">
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
                                        {user.unread_messages_count > 0 && (
                                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
                                        )}
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {t('inbox.title', 'Buzón de entrada')}
                                        </span>
                                    </div>

                                    {user.unread_projects && user.unread_projects.length > 0 ? (
                                        <div className="max-h-64 overflow-y-auto">
                                            {user.unread_projects.map((project) => (
                                                <Dropdown.Link
                                                    key={project.id}
                                                    href={route('mis-proyectos.chat', project.id)}
                                                    className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                >
                                                    <div className="shrink-0 mr-3">
                                                        {project.image_path ? (
                                                            <img className="h-8 w-8 rounded-full object-cover" src={`/storage/${project.image_path}`} alt="" />
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
                                                            {project.unread_count} mensajes nuevos
                                                        </p>
                                                    </div>
                                                    {project.unread_count > 0 && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                            {project.unread_count}
                                                        </span>
                                                    )}
                                                </Dropdown.Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                            {t('inbox.empty', 'No tienes mensajes nuevos.')}
                                        </div>
                                    )}

                                    <div className="border-t border-gray-100 dark:border-gray-700">
                                        <Dropdown.Link href={route('inbox')} className="text-center text-primary-600 dark:text-primary-400 text-xs font-medium">
                                            {t('inbox.view_all', 'Ver todos')}
                                        </Dropdown.Link>
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

                            <div className="-mr-2 flex items-center md:hidden">
                                <ThemeToggle className="mr-2" />
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="relative inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ml-2"
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
                <main className="flex-1 overflow-y-auto focus:outline-none scrollbar-thin">
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
        </div >
    );
}
