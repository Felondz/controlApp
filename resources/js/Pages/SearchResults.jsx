import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { FolderIcon, UserCircleIcon } from '@/Components/Icons';
import PrimaryLink from '@/Components/PrimaryLink';

export default function SearchResults({ auth, users, projects, query }) {
    const { t } = useTranslate();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">
                    {t('search.results_for', 'Resultados para')}: "{query}"
                </h2>
            }
        >
            <Head title={t('search.title', 'Búsqueda')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Projects Section */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            {t('common.projects', 'Proyectos')} ({projects.length})
                        </h3>
                        {projects.length > 0 ? (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {projects.map((project) => (
                                    <li key={project.id} className="py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                {project.image_path ? (
                                                    <img
                                                        className="h-12 w-12 rounded-lg object-cover border-2 border-primary-600 dark:border-primary-400"
                                                        src={`/storage/${project.image_path}`}
                                                        alt={project.nombre}
                                                    />
                                                ) : project.icon ? (
                                                    <div className="h-12 w-12 rounded-lg flex items-center justify-center">
                                                        <span className="text-3xl">{project.icon}</span>
                                                    </div>
                                                ) : (
                                                    <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                                        <FolderIcon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {project.nombre}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {project.descripcion || t('common.no_description', 'Sin descripción')}
                                                </p>
                                            </div>
                                            <div>
                                                <PrimaryLink
                                                    href={route('mis-proyectos.show', project.id)}
                                                    className="text-xs"
                                                >
                                                    {t('common.view', 'Ver')}
                                                </PrimaryLink>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                {t('search.no_projects_found', 'No se encontraron proyectos.')}
                            </p>
                        )}
                    </div>

                    {/* Users Section */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            {t('common.users', 'Usuarios')} ({users.length})
                        </h3>
                        {users.length > 0 ? (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map((user) => (
                                    <li key={user.id} className="py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                {user.profile_photo_url ? (
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover border-2 border-primary-600 dark:border-primary-400"
                                                        src={user.profile_photo_url}
                                                        alt={user.name}
                                                    />
                                                ) : (
                                                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <div>
                                                <PrimaryLink
                                                    href={route('users.show', user.id)}
                                                    className="text-xs"
                                                >
                                                    {t('common.view_profile', 'Ver Perfil')}
                                                </PrimaryLink>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                {t('search.no_users_found', 'No se encontraron usuarios.')}
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
