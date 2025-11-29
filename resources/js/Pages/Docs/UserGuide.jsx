import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import ThemeToggle from '@/Components/ThemeToggle';

export default function UserGuide() {
    const { t } = useTranslate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title={t('docs.user_guide_title')} />

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href={route('docs.index')} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('docs.user_guide_title')}
                        </h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* Intro Section */}
                    <section className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            {t('docs.user_guide_intro_title')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            {t('docs.user_guide_intro_desc')}
                        </p>
                    </section>

                    {/* Feature: Projects */}
                    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/2 bg-primary-50 dark:bg-primary-900/20 p-8 flex items-center justify-center">
                            <svg className="w-32 h-32 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('docs.features.projects_title')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t('docs.features.projects_desc')}
                            </p>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {t('docs.features.projects_list_1')}
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {t('docs.features.projects_list_2')}
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Feature: Finance */}
                    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row-reverse">
                        <div className="md:w-1/2 bg-success-50 dark:bg-success-900/20 p-8 flex items-center justify-center">
                            <svg className="w-32 h-32 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('docs.features.finance_title')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t('docs.features.finance_desc')}
                            </p>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {t('docs.features.finance_list_1')}
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {t('docs.features.finance_list_2')}
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Getting Started */}
                    <section className="text-center py-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            {t('docs.cta.start_title')}
                        </h3>
                        <div className="flex justify-center space-x-4">
                            <Link href={route('register')} className="px-8 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-lg">
                                {t('docs.cta.create_account')}
                            </Link>
                            <Link href={route('login')} className="px-8 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow border border-gray-200 dark:border-gray-600">
                                {t('docs.cta.login')}
                            </Link>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
