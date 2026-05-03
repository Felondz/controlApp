import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { ClockIcon } from '@/Components/Icons';
import PrimaryButton from '@/Components/PrimaryButton';

export default function SessionExpiredModal({ show }) {
    const { t } = useTranslate();

    const handleLogin = () => {
        window.location.href = '/login';
    };

    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => { }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto overflow-x-hidden scrollbar-thin">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                                            <ClockIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                                {t('auth.session_expired', 'Sesión Expirada')}
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('auth.session_expired_desc', 'Tu sesión ha terminado debido a inactividad. Por favor, inicia sesión nuevamente para continuar.')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <PrimaryButton
                                        onClick={handleLogin}
                                        className="w-full sm:w-auto sm:ml-3"
                                    >
                                        {t('auth.login_again', 'Iniciar Sesión')}
                                    </PrimaryButton>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
