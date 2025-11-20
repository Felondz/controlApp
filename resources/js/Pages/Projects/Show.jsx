// resources/js/Pages/Projects/Show.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslate } from '@/hooks/useTranslate';
import AccountsList from '@/Components/Finance/Accounts/AccountsList';

// Este componente recibe el objeto 'proyecto' de Laravel
export default function Show({ auth, proyecto }) {
    const t = useTranslate();

    // 💡 Título para la página
    const headerTitle = `${proyecto.nombre} | ${t('dashboard.title')}`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{proyecto.nombre}</h2>}
        >
            <Head title={headerTitle} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Título y Moneda */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('projects.overview')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t('projects.currency')}: {proyecto.moneda_default}
                    </p>

                    {/* MÓDULO PRINCIPAL DE CUENTAS E INFORMACIÓN FINANCIERA */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <h4 className="text-xl font-semibold mb-4">{t('finance.accounts')}</h4>
                        <AccountsList cuentas={proyecto.cuentas || []}
                            proyectoId={proyecto.id} />

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}