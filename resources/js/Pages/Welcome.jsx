import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';

import ThemeToggle from '@/Components/ThemeToggle';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { t } = useTranslate();
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-gradient-to-br from-info-50 to-primary-100 dark:from-secondary-900 dark:to-secondary-800">
            <Head title={t('app.name')} />

            {/* Test Mode Banner */}
            <div className="bg-warning-500 text-white text-center py-2 px-4 font-medium text-sm">
                {t('auth.test_mode_banner')}
            </div>

            {/* Header */}
            <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        {t('app.name')}
                    </span>
                </div>
                <nav className="flex items-center space-x-6">
                    <ThemeToggle />
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                        >
                            {t('dashboard.title')}
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                            >
                                {t('auth.login')}
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                            >
                                {t('auth.register')}
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-6">
                        {t('landing.hero_title')}
                    </h1>
                    <p className="text-xl text-secondary-600 dark:text-secondary-300 mb-10 max-w-2xl mx-auto">
                        {t('landing.hero_subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href={route('register')}
                            className="px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 text-lg"
                        >
                            {t('landing.cta_primary')}
                        </Link>
                        <Link
                            href="#features"
                            className="px-8 py-4 bg-white dark:bg-secondary-800 text-primary-600 dark:text-primary-400 font-medium rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200 text-lg border border-primary-100 dark:border-secondary-700"
                        >
                            {t('landing.cta_secondary')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white dark:bg-secondary-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-secondary-900 dark:text-white mb-16">
                        {t('landing.features_title')}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {t('landing.features').map((feature, index) => (
                            <div key={index} className="bg-secondary-50 dark:bg-secondary-800 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
                                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-2xl mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-secondary-600 dark:text-secondary-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coming Soon Banner */}
            <section className="bg-primary-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">
                            {t('landing.coming_soon_title')}
                        </h2>
                        <p className="text-xl text-primary-100 mb-8">
                            {t('landing.coming_soon_message')}
                        </p>
                        <div className="flex justify-center">
                            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Working on something amazing...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-secondary-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-6 md:mb-0">
                            <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                                {t('app.name')}
                            </span>
                        </div>
                        <p className="text-secondary-400">
                            {t('landing.footer_copyright').replace(':year', currentYear)}
                        </p>
                    </div>
                    <div className="mt-8 text-center text-sm text-secondary-500">
                        <p>Laravel v{laravelVersion} (PHP v{phpVersion})</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
