
import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import ThemeToggle from '@/Components/ThemeToggle';
import Alert from '@/Components/Alert';
import {
    FolderIcon, DocumentIcon, ArrowLeftIcon, HomeIcon,
    PuzzleIcon, LinkIcon, ShieldCheckIcon, CodeIcon,
    ServerStackIcon, GlobeAltIcon, CommandLineIcon, LockClosedIcon
} from '@/Components/Icons';
import SecondaryButton from '@/Components/SecondaryButton';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

// --- Custom Components for Markdown Mapping (Consistent with UserGuide) ---

const SectionHeader = ({ children, ...props }) => {
    const text = String(children).toLowerCase();

    let Icon = null;
    if (text.includes('architect') || text.includes('arquitectura')) Icon = ServerStackIcon;
    else if (text.includes('api')) Icon = GlobeAltIcon;
    else if (text.includes('command') || text.includes('comandos')) Icon = CommandLineIcon;
    else if (text.includes('secur') || text.includes('seguridad')) Icon = LockClosedIcon;

    // If no specific icon, return standard clean H2 to avoid "double icon" look or no-ref icons
    if (!Icon) {
        return (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2" {...props}>
                {children}
            </h2>
        );
    }

    return (
        <div className="flex items-center gap-3 mt-10 mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <Icon className="w-6 h-6" />
            </div>
            <h2 {...props} className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                {children}
            </h2>
        </div>
    );
};

export default function DevDocs({ items, content, currentPath, isDir, breadcrumbs, fileName }) {
    const { t } = useTranslate();

    // Standard platform icons with consistent colors
    const getIcon = (type) => {
        if (type === 'directory') {
            return <FolderIcon className="w-5 h-5 text-primary-500" />;
        }
        return <DocumentIcon className="w-5 h-5 text-gray-400" />;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 selection:bg-primary-500 selection:text-white">
            <Head title={t('docs.dev_docs_title')} />

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href={route('docs.index')} className="group flex items-center text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                            <SecondaryButton className="!p-2 mr-2">
                                <ArrowLeftIcon className="w-5 h-5" />
                            </SecondaryButton>
                        </Link>

                        <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-nowrap hide-scrollbar">
                            <Link href={route('docs.dev')} className={`flex items-center hover:text-primary-600 dark:hover:text-primary-400 ${!currentPath ? 'text-primary-600 dark:text-primary-400 font-bold' : ''}`}>
                                <HomeIcon className="w-4 h-4 mr-1" />
                                <span>DevHub</span>
                            </Link>

                            {/* Breadcrumbs */}
                            {breadcrumbs.map((crumb, index) => (
                                <span key={index} className="flex items-center animate-fadeIn">
                                    <svg className="w-4 h-4 text-gray-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <Link
                                        href={route('docs.dev', crumb.path)}
                                        className={`transition-colors duration-200 ${index === breadcrumbs.length - 1 ? 'text-gray-900 dark:text-white font-bold' : 'hover:text-primary-600 dark:hover:text-primary-400'}`}
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

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* LEFT COLUMN: Sidebar Navigation */}
                    <div className="lg:col-span-1 hidden lg:block sticky top-24">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                                Explorer
                            </div>

                            {currentPath && (
                                <div className="p-2 border-b border-gray-50 dark:border-gray-700/50">
                                    <Link href={route('docs.dev', currentPath.split('/').slice(0, -1).join('/'))} className="flex items-center px-2 py-1.5 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded transition-colors">
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        <span>..</span>
                                    </Link>
                                </div>
                            )}

                            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
                                {items.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={route('docs.dev', item.path)}
                                        className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors group mb-0.5 ${fileName === item.name ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                                    >
                                        {getIcon(item.type)}
                                        <span className="truncate">{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <Alert title="Tips" type="info" className="text-xs">
                                {t('common.security_note_desc')}
                            </Alert>
                        </div>
                    </div>

                    {/* Mobile Navigation (Visible only on small screens) */}
                    <div className="lg:hidden mb-6">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                            <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900 dark:text-white">
                                    <span>Browse Files</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-500 dark:text-gray-400 mt-3 group-open:animate-fadeIn divide-y divide-gray-100 dark:divide-gray-700">
                                    {items.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={route('docs.dev', item.path)}
                                            className="flex items-center gap-3 py-2 text-sm"
                                        >
                                            {getIcon(item.type)}
                                            <span className={fileName === item.name ? 'font-bold text-primary-600' : ''}>{item.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </details>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[600px]">
                            {/* File Title Bar */}
                            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
                                <div className="flex items-center gap-2">
                                    {isDir ? <FolderIcon className="w-5 h-5 text-primary-500" /> : <DocumentIcon className="w-5 h-5 text-gray-400" />}
                                    <span className="text-base font-semibold font-mono text-gray-700 dark:text-gray-200">
                                        {fileName || (isDir ? 'Directory' : 'Content')}
                                    </span>
                                </div>
                                {!isDir && <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded font-mono uppercase">Markdown</span>}
                            </div>

                            {/* Markdown Content */}
                            <div className="p-8 lg:p-10 overflow-x-hidden">
                                {content ? (
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-3xl font-extrabold text-primary-600 dark:text-primary-400 mb-6 tracking-tight border-b border-gray-200 dark:border-gray-700 pb-4" {...props} />,
                                            h2: SectionHeader,
                                            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3" {...props} />,
                                            p: ({ node, ...props }) => <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-600 dark:text-gray-300 ml-4" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-600 dark:text-gray-300 ml-4" {...props} />,
                                            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                            a: ({ node, ...props }) => <a className="text-primary-600 dark:text-primary-400 hover:underline font-medium" {...props} />,
                                            blockquote: ({ node, ...props }) => (
                                                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg my-6 text-blue-900 dark:text-blue-100">
                                                    {props.children}
                                                </div>
                                            ),
                                            pre: ({ node, ...props }) => (
                                                <div className="relative group my-6">
                                                    <pre className="block bg-[#0d1117] text-gray-200 p-5 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed border border-gray-700 shadow-inner" {...props} />
                                                </div>
                                            ),
                                            code: ({ node, inline, className, children, ...props }) => {
                                                if (inline) {
                                                    return (
                                                        <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-primary-600 dark:text-primary-400" {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                                // Block code (inside pre)
                                                const match = /language-(\w+)/.exec(className || '');
                                                return (
                                                    <>
                                                        {match && (
                                                            <span className="absolute right-2 top-2 text-xs font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded opacity-50 group-hover:opacity-100 transition-opacity select-none">
                                                                {match[1]}
                                                            </span>
                                                        )}
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    </>
                                                );
                                            }
                                        }}
                                    >
                                        {content}
                                    </ReactMarkdown>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                                        <FolderIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                        <p className="text-gray-500">Select a file from the sidebar to view content.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
