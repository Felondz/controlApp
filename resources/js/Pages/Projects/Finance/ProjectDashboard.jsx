import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AccountModal from '@/Components/Finance/Modals/AccountModal';
import AccountAdminModal from '@/Components/Finance/Modals/AccountAdminModal';
import LinkAccountModal from '@/Components/Finance/Modals/LinkAccountModal';
import QuickTransactionModal from '@/Components/Finance/Modals/QuickTransactionModal';
import AccountDetailsModal from '@/Components/Finance/Modals/AccountDetailsModal';
import BillModal from '@/Components/Finance/Modals/BillModal';
import PaymentConfirmationModal from '@/Components/Finance/Modals/PaymentConfirmationModal';
import AccountChart from '@/Components/Finance/AccountChart';
import DashboardSettingsModal from '@/Components/Finance/Modals/DashboardSettingsModal';
import DeleteAccountModal from '@/Components/Finance/Modals/DeleteAccountModal';
import BalanceSummaryWidget from '@/Components/Finance/Widgets/BalanceSummaryWidget';
import TransactionsWidget from '@/Components/Finance/Widgets/TransactionsWidget';
import SavingsGoalWidget from '@/Components/Finance/Widgets/SavingsGoalWidget';
import CreditSimulationWidget from '@/Components/Finance/Widgets/CreditSimulationWidget';
import UpcomingObligationsWidget from '@/Components/Finance/Widgets/UpcomingObligationsWidget';
import BillsWidget from '@/Components/Finance/Widgets/BillsWidget';
import FinancialChartsWidget from '@/Components/Finance/Widgets/FinancialChartsWidget';
import AccountFlowWidget from '@/Components/Finance/Widgets/AccountFlowWidget';
import { PlusIcon, CurrencyDollarIcon, PencilIcon, TrashIcon, LinkIcon, Cog6ToothIcon, BoltIcon } from '@/Components/Icons';

// ... (existing imports)

export default function Dashboard({ auth, proyecto, isAdmin, transacciones = [], financialTasks = [], pendingBills = [] }) {
    const { t } = useTranslate();
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showAccountAdminModal, setShowAccountAdminModal] = useState(false);
    const [showLinkAccountModal, setShowLinkAccountModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showBillModal, setShowBillModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [initialAccountId, setInitialAccountId] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null);
    const [transactionType, setTransactionType] = useState('expense'); // 'income' or 'expense'

    const [showInactive, setShowInactive] = useState(false);

    // Widget Settings (Default to true if not set)
    const widgets = {
        balance_summary: true,
        savings_goal: true,
        credit_simulation: true,
        upcoming_obligations: true,
        financial_charts: true,
        account_flow: true,
        pending_bills: true,
        transactions: true,
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
        if (!isAdmin) return;
        setSelectedAccount(account);
        setShowAccountAdminModal(true);
    };

    const handleLinkAccount = () => {
        setShowLinkAccountModal(true);
    };

    const handleUnlinkAccount = (account) => {
        // Personal Finance should never have linked accounts
        if (proyecto.es_personal) {
            return;
        }

        if (confirm(t('finance.confirm_unlink_account', '¿Estás seguro de que quieres desvincular esta cuenta?'))) {
            router.delete(`/api/proyectos/${proyecto.id}/cuentas/${account.id}/unlink`, {
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

    const handleCardClick = (account) => {
        setSelectedAccount(account);
        setShowAccountDetailsModal(true);
    };

    const handleCreateTransaction = () => {
        setSelectedTransaction(null);
        setInitialAccountId(null);
        setShowTransactionModal(true);
    };

    const handleCreateTransactionFromAccount = (account) => {
        setSelectedTransaction(null);
        setInitialAccountId(account.id);
        setShowTransactionModal(true);
    };

    const handleCreateBill = () => {
        setSelectedBill(null);
        setShowBillModal(true);
    };

    const handleEditBill = (bill) => {
        setSelectedBill(bill);
        setShowBillModal(true);
    };

    const handlePayBill = (bill) => {
        // Paying a bill means opening Transaction Modal in Expense mode with Bill data
        setSelectedTransaction(bill); // Pass bill as transaction to pre-fill
        setInitialAccountId(null);
        setShowTransactionModal(true);
    };

    const handleEditTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setShowTransactionModal(true);
    };

    const handleDeleteTransaction = (transaction) => {
        if (confirm(t('finance.confirm_delete_transaction', '¿Estás seguro de que quieres eliminar esta transacción?'))) {
            router.delete(route('finance.transactions.destroy', { proyecto: proyecto.id, transaccion: transaction.id }), {
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
        router.reload({ only: ['transacciones', 'proyecto', 'pendingBills'] });
    };

    const handleBillSuccess = () => {
        setShowBillModal(false);
        setSelectedBill(null);
        router.reload({ only: ['pendingBills', 'proyecto'] });
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

    const handleAddIncome = () => {
        if (!isAdmin) return;
        setTransactionType('income');
        setSelectedTransaction(null);
        setShowTransactionModal(true);
    };

    const handleAddExpense = () => {
        if (!isAdmin) return;
        setTransactionType('expense');
        setSelectedTransaction(null);
        setShowTransactionModal(true);
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
            project={proyecto}
        >
            <Head title={headerTitle} />

            <div className="py-6 pb-20 md:pb-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
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
                                        className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                        title={t('finance.customize_dashboard', 'Personalizar Panel')}
                                    >
                                        <Cog6ToothIcon className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons - SVG Style */}
                        {isAdmin && (
                            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                                {/* Add Income */}
                                <button
                                    onClick={handleAddIncome}
                                    className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 hover:bg-success-100 dark:hover:bg-success-900/30 transition-all hover:shadow-md border-2 border-transparent hover:border-success-500 dark:hover:border-success-600"
                                    aria-label={t('finance.add_income', 'Agregar Ingreso')}
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    <span className="text-xs font-medium">{t('finance.income', 'Ingreso')}</span>
                                </button>

                                {/* Add Expense */}
                                <button
                                    onClick={handleAddExpense}
                                    className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-all hover:shadow-md border-2 border-transparent hover:border-danger-500 dark:hover:border-danger-600"
                                    aria-label={t('finance.add_expense', 'Agregar Gasto')}
                                >
                                    <CurrencyDollarIcon className="h-5 w-5" />
                                    <span className="text-xs font-medium">{t('finance.expense', 'Gasto')}</span>
                                </button>

                                {/* Add Bill */}
                                <button
                                    onClick={handleCreateBill}
                                    className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all hover:shadow-md border-2 border-transparent hover:border-primary-500 dark:hover:border-primary-600"
                                    aria-label={t('finance.add_bill', 'Agregar Factura')}
                                >
                                    <BoltIcon className="h-5 w-5" />
                                    <span className="text-xs font-medium">{t('finance.bill', 'Factura')}</span>
                                </button>

                                {/* Create Account */}
                                <button
                                    onClick={handleCreateAccount}
                                    className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all hover:shadow-md border-2 border-transparent hover:border-indigo-500 dark:hover:border-indigo-600"
                                    aria-label={t('finance.create_account', 'Crear Cuenta')}
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    <span className="text-xs font-medium">{t('finance.account', 'Cuenta')}</span>
                                </button>

                                {/* Link Account - Only for non-personal projects */}
                                {!proyecto.es_personal && (
                                    <button
                                        onClick={handleLinkAccount}
                                        className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:shadow-md border-2 border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                                        aria-label={t('finance.link_account', 'Vincular Cuenta')}
                                    >
                                        <LinkIcon className="h-5 w-5" />
                                        <span className="text-xs font-medium">{t('finance.link', 'Vincular')}</span>
                                    </button>
                                )}
                            </div>
                        )}
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
                                    status: 'pending', // Default status for now
                                    accountName: t.cuenta?.nombre
                                }))}
                                financialTasks={financialTasks}
                                bills={pendingBills}
                                accounts={[...(proyecto.cuentas || []), ...(proyecto.cuentas_asociadas || [])]}
                                currency={proyecto.moneda_default}
                                onMarkAsPaid={isAdmin ? handleMarkAsPaid : null}
                                onAddBill={handleCreateBill}
                            />
                        )}
                    </div>


                    {/* Charts Section - Cash Flow */}
                    {widgets.financial_charts && (
                        <div className="mb-8">
                            <FinancialChartsWidget
                                transactions={transacciones}
                                currency={proyecto.moneda_default}
                            />
                        </div>
                    )}

                    {/* Account Flow Widget - Income/Expense by Account */}
                    {widgets.account_flow && (
                        <div className="mb-8">
                            <AccountFlowWidget
                                transactions={transacciones}
                                accounts={[...(proyecto.cuentas || []), ...(proyecto.cuentas_asociadas || [])]}
                                isCollaborative={!proyecto.es_personal}
                                currency={proyecto.moneda_default}
                            />
                        </div>
                    )}

                    {/* Transactions Widget */}
                    {isAdmin && transacciones.length > 0 && (
                        <div className="mb-8">
                            <TransactionsWidget
                                transactions={transacciones}
                                accounts={[...(proyecto.cuentas || []), ...(proyecto.cuentas_asociadas || [])]}
                                categories={proyecto.categorias || []}
                                currency={proyecto.moneda_default}
                                onEdit={handleEditTransaction}
                                onDelete={handleDeleteTransaction}
                                currentUserId={auth.user.id}
                                projectId={proyecto.id}
                                isCollaborative={!proyecto.es_personal}
                            />
                        </div>
                    )}

                    {/* Bills Widget */}
                    {isAdmin && (
                        <div className="mb-8">
                            <BillsWidget
                                bills={pendingBills}
                                accounts={[...(proyecto.cuentas || []), ...(proyecto.cuentas_asociadas || [])]}
                                categories={proyecto.categorias || []}
                                currency={proyecto.moneda_default}
                                onAdd={handleCreateBill}
                                onEdit={handleEditBill}
                                onDelete={handleDeleteTransaction}
                                onPay={handlePayBill}
                                currentUserId={auth.user.id}
                                projectId={proyecto.id}
                            />
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {filteredAccounts.map((cuenta) => {
                                            const cuentaTransacciones = transaccionesPorCuenta[cuenta.id] || [];
                                            return (
                                                <div key={cuenta.id} className="relative group">
                                                    <AccountChart
                                                        cuenta={cuenta}
                                                        onEdit={handleEditAccount}
                                                        onClick={handleCardClick}
                                                        isCollaborative={!proyecto.es_personal}
                                                    />
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {linkedAccounts.map((cuenta) => {
                                            const cuentaTransacciones = transaccionesPorCuenta[cuenta.id] || [];
                                            return (
                                                <div key={cuenta.id} className="relative group">
                                                    <AccountChart
                                                        cuenta={cuenta}
                                                        onEdit={handleEditAccount}
                                                        onClick={handleCardClick}
                                                        isCollaborative={!proyecto.es_personal}
                                                    />
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
                                            {!proyecto.es_personal && (
                                                <SecondaryButton onClick={handleLinkAccount}>
                                                    {t('finance.link_account', 'Vincular Cuenta')}
                                                </SecondaryButton>
                                            )}
                                        </div>
                                    )}
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
                    {/* Note: AccountModal is deprecated - use AccountAdminModal instead */}
                    {/* Keeping for backwards compatibility but not actively used */}

                    <AccountModal
                        show={showAccountModal}
                        onClose={() => {
                            setShowAccountModal(false);
                            setSelectedAccount(null);
                        }}
                        account={selectedAccount}
                        proyectoId={proyecto.id}
                        proyecto={proyecto}
                        onSuccess={handleAccountSuccess}
                    />

                    <AccountAdminModal
                        show={showAccountAdminModal}
                        onClose={() => {
                            setShowAccountAdminModal(false);
                            setSelectedAccount(null);
                        }}
                        account={selectedAccount}
                        proyectoId={proyecto.id}
                        proyecto={proyecto}
                        onSuccess={handleAccountSuccess}
                        onDelete={(account) => {
                            setShowAccountAdminModal(false);
                            // Ensure selectedAccount is set (it should be, but just in case)
                            setSelectedAccount(account);
                            setShowDeleteAccountModal(true);
                        }}
                    />

                    <LinkAccountModal
                        show={showLinkAccountModal}
                        onClose={() => setShowLinkAccountModal(false)}
                        project={proyecto}
                    />

                    <QuickTransactionModal
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
                        initialType={selectedTransaction ? (selectedTransaction.monto > 0 ? 'income' : 'expense') : transactionType}
                        initialAccountId={initialAccountId}
                    />

                    <BillModal
                        show={showBillModal}
                        onClose={() => {
                            setShowBillModal(false);
                            setSelectedBill(null);
                        }}
                        bill={selectedBill}
                        proyectoId={proyecto.id}
                        onSuccess={handleBillSuccess}
                    />

                    <DashboardSettingsModal
                        show={showSettingsModal}
                        onClose={() => setShowSettingsModal(false)}
                        project={proyecto}
                    />

                    <DeleteAccountModal
                        show={showDeleteAccountModal}
                        onClose={() => setShowDeleteAccountModal(false)}
                        account={selectedAccount}
                        project={proyecto}
                        onSuccess={() => {
                            setShowDeleteAccountModal(false);
                            setSelectedAccount(null);
                            // Delay reload to ensure modal closes smoothly
                            setTimeout(() => {
                                router.reload({ only: ['proyecto'] });
                            }, 100);
                        }}
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

                    <AccountDetailsModal
                        show={showAccountDetailsModal}
                        onClose={() => {
                            setShowAccountDetailsModal(false);
                            setSelectedAccount(null);
                        }}
                        account={selectedAccount}
                        transactions={transacciones}
                        categories={proyecto.categorias || []}
                        currency={proyecto.moneda_default}
                        onEditTransaction={handleEditTransaction}
                        onDeleteTransaction={handleDeleteTransaction}
                        onAddTransaction={handleCreateTransactionFromAccount}
                        currentUserId={auth.user.id}
                        projectId={proyecto.id}
                    />
                </>
            )}
        </AuthenticatedLayout>
    );
}
