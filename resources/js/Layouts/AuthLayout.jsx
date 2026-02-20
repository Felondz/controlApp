import { Head, usePage } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import ThemeToggle from '@/Components/ThemeToggle';
import Alert from '@/Components/Alert';

export default function AuthLayout({ children, title }) {
    const { t } = useTranslate();
    const { flash } = usePage().props;

    return (
        <div className="min-h-screen bg-gradient-to-br from-info-50 to-primary-100 dark:from-secondary-900 dark:to-secondary-800 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <Head title={title} />

            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 px-4">
                <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white dark:bg-secondary-800 shadow-xl overflow-hidden sm:rounded-lg border border-secondary-100 dark:border-secondary-700">
                    {/* Logo y Título */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center space-x-2">
                            <svg className="w-8 h-8 text-primary-700 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                                {t('app.name')}
                            </span>
                        </div>
                        <h1 className="mt-4 text-xl font-semibold text-primary-900 dark:text-secondary-100">{title}</h1>
                    </div>

                    {/* Flash Messages */}
                    <div className="space-y-4 mb-4">
                        {flash?.success && (
                            <Alert type="success" message={flash.success} onClose={() => { }} />
                        )}
                        {flash?.error && (
                            <Alert type="error" message={flash.error} onClose={() => { }} />
                        )}
                        {flash?.status && (
                            <Alert type="info" message={flash.status} onClose={() => { }} />
                        )}
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
