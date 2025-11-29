import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { MenuFoldIcon, MenuUnfoldIcon, IconES, IconEN, UserCircleIcon, ArrowLeftIcon } from '@/Components/Icons';
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
        <div className="h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
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
                    <div className="flex items-center space-x-4 pl-4">
                        <ThemeToggle />
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
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden'}>
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Dashboard
                            </ResponsiveNavLink>
                        </div>
                        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                            <div className="px-4">
                                <div className="font-medium text-base text-gray-800 dark:text-gray-200">{user.name}</div>
                                <div className="font-medium text-sm text-gray-500">{user.email}</div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto focus:outline-none">
                    {header && (
                        <header className="md:hidden bg-white dark:bg-gray-800 shadow shrink-0">
                            <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    <div className="py-6">
                        <div className="w-full px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
}
