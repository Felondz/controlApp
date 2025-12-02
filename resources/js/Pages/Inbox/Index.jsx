import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { ChatIcon, FolderIcon } from '@/Components/Icons';

export default function Inbox({ auth, projects }) {
    const { t } = useTranslate();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('inbox.title', 'Buzón de entrada')}</h2>}
        >
            <Head title="Inbox" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {projects.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>{t('inbox.empty', 'No tienes mensajes nuevos.')}</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {projects.map((project) => (
                                        <li key={project.id}>
                                            <Link
                                                href={route('mis-proyectos.chat', project.id)}
                                                className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 p-4 rounded-lg transition-colors"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="shrink-0">
                                                        {project.image_path ? (
                                                            <img className="h-12 w-12 rounded-full object-cover" src={`/storage/${project.image_path}`} alt="" />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                                                <FolderIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {project.nombre}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {/* Simple fallback translation logic since t() might not support params yet in this helper */}
                                                            {t('inbox.unread_messages', 'Mensajes sin leer')}: {project.unread_count}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                        {project.unread_count}
                                                    </span>
                                                    <ChatIcon className="ml-4 h-5 w-5 text-gray-400" />
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
