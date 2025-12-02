import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ChatWidget from '@/Components/Project/ChatWidget';
import { useTranslate } from '@/Hooks/useTranslate';
import { ChatIcon } from '@/Components/Icons';

export default function Chat({ auth, proyecto }) {
    const { t } = useTranslate();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <ChatIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">
                        {proyecto.nombre} - {t('modules.chat', 'Chat')}
                    </h2>
                </div>
            }
            project={proyecto}
        >
            <Head title={`${proyecto.nombre} - Chat`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ChatWidget project={proyecto} user={auth.user} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
