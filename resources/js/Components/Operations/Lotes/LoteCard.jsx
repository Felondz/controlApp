import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Link } from '@inertiajs/react';
import { UserCircleIcon, CalendarIcon, PackageIcon, ClockIcon } from '@/Components/Icons';

export default function LoteCard({ lote, index, onClick }) {
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
                        <div className="flex items-center gap-1.5">
                            <PackageIcon className="w-4 h-4" />
                            <span>{lote.current_quantity} / {lote.initial_quantity}</span>
                        </div>

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
                    </div>
                </div>
            )}
        </Draggable>
    );
}
