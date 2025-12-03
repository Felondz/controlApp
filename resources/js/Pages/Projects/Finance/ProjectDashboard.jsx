import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AccountModal from '@/Components/Finance/Modals/AccountModal';
import LinkAccountModal from '@/Components/Finance/Modals/LinkAccountModal';
import TransactionModal from '@/Components/Finance/Modals/TransactionModal';
import PaymentConfirmationModal from '@/Components/Finance/Modals/PaymentConfirmationModal';
import AccountChart from '@/Components/Finance/AccountChart';
import DashboardSettingsModal from '@/Components/Finance/Modals/DashboardSettingsModal';
import BalanceSummaryWidget from '@/Components/Finance/Widgets/BalanceSummaryWidget';
import SavingsGoalWidget from '@/Components/Finance/Widgets/SavingsGoalWidget';
import CreditSimulationWidget from '@/Components/Finance/Widgets/CreditSimulationWidget';
import UpcomingObligationsWidget from '@/Components/Finance/Widgets/UpcomingObligationsWidget';
import FinancialChartsWidget from '@/Components/Finance/Widgets/FinancialChartsWidget';
import { PlusIcon, CurrencyDollarIcon, PencilIcon, TrashIcon, LinkIcon, Cog6ToothIcon } from '@/Components/Icons';

// ... (existing imports)

export default function Dashboard({ auth, proyecto, isAdmin, transacciones = [], financialTasks = [] }) {
    const { t } = useTranslate();
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showLinkAccountModal, setShowLinkAccountModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const [showInactive, setShowInactive] = useState(false);

    // Widget Settings (Default to true if not set)
    const widgets = {
        balance_summary: true,
        savings_goal: true,
        credit_simulation: true,
        upcoming_obligations: true,
        financial_charts: true,
        ...(proyecto.settings?.widgets || {})
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: proyecto.moneda_default,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(monto);
    };

    const headerTitle = t('finance.dashboard', 'Panel Financiero');

    const handleCreateAccount = () => {
        setSelectedAccount(null);
        setShowAccountModal(true);
    };

    const handleEditAccount = (account) => {
        setSelectedAccount(account);
        setShowAccountModal(true);
    };

    const handleLinkAccount = () => {
        setShowLinkAccountModal(true);
    };

    const handleUnlinkAccount = (account) => {
        if (confirm(t('finance.confirm_unlink_account', '¿Estás seguro de que quieres desvincular esta cuenta?'))) {
            router.delete(route('finance.accounts.unlink', { account: account.id }), {
                onSuccess: () => {
                    router.reload({ only: ['proyecto'] });
                },
                onError: (errors) => {
                    console.error('Error unlinking account:', errors);
                    alert(t('finance.unlink_error', 'Error al desvincular la cuenta.'));
                }
            });
        }
    };

    const handleCreateTransaction = () => {
        setSelectedTransaction(null);
        setShowTransactionModal(true);
    };

    const handleEditTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setShowTransactionModal(true);
    };

    const handleDeleteTransaction = (transaction) => {
        if (confirm(t('finance.confirm_delete_transaction', '¿Estás seguro de que quieres eliminar esta transacción?'))) {
            router.delete(route('finance.transactions.destroy', { transaction: transaction.id }), {
                onSuccess: () => {
                    router.reload({ only: ['transacciones'] });
                },
                onError: (errors) => {
                    console.error('Error deleting transaction:', errors);
                    alert(t('finance.delete_transaction_error', 'Error al eliminar la transacción.'));
                }
            });
        }
    };

    const handleAccountSuccess = () => {
        setShowAccountModal(false);
        setSelectedAccount(null);
        router.reload({ only: ['proyecto'] });
    };

    const handleLinkAccountSuccess = () => {
        setShowLinkAccountModal(false);
        router.reload({ only: ['proyecto'] });
    };

    const handleTransactionSuccess = () => {
        setShowTransactionModal(false);
        setSelectedTransaction(null);
        router.reload({ only: ['transacciones', 'proyecto'] });
    };

    const handleSettingsSave = (newSettings) => {
        router.put(route('finance.projects.update-settings', { project: proyecto.id }), { settings: newSettings }, {
            onSuccess: () => {
                setShowSettingsModal(false);
                router.reload({ only: ['proyecto'] });
            },
            onError: (errors) => {
                console.error('Error saving settings:', errors);
                alert(t('finance.save_settings_error', 'Error al guardar la configuración.'));
            }
        });
    };

    const handleMarkAsPaid = (task) => {
        setSelectedTask(task);
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        setSelectedTask(null);
        router.reload({ only: ['transacciones', 'proyecto', 'financialTasks'] });
    };

    const allAccounts = [...(proyecto.cuentas || []), ...(proyecto.cuentas_asociadas || [])];

    const filteredAccounts = allAccounts.filter(cuenta => {
        if (showInactive) {
            return cuenta.estado === 'inactiva';
        }
        return cuenta.estado === 'activa';
    }).filter(cuenta => cuenta.proyecto_id === proyecto.id); // Only project's own accounts

    const linkedAccounts = allAccounts.filter(cuenta => {
        if (showInactive) {
            return cuenta.estado === 'inactiva';
        }
        return cuenta.estado === 'activa';
    }).filter(cuenta => cuenta.proyecto_id !== proyecto.id); // Only linked accounts

    const transaccionesPorCuenta = transacciones.reduce((acc, trans) => {
        if (!acc[trans.cuenta_id]) {
            acc[trans.cuenta_id] = [];
        }
        acc[trans.cuenta_id].push(trans);
        return acc;
    }, {});

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{headerTitle}</h2>}
        >
            <Head title={headerTitle} />

            <div className="py-6 pb-20 md:pb-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header Section */}
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {t('finance.dashboard_title', 'Panel Financiero')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('finance.dashboard_subtitle', 'Gestiona tus cuentas y transacciones')}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Toggle Inactive Accounts */}
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={showInactive}
                                    onChange={() => setShowInactive(!showInactive)}
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 hidden sm:inline-block">
                                    {showInactive ? t('finance.hide_inactive', 'Ocultar Inactivas') : t('finance.show_inactive', 'Mostrar Inactivas')}
                                </span>
                            </label>

                            {/* Settings Button */}
                            {isAdmin && (
                                <button
                                    onClick={() => setShowSettingsModal(true)}
                                    className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title={t('finance.customize_dashboard', 'Personalizar Panel')}
                                >
                                    <Cog6ToothIcon className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Widgets Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {widgets.balance_summary && (
                            <BalanceSummaryWidget
                                accounts={[...(proyecto.cuentas || []), ...(proyecto.cuentas_asociadas || [])]}
                                currency={proyecto.moneda_default}
                            />
                        )}
                        {widgets.savings_goal && (
                            <SavingsGoalWidget currency={proyecto.moneda_default} />
                        )}
                        {widgets.credit_simulation && (
                            <CreditSimulationWidget currency={proyecto.moneda_default} />
                        )}
                        {widgets.upcoming_obligations && (
                            <UpcomingObligationsWidget
                                events={transacciones.map(t => ({
                                    id: t.id,
                                    title: t.descripcion || t.categoria?.nombre,
                                    date: t.fecha,
                                    amount: t.monto,
                                    type: t.categoria?.tipo,
                                    status: 'pending' // Default status for now
                                }))}
                                financialTasks={financialTasks}
                                currency={proyecto.moneda_default}
                                onMarkAsPaid={isAdmin ? handleMarkAsPaid : null}
                            />
                        )}
                    </div>

                    {/* Charts Section */}
                    {widgets.financial_charts && (
                        <div className="mb-8">
                            <FinancialChartsWidget
                                transactions={transacciones}
                                currency={proyecto.moneda_default}
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    {isAdmin && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <PrimaryButton
                                onClick={handleCreateAccount}
                                className="flex items-center justify-center gap-2"
                            >
                                <PlusIcon className="h-5 w-5" />
                                {t('finance.create_account', 'Crear Cuenta')}
                            </PrimaryButton>
                            <SecondaryButton
                                onClick={handleLinkAccount}
                                className="flex items-center justify-center gap-2"
                            >
                                <LinkIcon className="h-5 w-5" />
                                {t('finance.link_account', 'Vincular Cuenta')}
                            </SecondaryButton>
                            <PrimaryButton
                                onClick={handleCreateTransaction}
                                className="flex items-center justify-center gap-2"
                            >
                                <PlusIcon className="h-5 w-5" />
                                {t('finance.create_transaction', 'Crear Transacción')}
                            </PrimaryButton>
                        </div>
                    )}

                    {/* Accounts Section with Charts */}
                    {isAdmin ? (
                        <>
                            {/* Project Accounts */}
                            {filteredAccounts.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        {t('finance.project_accounts', 'Cuentas del Proyecto')}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                        {filteredAccounts.map((cuenta) => {
                                            const cuentaTransacciones = transaccionesPorCuenta[cuenta.id] || [];
                                            return (
                                                <div key={cuenta.id} className="relative group">
                                                    <AccountChart
                                                        cuenta={cuenta}
                                                        transacciones={cuentaTransacciones}
                                                    />
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                        <button
                                                            onClick={() => handleEditAccount(cuenta)}
                                                            className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                                                            title={t('common.edit', 'Editar')}
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Linked Accounts */}
                            {linkedAccounts.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <LinkIcon className="h-5 w-5 text-primary-600" />
                                        {t('finance.linked_accounts', 'Cuentas Vinculadas')}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                        {linkedAccounts.map((cuenta) => {
                                            const cuentaTransacciones = transaccionesPorCuenta[cuenta.id] || [];
                                            return (
                                                <div key={cuenta.id} className="relative group">
                                                    <AccountChart
                                                        cuenta={cuenta}
                                                        transacciones={cuentaTransacciones}
                                                    />
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                        <button
                                                            onClick={() => handleUnlinkAccount(cuenta)}
                                                            className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                                            title={t('finance.unlink', 'Desvincular')}
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {filteredAccounts.length === 0 && linkedAccounts.length === 0 && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-12 text-center">
                                    <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {showInactive
                                            ? t('finance.no_inactive_accounts', 'No hay cuentas inactivas')
                                            : t('finance.no_active_accounts', 'No hay cuentas activas')
                                        }
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        {showInactive
                                            ? t('finance.check_active', 'Revisa tus cuentas activas')
                                            : t('finance.create_first_account', 'Crea tu primera cuenta para comenzar')
                                        }
                                    </p>
                                    {!showInactive && (
                                        <div className="flex justify-center gap-4">
                                            <PrimaryButton onClick={handleCreateAccount}>
                                                {t('finance.create_account', 'Crear Cuenta')}
                                            </PrimaryButton>
                                            <SecondaryButton onClick={handleLinkAccount}>
                                                {t('finance.link_account', 'Vincular Cuenta')}
                                            </SecondaryButton>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Recent Transactions */}
                            {transacciones.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            {t('finance.recent_transactions', 'Transacciones Recientes')}
                                        </h3>
                                        <div className="space-y-2">
                                            {transacciones.slice(0, 20).map((trans) => (
                                                <div
                                                    key={trans.id}
                                                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {trans.descripcion || t('finance.no_description', 'Sin descripción')}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {trans.cuenta?.nombre} • {trans.categoria?.nombre} • {new Date(trans.fecha).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <span className={`text-sm font-semibold whitespace-nowrap ${trans.categoria?.tipo === 'ingreso'
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                            }`}>
                                                            {trans.categoria?.tipo === 'ingreso' ? '+' : '-'}
                                                            {formatMonto(trans.monto)}
                                                        </span>
                                                        {trans.user_id === auth.user.id && (
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={() => handleEditTransaction(trans)}
                                                                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                                                                    aria-label={t('common.edit', 'Editar')}
                                                                >
                                                                    <PencilIcon className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteTransaction(trans)}
                                                                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                                                    aria-label={t('common.delete', 'Eliminar')}
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                                {t('finance.restricted_access', 'No tienes permisos para ver la información financiera de este proyecto.')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {isAdmin && (
                <>
                    <AccountModal
                        show={showAccountModal}
                        onClose={() => {
                            setShowAccountModal(false);
                            setSelectedAccount(null);
                        }}
                        account={selectedAccount}
                        proyectoId={proyecto.id}
                        onSuccess={handleAccountSuccess}
                    />

                    <LinkAccountModal
                        show={showLinkAccountModal}
                        onClose={() => setShowLinkAccountModal(false)}
                        project={proyecto}
                    />

                    <TransactionModal
                        show={showTransactionModal}
                        onClose={() => {
                            setShowTransactionModal(false);
                            setSelectedTransaction(null);
                        }}
                        transaction={selectedTransaction}
                        proyectoId={proyecto.id}
                        proyectos={[]}
                        cuentas={[...(proyecto.cuentas || []), ...(proyecto.cuentas_asociadas || [])]}
                        categorias={proyecto.categorias || []}
                        onSuccess={handleTransactionSuccess}
                    />

                    <DashboardSettingsModal
                        show={showSettingsModal}
                        onClose={() => setShowSettingsModal(false)}
                        project={proyecto}
                    />

                    <PaymentConfirmationModal
                        show={showPaymentModal}
                        onClose={() => {
                            setShowPaymentModal(false);
                            setSelectedTask(null);
                        }}
                        task={selectedTask}
                        proyectoId={proyecto.id}
                        cuentas={[...(proyecto.cuentas || []), ...(proyecto.cuentas_asociadas || [])]}
                        categorias={proyecto.categorias || []}
                        onSuccess={handlePaymentSuccess}
                    />
                </>
            )}
        </AuthenticatedLayout>
    );
}
