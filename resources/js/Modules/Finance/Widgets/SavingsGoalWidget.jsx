import { useState, useEffect } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { formatCurrency as formatCurrencyHelper } from '@/Utils/currencyHelpers';
import { ChartBarIcon, PencilIcon, CheckIcon } from '@/Components/Icons';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';

export default function SavingsGoalWidget({
    currency = 'COP',
    widget,
    isDragging,
    dragHandleProps,
    onHide
}) {
    const { t } = useTranslate();
    const [isEditing, setIsEditing] = useState(false);

    // Local State (In a real app, this would be persisted in DB)
    const [goalAmount, setGoalAmount] = useState(() => localStorage.getItem('finance_goal_amount') || '10000000');
    const [currentSaved, setCurrentSaved] = useState(() => localStorage.getItem('finance_goal_current') || '2500000');
    const [monthlyContribution, setMonthlyContribution] = useState(() => localStorage.getItem('finance_goal_monthly') || '500000');

    useEffect(() => {
        localStorage.setItem('finance_goal_amount', goalAmount);
        localStorage.setItem('finance_goal_current', currentSaved);
        localStorage.setItem('finance_goal_monthly', monthlyContribution);
    }, [goalAmount, currentSaved, monthlyContribution]);

    const progress = Math.min((parseFloat(currentSaved) / parseFloat(goalAmount)) * 100, 100);
    const remaining = parseFloat(goalAmount) - parseFloat(currentSaved);
    const monthsToGoal = parseFloat(monthlyContribution) > 0 ? Math.ceil(remaining / parseFloat(monthlyContribution)) : 0;

    const formatCurrency = (value) => {
        return formatCurrencyHelper(value * 100, currency, true); // Multiply by 100 as helper expects cents
    };

    return (
        <WidgetCard
            widget={widget}
            title={t('finance.savings_goal', 'Meta de Ahorro')}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
            action={
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                    {isEditing ? <CheckIcon className="w-4 h-4" /> : <PencilIcon className="w-4 h-4" />}
                </button>
            }
        >

            {isEditing ? (
                <div className="space-y-3">
                    <div>
                        <InputLabel value={t('finance.goal_amount', 'Meta Total')} />
                        <TextInput
                            type="number"
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                            className="w-full mt-1"
                        />
                    </div>
                    <div>
                        <InputLabel value={t('finance.current_saved', 'Ahorrado Actual')} />
                        <TextInput
                            type="number"
                            value={currentSaved}
                            onChange={(e) => setCurrentSaved(e.target.value)}
                            className="w-full mt-1"
                        />
                    </div>
                    <div>
                        <InputLabel value={t('finance.monthly_contribution', 'Aporte Mensual')} />
                        <TextInput
                            type="number"
                            value={monthlyContribution}
                            onChange={(e) => setMonthlyContribution(e.target.value)}
                            className="w-full mt-1"
                        />
                    </div>
                    <PrimaryButton onClick={() => setIsEditing(false)} className="w-full justify-center mt-2">
                        {t('common.save', 'Guardar')}
                    </PrimaryButton>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t('finance.progress', 'Progreso')}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {progress.toFixed(1)}%
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatCurrency(currentSaved)} / {formatCurrency(goalAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-primary-600 h-4 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                {t('finance.estimated_time', 'Tiempo estimado')}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {monthsToGoal > 0
                                    ? `${monthsToGoal} ${t('common.months', 'meses')}`
                                    : t('finance.goal_reached', '¡Meta alcanzada!')
                                }
                            </span>
                        </div>
                        {monthsToGoal > 0 && (
                            <p className="text-xs text-gray-400 mt-1 text-right">
                                {t('finance.saving_monthly', 'Ahorrando')} {formatCurrency(monthlyContribution)}/{t('common.month', 'mes')}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Currency badge - bottom left */}
            <div className="absolute bottom-4 left-4 opacity-50 text-[10px]">
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                    {currency}
                </span>
            </div>
        </WidgetCard>
    );
}
