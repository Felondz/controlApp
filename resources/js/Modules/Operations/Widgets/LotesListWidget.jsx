import { Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { FactoryIcon, ClockIcon, PlusIcon } from '@/Components/Icons';
import PrimaryButton from "@/Components/PrimaryButton";
import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';

export default function LotesListWidget({
    project,
    lotes = { data: [] },
    widget,
    isDragging,
    dragHandleProps,
    onHide
}) {
    const { t } = useTranslate();

    // Handling case where lotes might not be available yet or format is different
    const lotesData = lotes.data || [];

    // Safely try to get the create route
    let createUrl = null;
    try {
        createUrl = route('operations.lotes.create', project.id);
    } catch (e) {
        // Route not available, use fallback URL
        createUrl = `/mis-proyectos/${project.id}/operations/lotes/create`;
    }

    const actionButton = (
        <Link href={createUrl}>
            <PrimaryButton size="sm">
                <PlusIcon className="mr-2 h-3 w-3" /> {t('operations.new_lote', 'Nuevo')}
            </PrimaryButton>
        </Link>
    );

    return (
        <WidgetCard
            widget={widget}
            title={t('operations.title', 'Operaciones')}
            action={actionButton}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[200px]">
                {lotesData.map((lote) => (
                    <Link href={`/mis-proyectos/${project.id}/operations/lotes/${lote.id}`} key={lote.id} className="block h-full">
                        <div className="h-full bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-600 overflow-hidden relative group p-4">

                            {/* Status Badge */}
                            <div className="absolute top-2 right-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${lote.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                    }`}>
                                    {lote.status}
                                </span>
                            </div>

                            <div className="mt-2">
                                <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                                    <FactoryIcon className="h-3 w-3" /> {lote.process?.name || t('operations.process_general')}
                                </div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {lote.code}
                                </h3>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 dark:text-gray-400">{t('operations.current_stage')}:</span>
                                        <span className="font-semibold text-gray-900 dark:text-white px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-[10px]">
                                            {lote.current_stage?.name || 'Inicio'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 dark:text-gray-400">{t('operations.quantity')}:</span>
                                        <span className="font-mono font-medium text-gray-900 dark:text-gray-100">{lote.current_quantity} {t('operations.units')}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <ClockIcon className="h-3 w-3" /> {t('operations.start_date')}:
                                        </span>
                                        <span>{new Date(lote.start_date).toLocaleDateString()}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-1 rounded-full mt-3 overflow-hidden">
                                        <div
                                            className="bg-primary-600 h-1 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${(lote.current_stage?.order / (lote.process?.stages?.length || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {lotesData.length === 0 && (
                    <div className="col-span-full text-center py-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <FactoryIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('operations.no_active_lotes')}</h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('operations.create_first_lote')}</p>
                    </div>
                )}
            </div>
        </WidgetCard>
    );
}

