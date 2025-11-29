import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CalendarIcon, CalculatorIcon } from '@/Components/Icons';
import { useTranslate } from '@/Hooks/useTranslate';
import { Link } from '@inertiajs/react';

export default function ToolsSheet({ isOpen, onClose }) {
    const { t } = useTranslate();

    const tools = [
        {
            name: t('dashboard.calendar', 'Calendario'),
            icon: CalendarIcon,
            route: 'dashboard', // TODO: Update when calendar is implemented
            disabled: true,
        },
        {
            name: t('dashboard.calculator', 'Calculadora Financiera'),
            icon: CalculatorIcon,
            route: 'tools.calculator',
            disabled: false,
        },
    ];

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                {/* Backdrop */}
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

                {/* Sheet */}
                <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-out duration-200"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transform transition ease-in duration-150"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                >
                    <Dialog.Panel className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl max-h-[80vh] overflow-hidden">
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        </div>

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t('dashboard.tools', 'Herramientas')}
                            </Dialog.Title>
                        </div>

                        {/* Tools List */}
                        <div className="px-4 py-6 space-y-3 overflow-y-auto max-h-[60vh]">
                            {tools.map((tool) => {
                                const Icon = tool.icon;

                                if (tool.disabled) {
                                    return (
                                        <button
                                            key={tool.name}
                                            disabled
                                            className="w-full flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 opacity-50 cursor-not-allowed"
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <Icon className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {tool.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {t('common.coming_soon', 'Próximamente')}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={tool.name}
                                        href={route(tool.route)}
                                        onClick={onClose}
                                        className="w-full flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                            <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {tool.name}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
