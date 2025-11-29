import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import AccountsList from '@/Components/Finance/Accounts/AccountsList';

export default function Dashboard({ auth, proyecto, isAdmin }) {
    const { t } = useTranslate();

    const headerTitle = `${t('modules.finance')} | ${proyecto.nombre}`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">{t('modules.finance')}</h2>}
            project={proyecto}
        >
            <Head title={headerTitle} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('finance.dashboard_title', 'Panel Financiero')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('finance.dashboard_subtitle', 'Gestiona tus cuentas y transacciones')}
                        </p>
                    </div>

                    {/* Accounts Section */}
                    {isAdmin ? (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
                            <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                {t('finance.accounts')}
                            </h4>
                            <AccountsList
                                cuentas={proyecto.cuentas || []}
                                proyectoId={proyecto.id}
                            />
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                                {t('finance.restricted_access', 'No tienes permisos para ver la información financiera de este proyecto.')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
