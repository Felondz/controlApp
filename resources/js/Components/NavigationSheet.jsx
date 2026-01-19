import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import {
    CalendarIcon,
    CalculatorIcon,
    CurrencyDollarIcon,
    CheckListIcon,
    UserCircleIcon,
    EllipsisVerticalIcon,
    PuzzleIcon,
    ChatIcon,
    FactoryIcon
} from '@/Components/Icons';

export default function NavigationSheet({ isOpen, onClose, user, project = null }) {
    const { t } = useTranslate();
    const enabledTools = user?.enabled_tools || [];
    const modules = project?.modules || [];

    const projectItems = project ? [
        {
            name: t('modules.finance', 'Finanzas'),
            icon: CurrencyDollarIcon,
            route: 'mis-proyectos.finance',
            routeParams: project.id,
            show: modules.includes('finance'),
        },
        {
            name: t('modules.tasks', 'Tareas'),
            icon: CheckListIcon,
            route: 'mis-proyectos.tasks.index',
            routeParams: { proyecto: project.id },
            disabled: false,
            show: modules.includes('tasks'),
        },
        {
            name: t('modules.chat.title', 'Chat'),
            icon: ChatIcon,
            route: 'mis-proyectos.chat',
            routeParams: project.id,
            show: modules.includes('chat') && !project.es_personal,
            badge: project.unread_messages_count
        },
        {
            name: t('projects.members', 'Miembros'),
            icon: UserCircleIcon,
            route: 'project.members.index',
            routeParams: project.id,
            disabled: false,
            show: !project.es_personal && project.es_personal !== 1,
        },
        {
            name: t('projects.project_settings', 'Configuración'),
            icon: EllipsisVerticalIcon,
            route: 'mis-proyectos.edit',
            routeParams: project.id,
            show: !project.es_personal,
        },
        {
            name: t('operations.title', 'Operaciones'),
            icon: FactoryIcon, // Ensure FactoryIcon is imported
            route: 'operations.lotes.index',
            routeParams: project.id,
            show: modules.includes('operations'),
        },
    ] : [];

    const globalItems = [
        {
            name: t('dashboard.marketplace', 'Mercado'),
            icon: PuzzleIcon,
            route: 'tools.index',
            show: true,
        },
        {
            name: t('dashboard.calendar', 'Calendario'),
            icon: CalendarIcon,
            route: 'dashboard', // TODO: Update when calendar is implemented
            disabled: true,
            show: enabledTools.includes('calendar'),
        },
        {
            name: t('dashboard.calculator', 'Calculadora'),
            icon: CalculatorIcon,
            route: 'tools.calculator',
            show: enabledTools.includes('financial-calculator'),
        },
    ];

    const renderItem = (item) => {
        if (!item.show) return null;

        const Icon = item.icon;

        if (item.disabled) {
            return (
                <button
                    key={item.name}
                    disabled
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 opacity-50 cursor-not-allowed"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 text-center">{item.name}</span>
                </button>
            );
        }

        return (
            <Link
                key={item.name}
                href={route(item.route, item.routeParams)}
                onClick={onClose}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors relative"
            >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <Icon className="h-5 w-5" />
                </div>
                {item.badge > 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                        {item.badge > 99 ? '99+' : item.badge}
                    </span>
                )}
                <span className="text-xs font-medium text-gray-900 dark:text-gray-200 text-center">{item.name}</span>
            </Link>
        );
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-out duration-200"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transform transition ease-in duration-150"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                >
                    <Dialog.Panel className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
                        <div className="flex justify-center pt-3 pb-2 shrink-0">
                            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {project && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                                        {project.nombre}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {projectItems.map(renderItem)}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                                    {t('dashboard.tools', 'Herramientas')}
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {globalItems.map(renderItem)}
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
