import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { FactoryIcon, CalendarIcon, UserCircleIcon, PackageIcon, CheckListIcon, ArrowLeftIcon } from '@/Components/Icons';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ auth, proyecto, lote }) {
    const { t } = useTranslate();

    return (
        <AuthenticatedLayout
            user={auth.user}
            project={proyecto}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('operations.lotes.index', { proyecto: proyecto.uuid })}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight flex items-center gap-2">
                        Lote #{lote.code || lote.id}
                    </h2>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-sm">
                        {lote.stage?.name || 'Etapa Desconocida'}
                    </span>
                </div>
            }
        >
            <Head title={`Lote #${lote.id} - ${proyecto.nombre}`} />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Información del Lote</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <PackageIcon className="h-4 w-4" /> Cantidad Actual
                                    </dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{lote.current_quantity}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <PackageIcon className="h-4 w-4" /> Cantidad Inicial
                                    </dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{lote.initial_quantity}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" /> Fecha Inicio
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{lote.start_date}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <UserCircleIcon className="h-4 w-4" /> Responsable
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {lote.assigned_user?.name || 'Sin asignar'}
                                    </dd>
                                </div>
                            </dl>
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Notas</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{lote.notes || 'Sin notas adicionales.'}</dd>
                            </div>
                        </div>

                        {/* Recent Activity Placeholder */}
                        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Actividad Reciente</h3>
                            <p className="text-gray-500 dark:text-gray-400 italic">Work in progress...</p>
                        </div>
                    </div>

                    {/* Sidebar: Tasks & Actions */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <CheckListIcon className="h-5 w-5 text-primary-500" />
                                Tareas Relacionadas
                            </h3>

                            {lote.tasks && lote.tasks.length > 0 ? (
                                <ul className="space-y-3">
                                    {lote.tasks.map(task => (
                                        <li key={task.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-100 dark:border-gray-700">
                                            <div className="flex justify-between items-start">
                                                <span className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                    {task.title}
                                                </span>
                                                <span className={`text-xs px-1.5 py-0.5 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                                <span>{task.due_date}</span>
                                                <span>{task.assigned_to?.name}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No hay tareas generadas.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
