import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import ThemeToggle from '@/Components/ThemeToggle';

export default function DocViewer({ title, content }) {
    const { t } = useTranslate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title={title} />

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
                            {title}
                        </h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="prose dark:prose-invert max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </main>
        </div>
    );
}
