import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { CurrencyDollarIcon } from '@/Components/Icons';
import SummaryCard from '@/Components/Dashboard/SummaryCard';

export default function PersonalOverview({ auth, proyecto, isAdmin }) {
    const { t } = useTranslate();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">
                    {t('finance.personal_finance')}
                </h2>
            }
            project={proyecto}
        >
            <Head title={t('finance.personal_finance')} />

            <div className="max-w-7xl mx-auto">
                <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                    {t('projects.overview')}
                </h3>

                {proyecto.descripcion && (
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {proyecto.descripcion}
                    </p>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                    <SummaryCard
                        title={t('finance.dashboard_title', 'Panel Financiero')}
                        icon={CurrencyDollarIcon}
                        color="primary"
                        label={t('finance.dashboard_subtitle', 'Gestiona tus cuentas y transacciones')}
                        action={{
                            label: t('common.view_details', 'Ver detalles'),
                            href: route('mis-proyectos.finance', proyecto.id)
                        }}
                    />
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
