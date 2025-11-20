import { Link } from '@inertiajs/react';
import { useTranslate } from '@/hooks/useTranslate';

export default function ProjectCard({ proyecto }) {
    const t = useTranslate();

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg transition duration-300 hover:shadow-md">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {proyecto.nombre}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${proyecto.es_personal
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                            }`}>
                            {proyecto.es_personal ? t('projects.personal', 'Personal') : t('projects.collaborative', 'Colaborativo')}
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('accounts.currency')}: {proyecto.moneda_default}
                    </p>
                </div>

                <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <Link
                        href={route('mis-proyectos.show', { mis_proyecto: proyecto.id })}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                        Ir al Dashboard &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}