import { useTranslate } from '@/Hooks/useTranslate';

export default function FinanceWidget({ project }) {
    const { t } = useTranslate();

    // Mock data - in a real app this would come from the project prop
    const balance = 1500.00;
    const budgetUsed = 70;
    const currency = project.moneda_default || 'USD';

    return (
        <div className="flex flex-col justify-center items-center h-full text-center">
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    {t('finance.balance', 'Balance Actual')}
                </p>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: currency }).format(balance)}
                </p>
            </div>
        </div>
    );
}
