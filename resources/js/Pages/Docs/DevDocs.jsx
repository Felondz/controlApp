import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import ThemeToggle from '@/Components/ThemeToggle';
import Alert from '@/Components/Alert';

export default function DevDocs({ items, content, currentPath, isDir, breadcrumbs, fileName }) {
    const { t } = useTranslate();

    const getIcon = (type) => {
        if (type === 'directory') {
            return (
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title={t('docs.dev_docs_title')} />

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href={route('docs.index')} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-nowrap">
                            <Link href={route('docs.dev')} className="hover:text-primary-600 dark:hover:text-primary-400">
                                docs
                            </Link>

                            {/* Breadcrumbs */}
                            {breadcrumbs.map((crumb, index) => (
                                <span key={index} className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <Link
                                        href={route('docs.dev', crumb.path)}
                                        className={index === breadcrumbs.length - 1 ? 'text-gray-900 dark:text-white font-bold' : 'hover:text-primary-600 dark:hover:text-primary-400'}
                                    >
                                        {crumb.name}
                                    </Link>
                                </span>
                            ))}
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                    {isDir ? (
                        // Directory Listing
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {currentPath && (
                                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <Link href={route('docs.dev', currentPath.split('/').slice(0, -1).join('/'))} className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                                        <span className="mr-2">..</span>
                                    </Link>
                                </div>
                            )}
                            {items.map((item, index) => (
                                <div key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between group">
                                    <Link href={route('docs.dev', item.path)} className="flex items-center flex-1 min-w-0">
                                        <span className="mr-3">{getIcon(item.type)}</span>
                                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:underline">
                                            {item.name}
                                        </span>
                                    </Link>
                                    {item.size && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                                            {item.size}
                                        </span>
                                    )}
                                </div>
                            ))}
                            {items.length === 0 && (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                    {t('docs.dev_docs_empty')}
                                </div>
                            )}
                        </div>
                    ) : (
                        // File Content
                        <div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex justify-between items-center">
                                <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{fileName}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-500">Markdown</span>
                            </div>
                            <div className="p-8 prose dark:prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Security Note Footer */}
                <Alert
                    title={t('common.security_note_title')}
                    type="info"
                    className="mt-6"
                >
                    {t('common.security_note_desc')}
                </Alert>
            </main>
        </div>
    );
}
