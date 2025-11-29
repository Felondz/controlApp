import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import ThemeToggle from '@/Components/ThemeToggle';
import { BookOpenIcon, CodeIcon } from '@/Components/Icons';

export default function Hub() {
    const { t } = useTranslate();

    const cards = [
        {
            title: t('docs.hub_user_title'),
            description: t('docs.hub_user_desc'),
            href: route('docs.user'),
            icon: BookOpenIcon,
            cta: t('docs.view_user_guide'),
            // Define full classes to ensure Tailwind purge detection
            gradientClass: 'from-primary-500/10',
            bgClass: 'bg-primary-100 dark:bg-primary-900/30',
            iconClass: 'text-primary-600 dark:text-primary-400',
            ctaClass: 'text-primary-600 dark:text-primary-400'
        },
        {
            title: t('docs.hub_dev_title'),
            description: t('docs.hub_dev_desc'),
            href: route('docs.dev'),
            icon: CodeIcon,
            cta: t('docs.explore_code'),
            // Define full classes to ensure Tailwind purge detection
            gradientClass: 'from-info-500/10',
            bgClass: 'bg-info-100 dark:bg-info-900/30',
            iconClass: 'text-info-600 dark:text-info-400',
            ctaClass: 'text-info-600 dark:text-info-400'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title={t('docs.hub_title')} />

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('docs.hub_title')}
                        </h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {cards.map((card, index) => (
                        <Link
                            key={index}
                            href={card.href}
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientClass} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            <div className="p-8">
                                <div className={`w-16 h-16 ${card.bgClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <card.icon className={`w-8 h-8 ${card.iconClass}`} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    {card.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {card.description}
                                </p>
                                <span className={`inline-flex items-center ${card.ctaClass} font-medium group-hover:translate-x-2 transition-transform duration-200`}>
                                    {card.cta}
                                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
