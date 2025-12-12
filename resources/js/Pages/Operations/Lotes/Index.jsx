import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { FactoryIcon } from '@/Components/Icons';

export default function Index({ auth, proyecto }) {
    const { t } = useTranslate();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('mis-proyectos.show', proyecto.id)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        {proyecto.nombre}
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">/</span>
                    <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight flex items-center gap-2">
                        <FactoryIcon className="h-6 w-6" />
                        {t('operations.title', 'Operaciones')}
                    </h2>
                </div>
            }
        >
            <Head title={`Operaciones - ${proyecto.nombre}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                            <FactoryIcon className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-xl font-medium mb-2">Módulo de Operaciones</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center max-w-ld">
                                Este módulo está actualmente en desarrollo. Aquí podrás gestionar lotes, producción y procesos operativos.
                            </p>
                            <div className="mt-8">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400">
                                    Work in Progress
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
