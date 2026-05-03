import { useState } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Cog6ToothIcon, CheckCircleIcon, XCircleIcon } from '@/Components/Icons';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function DashboardSettingsModal({ show, onClose, project }) {
    const { t } = useTranslate();
    const [processing, setProcessing] = useState(false);

    // Default settings if not present
    const defaultWidgets = {
        balance_summary: true,
        savings_goal: true,
        credit_simulation: true,
        upcoming_obligations: true,
        financial_charts: true,
        pending_bills: true,
        transactions: true
    };

    const [widgets, setWidgets] = useState({
        ...defaultWidgets,
        ...(project?.settings?.widgets || {})
    });

    const handleToggle = (key) => {
        setWidgets(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = async () => {
        setProcessing(true);
        try {
            await axios.put(route('proyectos.update', project.uuid), {
                ...project,
                settings: {
                    ...project.settings,
                    widgets: widgets
                }
            });
            router.reload({ only: ['proyecto'] });
            onClose();
        } catch (error) {
            alert(t('common.error_saving', 'Error al guardar'));
        } finally {
            setProcessing(false);
        }
    };

    const widgetOptions = [
        { key: 'balance_summary', label: t('finance.balance_summary', 'Resumen de Saldos'), description: t('finance.balance_desc', 'Activos, Pasivos y Patrimonio Neto') },
        { key: 'pending_bills', label: t('finance.pending_bills', 'Facturas Pendientes'), description: t('finance.bills_desc', 'Lista de facturas por pagar') },
        { key: 'transactions', label: t('finance.recent_transactions', 'Transacciones Recientes'), description: t('finance.transactions_desc', 'Historial de transacciones') },
        { key: 'savings_goal', label: t('finance.savings_goal', 'Meta de Ahorro'), description: t('finance.savings_desc', 'Seguimiento de meta de ahorro') },
        { key: 'credit_simulation', label: t('finance.credit_simulator', 'Simulador de Crédito'), description: t('finance.credit_desc', 'Calculadora de préstamos') },
        { key: 'upcoming_obligations', label: t('finance.upcoming_payments', 'Próximos Pagos'), description: t('finance.upcoming_desc', 'Lista de transacciones futuras') },
        { key: 'financial_charts', label: t('finance.financial_charts', 'Gráficos Financieros'), description: t('finance.charts_desc', 'Visualización de flujo de caja') },
        { key: 'account_flow', label: t('finance.account_flow', 'Flujo por Cuenta'), description: t('finance.account_flow_desc', 'Distribución de ingresos y gastos por cuenta') },
    ];

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="bg-white dark:bg-gray-800 flex flex-col max-h-[calc(100vh-4rem)]">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-none">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
                        {t('finance.dashboard_settings', 'Personalizar Panel')}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">{t('common.close', 'Cerrar')}</span>
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin space-y-4">
                    {widgetOptions.map((option) => (
                        <div key={option.key} className="flex items-start justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => handleToggle(option.key)}>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {option.label}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {option.description}
                                </p>
                            </div>
                            <div className={`w-10 h-6 flex items-center rounded-full p-1 flex-none transition-colors duration-300 ${widgets[option.key] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${widgets[option.key] ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 flex-none">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        {t('common.cancel', 'Cancelar')}
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSave} disabled={processing} className="flex items-center gap-2">
                        {processing && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                        {t('common.save_changes', 'Guardar Cambios')}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
