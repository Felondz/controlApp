import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { 
    ArchiveBoxIcon, 
    ArrowDownTrayIcon, 
    TrashIcon, 
    PlusIcon,
    ChevronLeftIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Backups({ auth, backups }) {
    const { t } = useTranslate();

    const runBackup = () => {
        router.post(route('admin.server.backups.run'), {}, {
            onSuccess: () => alert('El backup de la base de datos se ha iniciado en segundo plano. Refresca en unos segundos.'),
        });
    };

    const deleteBackup = (filename) => {
        if (confirm(`¿Estás seguro de eliminar el backup ${filename}?`)) {
            router.delete(route('admin.server.backups.delete', filename));
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
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Gestión de Backups</h2>
                </div>
            }
        >
            <Head title="Server Backups" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Copias de Seguridad</h3>
                            <p className="text-gray-500 dark:text-gray-400">Protege tu información realizando copias manuales periódicas.</p>
                        </div>
                        <button 
                            onClick={runBackup}
                            className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Nuevo Backup (DB)
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {backups.map((backup) => (
                                    <div key={backup.name} className="bg-gray-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500 transition-all group">
                                        <div className="flex items-center mb-4">
                                            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl mr-4">
                                                <ArchiveBoxIcon className="w-6 h-6" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-gray-900 dark:text-white truncate" title={backup.name}>
                                                    {backup.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                    <ClockIcon className="w-3 h-3 mr-1" />
                                                    {backup.created}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                                            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{backup.size}</span>
                                            <div className="flex space-x-2">
                                                <a 
                                                    href={route('admin.server.backups.download', backup.name)}
                                                    className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    title="Descargar"
                                                >
                                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                                </a>
                                                <button 
                                                    onClick={() => deleteBackup(backup.name)}
                                                    className="p-2 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-lg border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {backups.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
                                        No hay copias de seguridad disponibles.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
