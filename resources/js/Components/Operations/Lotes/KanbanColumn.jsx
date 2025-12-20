import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import LoteCard from './LoteCard';

export default function KanbanColumn({ stage, lotes, onLoteClick }) {
    return (
        <div className="flex flex-col w-80 bg-gray-100 dark:bg-gray-900 rounded-lg h-full max-h-[calc(100vh-280px)]">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-gray-100 dark:bg-gray-900 rounded-t-lg z-10">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                    {stage.name}
                </h3>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                    {lotes.length}
                </span>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={String(stage.id)}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 p-4 overflow-y-auto space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-gray-200 dark:bg-gray-800' : ''
                            }`}
                    >
                        {lotes.map((lote, index) => (
                            <LoteCard
                                key={lote.id}
                                lote={lote}
                                index={index}
                                onClick={onLoteClick}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
