import { useTranslate } from '@/Hooks/useTranslate';

export default function FinanceWidget({ project }) {
    const { t } = useTranslate();

    // Mock data - in a real app this would come from the project prop
    const balance = 1500.00;
    const budgetUsed = 70;
    const currency = project.moneda_default || 'USD';

    return (
        <div className="space-y-4">
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t('finance.balance', 'Balance Actual')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: currency }).format(balance)}
                </p>
            </div>

            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-300">{t('finance.budget', 'Presupuesto Mensual')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{budgetUsed}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${budgetUsed}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
