import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import LoteCard from './LoteCard';
import { useTranslate } from '@/Hooks/useTranslate';

export default function KanbanColumn({ stage, lotes, onLoteClick, isLastStage, onFinishLote }) {
    const { t } = useTranslate();
    return (
        <div className="flex flex-col min-w-[280px] w-[85vw] sm:w-auto sm:flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-lg h-full max-h-[70vh] sm:max-h-[75vh] lg:max-h-[calc(100vh-220px)] snap-center border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg z-[1] backdrop-blur-sm">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                    {(() => {
                        const name = stage.name;
                        // Map of legacy/default names to translation keys
                        const map = {
                            'Start': 'operations.stage_default_start',
                            'Inicio': 'operations.stage_default_start',
                            'Process': 'operations.stage_default_process',
                            'Proceso': 'operations.stage_default_process',
                            'Finish': 'operations.stage_default_finish',
                            'Finalizado': 'operations.stage_default_finish',
                            'Reception': 'operations.stage_default_reception'
                        };
                        return map[name] ? t(map[name], name) : name;
                    })()}
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
                        className={`flex-1 p-4 overflow-y-auto overflow-x-hidden scrollbar-thin space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-gray-200 dark:bg-gray-800' : ''
                            }`}
                    >
                        {lotes.map((lote, index) => (
                            <LoteCard
                                key={lote.id}
                                lote={lote}
                                index={index}
                                onClick={onLoteClick}
                                isLastStage={isLastStage}
                                onFinish={onFinishLote}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
