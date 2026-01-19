import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Link } from '@inertiajs/react';
import { UserCircleIcon, CalendarIcon, ClockIcon, BeakerIcon } from '@/Components/Icons';
import { formatCurrency } from '@/Utils/currencyHelpers';

import { useTranslate } from '@/Hooks/useTranslate';

export default function LoteCard({ lote, index, onClick, isLastStage, onFinish }) {
    const { t } = useTranslate();
    return (
        <Draggable draggableId={String(lote.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(lote)}
                    className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer ${snapshot.isDragging ? 'rotate-2 shadow-lg ring-2 ring-primary-500 z-50' : ''
                        }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded">
                            {lote.code}
                        </span>
                        {/* Status Badge (Optional) */}
                    </div>

                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 truncate" title={lote.notes}>
                        {lote.notes || 'Sin notas'}
                    </h4>

                    <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">


                        {lote.assignee && (
                            <div className="flex items-center gap-1.5">
                                <UserCircleIcon className="w-4 h-4" />
                                <span className="truncate">{lote.assignee.name}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1.5" title="Fecha Inicio">
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            <span>{new Date(lote.start_date).toLocaleDateString('es-ES')}</span>
                        </div>

                        {/* Consumed Inputs Count */}
                        <div className="flex items-center gap-1.5" title="Insumos Consumidos">
                            <BeakerIcon className="w-4 h-4 text-gray-400" />
                            <span>{lote.inputs?.filter(i => i.status === 'consumed').length || 0} inputs</span>
                        </div>

                        {/* Total Consumed Cost */}
                        <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
                            <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                                {formatCurrency(lote.inputs?.filter(i => i.status === 'consumed').reduce((acc, curr) => {
                                    // Ensure numeric values for calculation
                                    const cost = Number(curr.total_cost) || (Number(curr.quantity) * Number(curr.product?.cost_price || 0));
                                    return acc + cost;
                                }, 0) || 0, 'COP', false)}
                            </div>
                        </div>
                    </div>

                    {isLastStage && lote.status === 'active' && (
                        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFinish(lote);
                                }}
                                className="w-full text-center px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium transition shadow-sm flex items-center justify-center gap-1"
                            >
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                {t('operations.finish_btn', 'Finalizar')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
}
