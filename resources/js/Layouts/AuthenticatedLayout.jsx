import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { MenuFoldIcon, MenuUnfoldIcon, IconES, IconEN, UserCircleIcon } from '@/Components/Icons';
import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';
import SearchInput from '@/Components/SearchInput';
import { Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { t } = useTranslate();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
            {/* Desktop Sidebar */}
            <Sidebar user={user} className="hidden md:flex" collapsed={!isSidebarOpen} />

            {/* Mobile Header & Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Desktop Topbar */}
                <header className="hidden md:flex items-center justify-between h-12 bg-white dark:bg-gray-800 px-6 shrink-0 z-10 relative border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-1 flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-transform duration-200"
                        >
                            {isSidebarOpen ? (
                                <MenuFoldIcon className="h-6 w-6" />
                            ) : (
                                <MenuUnfoldIcon className="h-6 w-6" />
                            )}
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
                                        className="inline-flex items-center border border-transparent text-sm leading-4 font-medium rounded-full text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                    >
                                        {user.profile_photo_url ? (
                                            <img
                                                className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                                src={user.profile_photo_url}
                                                alt={user.name}
                                            />
                                        ) : (
                                            <UserCircleIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
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
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
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
