import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { 
    DocumentTextIcon, 
    ArrowDownTrayIcon, 
    TrashIcon, 
    SparklesIcon,
    ChevronLeftIcon
} from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Logs({ auth, logs }) {
    const { t } = useTranslate();

    const deleteLog = (filename) => {
        if (confirm(`¿Estás seguro de eliminar el log ${filename}? Esta acción no se puede deshacer.`)) {
            router.delete(route('admin.server.logs.delete', filename));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => window.history.back()}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Explorador de Logs</h2>
                </div>
            }
        >
            <Head title="Server Logs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Archivos de Log</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Descarga los logs para alimentar a tu IA o para depuración manual.</p>
                                </div>
                                <SparklesIcon className="w-6 h-6 text-amber-500 animate-pulse" />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-900/50">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider rounded-l-xl">Archivo</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tamaño</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Última Modificación</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right rounded-r-xl">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {logs.map((log) => (
                                            <tr key={log.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-3" />
                                                        <span className="font-medium text-gray-900 dark:text-gray-200">{log.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.size}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.modified}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    {/* Botón Normal */}
                                                    <a 
                                                        href={route('admin.server.logs.download', log.name)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                        title="Descargar Original"
                                                    >
                                                        <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" />
                                                        LOG
                                                    </a>
                                                    
                                                    {/* Botón IA (JSON) */}
                                                    <a 
                                                        href={`${route('admin.server.logs.download', log.name)}?format=json`}
                                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-800"
                                                        title="Descargar Formato IA (JSON)"
                                                    >
                                                        <SparklesIcon className="w-4 h-4 mr-1.5" />
                                                        IA JSON
                                                    </a>

                                                    <button 
                                                        onClick={() => deleteLog(log.name)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {logs.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 italic">
                                                    No se encontraron archivos de log.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
