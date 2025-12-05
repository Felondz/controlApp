import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency } from '@/Utils/currencyHelpers';
import UpcomingObligationsWidget from '@/Components/Finance/Widgets/UpcomingObligationsWidget';
import BalanceSummaryWidget from '@/Components/Finance/Widgets/BalanceSummaryWidget';
import SavingsGoalWidget from '@/Components/Finance/Widgets/SavingsGoalWidget';
import CreditSimulationWidget from '@/Components/Finance/Widgets/CreditSimulationWidget';
import FinancialChartsWidget from '@/Components/Finance/Widgets/FinancialChartsWidget';
import TransactionsWidget from '@/Components/Finance/Widgets/TransactionsWidget';
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

                    {/* Accounts Summary */}
                    {cuentas.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('finance.accounts', 'Cuentas')}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {cuentas.map((cuenta) => {
                                        const cuentaTransacciones = transaccionesPorCuenta[cuenta.id] || [];
                                        const ingresos = cuentaTransacciones
                                            .filter(t => t.categoria?.tipo === 'ingreso')
                                            .reduce((sum, t) => sum + (t.monto || 0), 0);
                                        const gastos = cuentaTransacciones
                                            .filter(t => t.categoria?.tipo === 'gasto')
                                            .reduce((sum, t) => sum + Math.abs(t.monto || 0), 0);

                                        return (
                                            <div
                                                key={cuenta.id}
                                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => handleEditAccount(cuenta)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                        {cuenta.nombre}
                                                    </h4>
                                                    <CurrencyDollarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                                </div>
                                                {cuenta.banco && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                        {cuenta.banco}
                                                    </p>
                                                )}
                                                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                                    {formatMonto(cuenta.balance || 0)}
                                                </p>
                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                                                    <div className="flex justify-between">
                                                        <span>{t('finance.income', 'Ingresos')}:</span>
                                                        <span className="text-green-600 dark:text-green-400">
                                                            {formatMonto(ingresos)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>{t('finance.expenses', 'Gastos')}:</span>
                                                        <span className="text-red-600 dark:text-red-400">
                                                            {formatMonto(gastos)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transactions by Project */}
                    {proyectos.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('finance.transactions_by_project', 'Transacciones por Proyecto')}
                                </h3>
                                <div className="space-y-4">
                                    {proyectos.map((proyecto) => {
                                        const proyectoTransacciones = getTransaccionesByProyecto(proyecto.id);
                                        if (proyectoTransacciones.length === 0) return null;

                                        return (
                                            <div
                                                key={proyecto.id}
                                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                            >
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                                    {proyecto.nombre}
                                                </h4>
                                                <div className="space-y-2">
                                                    {proyectoTransacciones.slice(0, 5).map((trans) => (
                                                        <div
                                                            key={trans.id}
                                                            className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded cursor-pointer"
                                                            onClick={() => handleEditTransaction(trans)}
                                                        >
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {trans.descripcion || t('finance.no_description', 'Sin descripción')}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {trans.categoria?.nombre} • {new Date(trans.fecha).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <span className={`text - sm font - semibold ${trans.categoria?.tipo === 'ingreso'
                                                                ? 'text-green-600 dark:text-green-400'
                                                                : 'text-red-600 dark:text-red-400'
                                                                } `}>
                                                                {trans.categoria?.tipo === 'ingreso' ? '+' : '-'}
                                                                {formatMonto(trans.monto)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {proyectoTransacciones.length > 5 && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                                                            {t('common.and_more', 'y {count} más', { count: proyectoTransacciones.length - 5 })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Personal Transactions */}
                    {transaccionesPersonales.length > 0 && (
                        <div className="mb-8">
                            <TransactionsWidget
                                transactions={transaccionesPersonales}
                                accounts={cuentas}
                                categories={categorias}
                                currency={proyectoPersonal?.moneda_default || 'COP'}
                                onEdit={handleEditTransaction}
                                onDelete={null}
                                currentUserId={auth.user.id}
                                projects={proyectos}
                            />
                        </div>
                    )}

                    {/* Empty State */}
                    {cuentas.length === 0 && transacciones.length === 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-12 text-center">
                            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {t('finance.no_accounts_yet', 'Aún no tienes cuentas')}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {t('finance.create_first_account', 'Crea tu primera cuenta para comenzar a gestionar tus finanzas')}
                            </p>
                            <PrimaryButton onClick={handleCreateAccount}>
                                {t('finance.create_account', 'Crear Cuenta')}
                            </PrimaryButton>
                        </div>
                    )}
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
