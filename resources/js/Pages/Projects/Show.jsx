// resources/js/Pages/Projects/Show.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';
import { useTranslate } from '@/hooks/useTranslate';
import { CurrencyDollarIcon, CheckListIcon, UserCircleIcon } from '@/Components/Icons';
import SummaryCard from '@/Components/Dashboard/SummaryCard';

// Este componente recibe el objeto 'proyecto' de Laravel
export default function Show({ auth, proyecto, isAdmin }) {
    const t = useTranslate();

    // 💡 Título para la página
    const headerTitle = `${proyecto.nombre} | ${t('dashboard.title')}`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">{proyecto.nombre}</h2>}
            project={proyecto}
        >
            <Head title={headerTitle} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Título y Moneda */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('projects.overview')}
                    </h3>

                    {proyecto.descripcion ? (
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {proyecto.descripcion}
                        </p>
                    ) : (
                        <p className="text-gray-400 dark:text-gray-500 mb-6 italic">
                            {t('projects.no_description', 'No description provided.')}
                        </p>
                    )}
                    {/* DASHBOARD DE RESUMEN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Tarjeta de Resumen Financiero */}
                        {proyecto.modules?.includes('finance') && (
                            <SummaryCard
                                title={t('finance.summary_title', 'Resumen Financiero')}
                                icon={CurrencyDollarIcon}
                                color="primary"
                                label={isAdmin ? `${t('finance.balance', 'Balance Total')} (${proyecto.moneda_default})` : null}
                                value={isAdmin
                                    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: proyecto.moneda_default }).format(1500)
                                    : t('finance.restricted_access')
                                }
                                action={isAdmin ? {
                                    label: t('common.view_details', 'Ver detalles'),
                                    href: route('mis-proyectos.finance', proyecto.id)
                                } : null}
                                className={!isAdmin ? "italic text-sm" : ""}
                            />
                        )}

                        {/* Tarjeta de Tareas (Placeholder) */}
                        {proyecto.modules?.includes('tasks') && (
                            <SummaryCard
                                title={t('tasks.summary_title', 'Gestión de Tareas')}
                                icon={CheckListIcon}
                                color="primary"
                                label={t('tasks.pending', 'Tareas Pendientes')}
                                value="0"
                                action={{
                                    label: t('common.coming_soon', 'Próximamente'),
                                    disabled: true
                                }}
                            />
                        )}

                        {/* Tarjeta de Miembros */}
                        <SummaryCard
                            title={t('members.summary_title', 'Equipo del Proyecto')}
                            icon={UserCircleIcon}
                            color="primary"
                            label={t('members.total', 'Total Miembros')}
                            value="1" // TODO: Count real members
                            action={{
                                label: t('common.manage', 'Gestionar'),
                                disabled: true
                            }}
                        />

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}