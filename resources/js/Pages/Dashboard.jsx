import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { Cog6ToothIcon } from '@/Components/Icons';
import DraggableProjectGrid from '@/Components/Dashboard/DraggableProjectGrid';
import WidgetSettingsModal from '@/Components/Dashboard/WidgetSettingsModal';
import { useState } from 'react';

export default function Dashboard({ auth, proyectos = [] }) {
    const { t } = useTranslate();
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const dashboardData = {
        projects: proyectos
    };

    const handleSettingsSave = (newSettings) => {
        router.post(
            route('preferences.dashboard.update'),
            { settings: newSettings },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowSettingsModal(false);
                },
                onError: (errors) => {
                    console.error('Error saving settings:', errors);
                }
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">
                            {t('dashboard.title')}
                        </h2>
                    </div>
                    <button
                        onClick={() => setShowSettingsModal(true)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        title={t('dashboard.customize')}
                    >
                        <Cog6ToothIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('dashboard.customize', 'Personalizar')}</span>
                    </button>
                </div>
            }
        >
            <Head title={t('dashboard.title')} />

            <div className="py-12">
                <div className="max-w-[1920px] mx-auto sm:px-6 lg:px-8">
                    <DraggableProjectGrid
                        user={auth.user}
                        projects={proyectos}
                        settingsKey="global_dashboard"
                    />
                </div>
            </div>

            <WidgetSettingsModal
                show={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                project={null} // Global context, no project
                user={auth.user} // Pass user for settings reading if needed inside modal (though modal usually gets settings from project prop, we might need to adjust it)
                isAdmin={true} // User is admin of their own dashboard
                onSave={handleSettingsSave}
                settingsKey="global_dashboard"
            />
        </AuthenticatedLayout >
    );
}