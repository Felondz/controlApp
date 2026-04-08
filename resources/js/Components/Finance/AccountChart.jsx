import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency } from '@/Utils/currencyHelpers';
import { getOwnerColor, getOwnerName, getOwnerInitials } from '@/Utils/ownerHelpers';
import {
    CalendarIcon,
    ClockIcon,
    PencilIcon,
    TrashIcon,
    BanknotesIcon,
    AccountCreditIcon,
    AccountLoanIcon,
    AccountInvestmentIcon,
    AccountBankIcon,
    AccountCashIcon
} from '@/Components/Icons';

export default function AccountChart({ cuenta, onEdit, onDelete, onClick, isCollaborative = false }) {
    const { t } = useTranslate();

    const formatMonto = (monto) => {
        const amount = Math.abs(monto) / 100;
        return new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: cuenta.moneda || 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPercent = (value) => {
        return `${value.toFixed(2)}%`;
    };

    const formatDateDay = (day) => {
        if (!day) return '-';
        return `${t('finance.day', 'Día')} ${day}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString(navigator.language, { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Get icon for account type
    const getAccountIcon = () => {
        switch (cuenta.tipo) {
            case 'credito':
                return AccountCreditIcon;
            case 'prestamo':
                return AccountLoanIcon;
            case 'inversion':
                return AccountInvestmentIcon;
            case 'efectivo':
                return AccountCashIcon;
            case 'banco':
            default:
                return AccountBankIcon;
        }
    };

    // Calculate type-specific values
    const getBalanceInfo = () => {
        const balance = cuenta.saldo_actual || 0;

        switch (cuenta.tipo) {
            case 'credito':
                const creditUsed = balance;
                const creditLimit = cuenta.limite_credito || 0;
                const creditAvailable = creditLimit - creditUsed;
                const creditPercent = creditLimit > 0 ? (creditUsed / creditLimit) * 100 : 0;

                let percentColor = 'text-green-600 dark:text-green-400';
                if (creditPercent >= 75) percentColor = 'text-red-600 dark:text-red-400';
                else if (creditPercent >= 50) percentColor = 'text-amber-600 dark:text-amber-400';

                return {
                    label: t('finance.debt_current', 'Deuda Actual'),
                    value: creditUsed,
                    color: creditUsed > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
                    extra: [
                        { label: t('finance.credit_limit', 'Cupo Total'), value: formatMonto(creditLimit) },
                        { label: t('finance.credit_available', 'Cupo Disponible'), value: formatMonto(creditAvailable) },
                        { label: t('finance.percent_used', '% Utilizado'), value: formatPercent(creditPercent), textColor: percentColor },
                        { label: t('finance.interest_rate', 'Tasa'), value: `${cuenta.tasa_interes_anual || 0}%` }
                    ]
                };

            case 'prestamo':
                const debtRemaining = balance;
                const totalInstallments = cuenta.plazo || 0;
                const paidInstallments = cuenta.cuotas_pagadas || 0;
                const percentPaid = totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0;

                return {
                    label: t('finance.debt_remaining', 'Deuda Restante'),
                    value: debtRemaining,
                    color: debtRemaining > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
                    extra: [
                        { label: t('finance.monthly_quota', 'Cuota'), value: formatMonto(cuenta.valor_cuota || 0) },
                        { label: t('finance.installments', 'Cuotas'), value: `${paidInstallments} / ${totalInstallments}` },
                        { label: t('finance.percent_paid', '% Pagado'), value: formatPercent(percentPaid) },
                        { label: t('finance.interest_rate', 'Tasa'), value: `${cuenta.tasa_interes_anual || cuenta.tasa_interes || 0}%` }
                    ]
                };

            case 'inversion':
                return {
                    label: t('finance.current_value', 'Valor Actual'),
                    value: balance,
                    color: 'text-green-600 dark:text-green-400',
                    extra: [
                        { label: t('finance.interest_rate', 'Tasa'), value: `${cuenta.tasa_interes || cuenta.tasa_interes_anual || 0}%` }
                    ]
                };

            case 'banco':
            case 'efectivo':
            default:
                const extras = [];
                if (cuenta.tasa_interes_anual && parseFloat(cuenta.tasa_interes_anual) > 0) {
                    extras.push({
                        label: t('finance.interest_rate_ea', 'Tasa E.A.'),
                        value: `${cuenta.tasa_interes_anual}%`
                    });
                }

                return {
                    label: t('finance.balance_available', 'Saldo Disponible'),
                    value: balance,
                    color: balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                    extra: extras
                };
        }
    };

    const AccountIcon = getAccountIcon();
    const balanceInfo = getBalanceInfo();
    const hasMinimalInfo = balanceInfo.extra.length === 0 && !cuenta.es_nomina;

    const handleCardClick = (e) => {
        if (e.target.closest('button')) {
            return;
        }
        if (onClick) {
            onClick(cuenta);
        }
    };

    // Helper for payment status color
    const getPaymentStatusColor = () => {
        // Defaults if no status provided
        const defaults = {
            bg: 'bg-gray-50 dark:bg-gray-700/50',
            text: 'text-gray-900 dark:text-white',
            border: 'border-gray-200 dark:border-gray-600',
            icon: 'text-gray-500 dark:text-gray-400'
        };

        if (!cuenta.paymentStatus) return defaults;

        switch (cuenta.paymentStatus) {
            case 'paid': // Verde
                return {
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    text: 'text-green-700 dark:text-green-400',
                    border: 'border-green-200 dark:border-green-800',
                    icon: 'text-green-600 dark:text-green-400'
                };
            case 'warning': // Ambar (5 días antes)
                return {
                    bg: 'bg-amber-50 dark:bg-amber-900/20',
                    text: 'text-amber-700 dark:text-amber-400',
                    border: 'border-amber-200 dark:border-amber-800',
                    icon: 'text-amber-600 dark:text-amber-400'
                };
            case 'due': // Rojo (Hoy o vencido)
                return {
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    text: 'text-red-700 dark:text-red-400',
                    border: 'border-red-200 dark:border-red-800',
                    icon: 'text-red-600 dark:text-red-400'
                };
            default:
                return defaults;
        }
    };

    const statusColor = getPaymentStatusColor();

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-5 transition-all h-full flex flex-col shadow-sm hover:shadow-md ${cuenta.estado === 'inactiva' ? 'opacity-75 grayscale-[0.5]' : ''
                } ${onClick ? 'cursor-pointer hover:border-primary-500 dark:hover:border-primary-400' : ''}`}
            onClick={handleCardClick}
        >
            {/* Header with Icon */}
            <div className="mb-4 flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Type Icon - Uses theme colors */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <AccountIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-primary-700 dark:text-primary-300 mb-0.5 truncate">
                            {cuenta.nombre}
                        </h4>

                        {cuenta.banco && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
                                {cuenta.banco}
                            </p>
                        )}

                        {/* Currency Badge - First row below bank name */}
                        <div className="mb-1.5">
                            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                                {cuenta.moneda || 'COP'}
                            </span>
                        </div>

                        {/* Other Badges - Second row */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                {t(`accounts.account_types.${cuenta.tipo}`, cuenta.tipo)}
                            </span>

                            {/* Owner Badge - Only for collaborative projects */}
                            {isCollaborative && cuenta.propietario && (
                                <span
                                    className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${getOwnerColor(cuenta.propietario_id).bg} ${getOwnerColor(cuenta.propietario_id).text} ${getOwnerColor(cuenta.propietario_id).border}`}
                                    title={`${t('finance.owner', 'Propietario')}: ${getOwnerName(cuenta)}`}
                                >
                                    {getOwnerInitials(getOwnerName(cuenta))} {getOwnerName(cuenta).split(' ')[0]}
                                </span>
                            )}

                            {cuenta.es_nomina && (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full">
                                    {t('finance.payroll_badge', 'Payroll')}
                                </span>
                            )}
                            {cuenta.estado === 'inactiva' && (
                                <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                    {t('finance.inactive', 'Inactiva')}
                                </span>
                            )}
                        </div>
                    </div>

                </div>

                {/* Action Buttons - Use theme colors */}
                <div className="flex gap-1 ml-2 flex-shrink-0">
                    {onEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(cuenta);
                            }}
                            className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                            title={t('finance.manage_account', 'Administrar Cuenta')}
                        >
                            <PencilIcon className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Balance - Always centered with smaller size */}
            <div className="mb-4 flex flex-col items-center text-center">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {balanceInfo.label}
                </p>
                <p className={`text-xl md:text-2xl font-bold ${balanceInfo.color}`}>
                    {formatMonto(balanceInfo.value)}
                </p>
            </div>

            {/* Extra Balance Info - Compact Grid with smaller text */}
            {balanceInfo.extra.length > 0 && (
                <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {balanceInfo.extra.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                            <p className="text-[9px] font-medium text-gray-500 dark:text-gray-400 mb-0.5 truncate">{item.label}</p>
                            <p className={`text-xs font-bold truncate ${item.textColor || 'text-gray-900 dark:text-white'}`}>{item.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Type-Specific Details - Compact with smaller text */}
            {!hasMinimalInfo && (
                <div className="flex-1 flex flex-col justify-end">
                    {/* INSIDE CREDIT CARD BLOCK */}
                    {cuenta.tipo === 'credito' && (
                        <div className="space-y-1.5">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 flex justify-between items-center">
                                <span className="text-[9px] font-medium text-gray-600 dark:text-gray-400">{t('finance.cutoff_date', 'Corte')}</span>
                                <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                    <CalendarIcon className="w-3 h-3" />
                                    {t('finance.day', 'Día')} {cuenta.dia_corte || '-'}
                                </span>
                            </div>
                            <div className={`${statusColor.bg} p-1.5 rounded-lg border ${statusColor.border} flex justify-between items-center`}>
                                <span className={`text-[9px] font-medium ${statusColor.icon}`}>{t('finance.payment_date', 'Pago')}</span>
                                <span className={`text-xs font-bold ${statusColor.text} flex items-center gap-1`}>
                                    <ClockIcon className="w-3 h-3" />
                                    {t('finance.day', 'Día')} {cuenta.dia_pago || '-'}
                                </span>
                            </div>
                        </div>
                    )}

                    {cuenta.tipo === 'prestamo' && (
                        <div className={`${statusColor.bg} p-1.5 rounded-lg border ${statusColor.border}`}>
                            <div className="flex justify-between items-center">
                                <span className={`text-[9px] font-medium ${statusColor.icon}`}>{t('finance.payment_day', 'Día Pago')}</span>
                                <span className={`text-xs font-bold ${statusColor.text} flex items-center gap-1`}>
                                    <CalendarIcon className="w-3 h-3" />
                                    {t('finance.day', 'Día')} {cuenta.dia_pago || '-'}
                                </span>
                            </div>
                        </div>
                    )}

                    {cuenta.tipo === 'inversion' && cuenta.fecha_vencimiento && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg border border-gray-200 dark:border-gray-600">
                            <p className="text-[9px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">{t('finance.maturity_date', 'Vencimiento')}</p>
                            <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                <ClockIcon className="w-3 h-3" />
                                {formatDate(cuenta.fecha_vencimiento)}
                            </p>
                        </div>
                    )}

                    {cuenta.es_nomina && (
                        <div className="space-y-1.5 mt-2">
                            <div className="bg-green-50 dark:bg-green-900/20 p-1.5 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-[9px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">{t('finance.payroll_days', 'Días Pago')}</p>
                                <p className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <CalendarIcon className="w-3 h-3" />
                                    {Array.isArray(cuenta.dia_nomina) && cuenta.dia_nomina.length > 0
                                        ? cuenta.dia_nomina.sort((a, b) => a - b).join(', ')
                                        : '-'
                                    }
                                </p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-1.5 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-[9px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">{t('finance.estimated_value', 'Estimado')}</p>
                                <p className="text-xs font-bold text-green-600 dark:text-green-400">{formatMonto(cuenta.valor_nomina)}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Click hint - Uses theme colors */}
            {onClick && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-[10px] text-center font-medium text-primary-600 dark:text-primary-400">
                        {t('finance.view_transactions', 'Click para ver transacciones')}
                    </p>
                </div>
            )}
        </div>
    );
}
