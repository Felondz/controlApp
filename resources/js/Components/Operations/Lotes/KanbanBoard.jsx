import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ stages, lotes, onDragEnd, onLoteClick, lastStageId, onFinishLote }) {
    // Group lotes by stage_id
    const lotesByStage = stages.reduce((acc, stage) => {
        acc[stage.id] = lotes.filter(lote => lote.stage_id === stage.id);
        return acc;
    }, {});

    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    if (!enabled) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full w-full gap-4 overflow-x-auto pb-4 snap-x snap-mandatory px-4 md:px-0 scrollbar-thin">
                {stages.map(stage => (
                    <KanbanColumn
                        key={stage.id}
                        stage={stage}
                        lotes={lotesByStage[stage.id] || []}
                        onLoteClick={onLoteClick}
                        isLastStage={stage.id === lastStageId}
                        onFinishLote={onFinishLote}
                    />
                ))}
            </div>
        </DragDropContext>
    );
}
