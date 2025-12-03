import { useMemo } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';

export default function AccountChart({ cuenta, transacciones = [] }) {
    const { t } = useTranslate();

    // Calcular estadísticas
    const stats = useMemo(() => {
        const ingresos = transacciones
            .filter(t => t.categoria?.tipo === 'ingreso')
            .reduce((sum, t) => sum + (t.monto || 0), 0);

        const gastos = transacciones
            .filter(t => t.categoria?.tipo === 'gasto')
            .reduce((sum, t) => sum + Math.abs(t.monto || 0), 0);

        const balance = (cuenta.saldo_actual || 0);
        const total = ingresos + gastos;
        const porcentajeIngresos = total > 0 ? (ingresos / total) * 100 : 0;
        const porcentajeGastos = total > 0 ? (gastos / total) * 100 : 0;

        return {
            ingresos,
            gastos,
            balance,
            total,
            porcentajeIngresos,
            porcentajeGastos,
        };
    }, [cuenta, transacciones]);

    const formatMonto = (monto) => {
        const amount = Math.abs(monto) / 100;
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-all ${cuenta.estado === 'inactiva' ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            {/* Header */}
            <div className="mb-4 flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        {cuenta.nombre}
                        {cuenta.estado === 'inactiva' && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                {t('finance.inactive', 'Inactiva')}
                            </span>
                        )}
                    </h4>
                    {cuenta.banco && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {cuenta.banco}
                        </p>
                    )}
                </div>
            </div>

            {/* Balance */}
            <div className="mb-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('finance.current_balance', 'Balance Actual')}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {formatMonto(stats.balance)}
                </p>
            </div>

            {/* Chart Bars */}
            {stats.total > 0 && (
                <div className="space-y-4">
                    {/* Ingresos */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('finance.income', 'Ingresos')}
                            </span>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                {formatMonto(stats.ingresos)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${stats.porcentajeIngresos}%` }}
                            />
                        </div>
                    </div>

                    {/* Gastos */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('finance.expenses', 'Gastos')}
                            </span>
                            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                {formatMonto(stats.gastos)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${stats.porcentajeGastos}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {stats.total === 0 && (
                <div className="text-center py-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('finance.no_transactions_yet', 'Aún no hay transacciones')}
                    </p>
                </div>
            )}

            {/* Summary */}
            {stats.total > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                            {t('finance.total_movements', 'Total Movimientos')}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {transacciones.length}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

