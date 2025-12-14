import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency } from '@/Utils/currencyHelpers';
import { UpcomingObligationsWidget, BalanceSummaryWidget, SavingsGoalWidget, CreditSimulationWidget, FinancialChartsWidget, TransactionsWidget } from '@/Modules/Finance/Widgets';
import AccountChart from '@/Components/Finance/AccountChart';
import QuickTransactionModal from '@/Components/Finance/Modals/QuickTransactionModal';
import AccountModal from '@/Components/Finance/Modals/AccountModal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { PlusIcon, CurrencyDollarIcon, BanknotesIcon, CreditCardIcon, ChartBarIcon, CalendarIcon, BoltIcon } from '@/Components/Icons';
import axios from 'axios';

export default function PersonalDashboard({
    auth,
    proyectoPersonal,
    proyectos,
    todasLasCuentas,
    todasLasTransacciones
}) {
    const { t } = useTranslate();
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [categorias, setCategorias] = useState(proyectoPersonal?.categorias || []);
    const [cuentas, setCuentas] = useState(todasLasCuentas || []);
    const [transacciones, setTransacciones] = useState(todasLasTransacciones || []);

    // Sync local state with Inertia props when they change
    useEffect(() => {
        setCuentas(todasLasCuentas || []);
    }, [todasLasCuentas]);

    useEffect(() => {
        setTransacciones(todasLasTransacciones || []);
    }, [todasLasTransacciones]);

    const handleAccountSuccess = () => {
        // Recargar datos
        router.reload({ only: ['todasLasCuentas'] });
    };

    const handleTransactionSuccess = () => {
        // Recargar datos
        router.reload({ only: ['todasLasTransacciones', 'todasLasCuentas'] });
    };

    const handleCreateAccount = () => {
        setSelectedAccount(null);
        setShowAccountModal(true);
    };

    const handleCreateTransaction = () => {
        setSelectedTransaction(null);
        setShowTransactionModal(true);
    };

    const handleEditAccount = (account) => {
        setSelectedAccount(account);
        setShowAccountModal(true);
    };

    const handleEditTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setShowTransactionModal(true);
    };

    // Agrupar transacciones por cuenta
    const transaccionesPorCuenta = transacciones.reduce((acc, trans) => {
        const cuentaId = trans.cuenta_id;
        if (!acc[cuentaId]) {
            acc[cuentaId] = [];
        }
        acc[cuentaId].push(trans);
        return acc;
    }, {});

    // Formatear monto
    const formatMonto = (monto) => {
        const amount = Math.abs(monto) / 100;
        return new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: proyectoPersonal?.moneda_default || 'COP',
        }).format(amount);
    };

    // Obtener transacciones por proyecto
    const getTransaccionesByProyecto = (proyectoId) => {
        return transacciones.filter(t => t.proyecto_id === proyectoId);
    };

    // Transacciones personales (sin proyecto o del proyecto personal)
    const transaccionesPersonales = transacciones.filter(t =>
        !t.proyecto_id || t.proyecto_id === proyectoPersonal?.id
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">
                    {t('finance.personal_finance', 'Finanzas Personales')}
                </h2>
            }
        >
            <Head title={t('finance.personal_finance', 'Finanzas Personales')} />

            <div className="py-6 pb-20 md:pb-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <PrimaryButton
                            onClick={handleCreateAccount}
                            className="flex items-center justify-center gap-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            {t('finance.create_account', 'Crear Cuenta')}
                        </PrimaryButton>
                        <PrimaryButton
                            onClick={handleCreateTransaction}
                            className="flex items-center justify-center gap-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            {t('finance.create_transaction', 'Crear Transacción')}
                        </PrimaryButton>
                    </div>

                    {/* Top Row: Balance & Upcoming */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Balance Summary */}
                        <div className="lg:col-span-2">
                            <BalanceSummaryWidget
                                accounts={cuentas}
                                currency={proyectoPersonal?.moneda_default || 'COP'}
                            />
                        </div>

                        {/* Upcoming Obligations */}
                        <div className="h-full">
                            <UpcomingObligationsWidget
                                accounts={cuentas}
                                bills={[]} // Personal finance doesn't usually have bills module linked yet
                                financialTasks={[]} // Tasks are usually project based
                                currency={proyectoPersonal?.moneda_default || 'COP'}
                            />
                        </div>
                    </div>

                    {/* Middle Row: Charts */}
                    <div className="h-[400px]">
                        <FinancialChartsWidget
                            transactions={transacciones}
                            currency={proyectoPersonal?.moneda_default || 'COP'}
                        />
                    </div>

                    {/* Bottom Row: Transactions */}
                    <div className="mb-8">
                        <TransactionsWidget
                            transactions={transacciones}
                            accounts={cuentas}
                            categories={categorias}
                            currency={proyectoPersonal?.moneda_default || 'COP'}
                            onEdit={handleEditTransaction}
                            onDelete={null}
                            currentUserId={auth.user.id}
                            projects={proyectos}
                        />
                    </div>

                </div>
            </div>

            {/* Modals */}
            <AccountModal
                show={showAccountModal}
                onClose={() => {
                    setShowAccountModal(false);
                    setSelectedAccount(null);
                }}
                account={selectedAccount}
                proyectoId={proyectoPersonal?.id}
                proyecto={proyectoPersonal}
                onSuccess={handleAccountSuccess}
            />

            <QuickTransactionModal
                show={showTransactionModal}
                onClose={() => {
                    setShowTransactionModal(false);
                    setEditingTransaction(null);
                }}
                transaction={editingTransaction}
                proyectoId={null} // Personal finance
                proyectos={proyectos}
                cuentas={cuentas}
                categorias={categorias}
                onSuccess={handleTransactionSuccess}
                initialType={editingTransaction ? (editingTransaction.monto > 0 ? 'income' : 'expense') : 'expense'}
            />
        </AuthenticatedLayout>
    );
}
