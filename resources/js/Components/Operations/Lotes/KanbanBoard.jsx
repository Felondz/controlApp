import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ stages, lotes, onDragEnd }) {
    // Group lotes by stage_id
    const lotesByStage = stages.reduce((acc, stage) => {
        acc[stage.id] = lotes.filter(lote => lote.stage_id === stage.id);
        return acc;
    }, {});

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-6 overflow-x-auto pb-4">
                {stages.map(stage => (
                    <KanbanColumn
                        key={stage.id}
                        stage={stage}
                        lotes={lotesByStage[stage.id] || []}
                    />
                ))}
            </div>
        </DragDropContext>
    );
}
