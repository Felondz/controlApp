import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Link } from '@inertiajs/react';
import { UserCircleIcon, CalendarIcon, PackageIcon } from '@/Components/Icons';

export default function LoteCard({ lote, index }) {
    return (
        <Draggable draggableId={String(lote.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow ${snapshot.isDragging ? 'rotate-2 shadow-lg ring-2 ring-primary-500 z-50' : ''
                        }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded">
                            {lote.code}
                        </span>
                        {/* Status Badge (Optional) */}
                    </div>

                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 truncate" title={lote.notes}>
                        Lote #{lote.id} {/* Or some other title if available */}
                    </h4>

                    <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <PackageIcon className="w-4 h-4" />
                            <span>{lote.current_quantity} / {lote.initial_quantity}</span>
                        </div>

                        {lote.assigned_user && (
                            <div className="flex items-center gap-1.5">
                                <UserCircleIcon className="w-4 h-4" />
                                <span className="truncate">{lote.assigned_user.name}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1.5 text-xs">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{lote.start_date}</span>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
