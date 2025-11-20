// resources/js/Pages/Dashboard.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import ProjectCard from '@/Components/Project/ProjectCard';
import { useTranslate } from '@/hooks/useTranslate';

// Recibimos 'auth' (usuario logueado) y 'proyectos' (desde Laravel)
export default function Dashboard({ auth, proyectos = [] }) {
    const t = useTranslate();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('dashboard.my_projects')}</h2>}
        >
            <Head title={t('dashboard.title')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-gray-600 dark:text-gray-400">{t('dashboard.activity_summary')}</h3>

                        {/* Botón para crear nuevo proyecto */}
                        <Link
                            href={route('mis-proyectos.create')} // 💡 Esto activa la navegación de Inertia
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                            + {t('projects.create')}
                        </Link>
                    </div>

                    {/* Grid de Proyectos: Mapeamos la colección 'proyectos' */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {proyectos.length > 0 ? (
                            // 💡 Mapear los proyectos y pasar cada uno como prop a ProjectCard
                            proyectos.map((proyecto) => (
                                <ProjectCard key={proyecto.id} proyecto={proyecto} />
                            ))
                        ) : (
                            // Mensaje si la colección está vacía
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900 dark:text-gray-100 col-span-full">
                                <p>{t('dashboard.no_projects')}</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}