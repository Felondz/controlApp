import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import ThemeToggle from '@/Components/ThemeToggle';
import {
    ArrowLeftIcon, BanknotesIcon, UsersIcon, CheckIcon, XIcon, FolderIcon,
    StartupIcon, UserPlusIcon
} from '@/Components/Icons';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

// --- Custom Components for Markdown Mapping ---

const SectionHeader = ({ children, ...props }) => {
    // Determine icon based on text content (simple keyword matching)
    // Children is usually a string or array of strings
    const text = String(children).toLowerCase();

    let Icon = FolderIcon; // Default
    if (text.includes('crear') || text.includes('create')) Icon = StartupIcon;
    if (text.includes('transac') || text.includes('regist')) Icon = BanknotesIcon;
    if (text.includes('financ')) Icon = BanknotesIcon;
    if (text.includes('invit') || text.includes('equipo') || text.includes('team')) Icon = UserPlusIcon;

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

const CustomList = ({ children, ordered, ...props }) => {
    const Tag = ordered ? 'ol' : 'ul';
    const listStyle = ordered ? 'list-decimal' : 'list-none';

    return (
        <Tag {...props} className={`${listStyle} space-y-3 mb-6 ml-4 text-gray-600 dark:text-gray-300`}>
            {children}
        </Tag>
    );
};

const CustomListItem = ({ children, ...props }) => {
    return (
        <li {...props} className="pl-2">
            {children}
        </li>
    );
};

export default function UserGuide({ content, title }) {
    const { t } = useTranslate();
    const pageTitle = title || t('docs.user_guide_title');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 selection:bg-primary-500 selection:text-white">
            <Head title={pageTitle} />

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href={route('docs.index')} className="group flex items-center text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                            <SecondaryButton className="!p-2 mr-2">
                                <ArrowLeftIcon className="w-5 h-5" />
                            </SecondaryButton>
                            <span className="font-medium hidden sm:inline">{t('common.back')}</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {pageTitle}
                        </h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12">

                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight" {...props} />,
                            h2: SectionHeader,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3" {...props} />,
                            p: ({ node, ...props }) => <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold text-primary-600 dark:text-primary-400" {...props} />,
                            a: ({ node, ...props }) => <a className="text-primary-600 dark:text-primary-400 hover:underline font-medium decoration-2 underline-offset-2" {...props} />,
                            ul: ({ node, ...props }) => <CustomList ordered={false} {...props} />,
                            ol: ({ node, ...props }) => <CustomList ordered={true} {...props} />,
                            li: CustomListItem,
                            blockquote: ({ node, ...props }) => (
                                <div className="bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-500 p-6 rounded-r-xl my-8 italic text-gray-700 dark:text-gray-300">
                                    {props.children}
                                </div>
                            ),
                            code: ({ node, inline, className, children, ...props }) => (
                                <code className={`${inline ? 'bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-primary-600 dark:text-primary-400' : 'block bg-gray-900 text-white p-4 rounded-xl overflow-x-auto'}`} {...props}>
                                    {children}
                                </code>
                            )
                        }}
                    >
                        {content}
                    </ReactMarkdown>

                    {/* Footer / CTA - Native Platform Components */}
                    <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                    ¿Fue útil esta guía?
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Ayúdanos a mejorar nuestra documentación.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <SecondaryButton className="gap-2 !py-2.5 !px-5 text-sm !font-medium">
                                    <CheckIcon className="w-5 h-5 text-green-500" />
                                    <span>Sí, gracias</span>
                                </SecondaryButton>
                                <SecondaryButton className="gap-2 !py-2.5 !px-5 text-sm !font-medium">
                                    <XIcon className="w-5 h-5 text-red-500" />
                                    <span>No mucho</span>
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
