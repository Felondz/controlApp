import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { ChatIcon, FolderIcon, EnvelopeIcon } from '@/Components/Icons';

export default function Inbox({ auth, projects, invitations = [] }) {
    const { t } = useTranslate();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('inbox.title', 'Buzón de entrada')}</h2>}
        >
            <Head title={t('modules.inbox.title', 'Inbox')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {invitations.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                        {t('invitations.pending', 'Invitaciones Pendientes')}
                                    </h3>
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                                        {invitations.map((invitation) => (
                                            <li key={invitation.id}>
                                                <Link
                                                    href={route('invitations.index')}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors first:rounded-t-lg last:rounded-b-lg gap-4 sm:gap-0"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="shrink-0">
                                                            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                                                <EnvelopeIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {invitation.proyecto?.nombre || t('common.project', 'Proyecto')}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {t('invitations.invited_by', 'Invitado por')} {invitation.invitador?.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium self-end sm:self-auto">
                                                        {t('common.view', 'Ver')}
                                                        <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {projects.length === 0 && invitations.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>{t('inbox.empty', 'No tienes mensajes nuevos ni invitaciones.')}</p>
                                </div>
                            ) : (
                                projects.length > 0 && (
                                    <>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                            {t('inbox.messages', 'Mensajes')}
                                        </h3>
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
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
