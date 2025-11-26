import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';

export default function SearchResults({ auth, users, projects, query }) {
    const { t } = useTranslate();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
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
                                                <span className="text-2xl">{project.icon || '📂'}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {project.nombre}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {project.description || t('common.no_description', 'Sin descripción')}
                                                </p>
                                            </div>
                                            <div>
                                                <Link
                                                    href={route('mis-proyectos.show', project.id)}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    {t('common.view', 'Ver')}
                                                </Link>
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
                                                <img className="h-10 w-10 rounded-full" src={user.profile_photo_url} alt={user.name} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {user.email}
                                                </p>
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
