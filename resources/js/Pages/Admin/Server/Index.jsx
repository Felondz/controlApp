import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { 
    ServerIcon, 
    DocumentTextIcon, 
    ArchiveBoxIcon, 
    ArrowTopRightOnSquareIcon,
    CpuChipIcon,
    CircleStackIcon,
    ComputerDesktopIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, stats, pulseUrl }) {
    const { t } = useTranslate();

    const statCards = [
        { 
            name: 'CPU Load', 
            value: stats.cpu, 
            icon: CpuChipIcon, 
            color: 'bg-blue-500/10 text-blue-500' 
        },
        { 
            name: 'Memory', 
            value: stats.memory, 
            icon: CircleStackIcon, 
            color: 'bg-purple-500/10 text-purple-500' 
        },
        { 
            name: 'Disk Usage', 
            value: stats.disk, 
            icon: ComputerDesktopIcon, 
            color: 'bg-emerald-500/10 text-emerald-500' 
        },
        { 
            name: 'OS', 
            value: stats.os, 
            icon: ServerIcon, 
            color: 'bg-amber-500/10 text-amber-500' 
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Server Administration</h2>}
        >
            <Head title="Server Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((stat) => (
                            <div key={stat.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700 p-6">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-xl ${stat.color} mr-4`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Pulse Card */}
                        <a 
                            href={pulseUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 text-white"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                                    <ArrowTopRightOnSquareIcon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium px-2 py-1 bg-white/20 rounded-full">Real-time</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Laravel Pulse</h3>
                            <p className="text-indigo-100 text-sm mb-4">Monitorea el rendimiento del servidor, colas y queries lentas en tiempo real.</p>
                            <div className="flex items-center text-sm font-semibold">
                                Abrir Panel <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
                            </div>
                        </a>

                        {/* Logs Card */}
                        <Link 
                            href={route('admin.server.logs')}
                            className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                                    <DocumentTextIcon className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Explorador de Logs</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Visualiza, descarga en formato IA (JSON) y limpia los logs del sistema.</p>
                            <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                                Gestionar Logs <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>

                        {/* Backups Card */}
                        <Link 
                            href={route('admin.server.backups')}
                            className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                                    <ArchiveBoxIcon className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Copias de Seguridad</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Realiza backups manuales de la base de datos y gestiona los archivos históricos.</p>
                            <div className="flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                Gestionar Backups <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
