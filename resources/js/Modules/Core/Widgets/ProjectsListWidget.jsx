import React from 'react';
import ProjectCard from '@/Components/Project/ProjectCard';
import { Link } from '@inertiajs/react';
import { PlusIcon, EmptyStateIcon } from '@/Components/Icons';
import { useTranslate } from '@/Hooks/useTranslate';

export default function ProjectsListWidget({ projects = [] }) {
    const { t } = useTranslate();

    if (!projects || projects.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900 dark:text-gray-100 h-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center py-12">
                <div className="text-4xl mb-4 text-primary-500">
                    <EmptyStateIcon className="h-16 w-16" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {t('dashboard.no_projects')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">
                    {t('dashboard.create_first_project_desc')}
                </p>
                <Link
                    href={route('mis-proyectos.create')}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 transition ease-in-out duration-150"
                >
                    {t('projects.create_new')}
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {projects.map((proyecto) => (
                <ProjectCard key={proyecto.id} proyecto={proyecto} />
            ))}

            {/* Always visible Add Card in grid */}
            <Link
                href={route('mis-proyectos.create')}
                className="group border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary-500 dark:hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 min-h-[200px]"
            >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 flex items-center justify-center mb-3 transition-colors">
                    <PlusIcon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                </div>
                <span className="text-sm font-medium text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {t('projects.create_new')}
                </span>
            </Link>
        </div>
    );
}
