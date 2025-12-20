import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { FactoryIcon, PlusIcon, CogIcon } from '@/Components/Icons';
import KanbanBoard from '@/Components/Operations/Lotes/KanbanBoard';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState, useEffect } from 'react';
import CreateLoteModal from '@/Components/Operations/Lotes/CreateLoteModal';
import CreateProcessModal from '@/Components/Operations/Lotes/CreateProcessModal';
import LoteDetailsModal from '@/Components/Operations/Lotes/LoteDetailsModal';
import ManageProcessModal from '@/Components/Operations/Lotes/ManageProcessModal';
import StageConfirmationModal from '@/Components/Operations/Lotes/StageConfirmationModal';

export default function Index({ auth, proyecto, processes, selectedProcessId, stages, lotes, members, inventoryItems }) {
    const { t } = useTranslate();
    const [processIds, setProcessId] = useState(selectedProcessId);
    const [showCreateLote, setShowCreateLote] = useState(false);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showManageProcessModal, setShowManageProcessModal] = useState(false);
    const [selectedLote, setSelectedLote] = useState(null);
    const [showStageConfirmation, setShowStageConfirmation] = useState(false);
    const [pendingStageUpdate, setPendingStageUpdate] = useState(null);

    const handleProcessChange = (e) => {
        router.get(route('operations.lotes.index', {
            proyecto: proyecto.id,
            process_id: e.target.value
        }), {}, { preserveState: true });
    };

    // Auto-open modals if requested via query param
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'create') {
            setShowCreateLote(true);
        }
        if (params.get('open_modal') === 'process_settings') {
            setShowManageProcessModal(true);
        }
        const openLoteId = params.get('open_lote');
        if (openLoteId && lotes) {
            const loteToOpen = lotes.find(l => l.id == openLoteId);
            if (loteToOpen) setSelectedLote(loteToOpen);
        }
    }, [window.location.search, lotes]);

    // Sync local state when prop changes (critical for filtering)
    useEffect(() => {
        setProcessId(selectedProcessId);
    }, [selectedProcessId]);

    // Update selectedLote when lotes list refreshes (e.g. after adding input)
    useEffect(() => {
        if (selectedLote) {
            const freshLote = lotes.find(l => l.id === selectedLote.id);
            if (freshLote) {
                // Only update if content changed to avoid render loops, though React handles equality well enough
                if (JSON.stringify(freshLote) !== JSON.stringify(selectedLote)) {
                    setSelectedLote(freshLote);
                }
            }
        }
    }, [lotes]);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const loteId = draggableId;
        const newStageId = destination.droppableId;
        const targetStage = stages.find(s => s.id == newStageId);
        const lote = lotes.find(l => l.id == loteId);

        // Idempotency UX: Check if we already have inputs for this stage in this lote
        const alreadyVisited = lote?.inputs?.some(input => input.stage_id == newStageId);

        // If stage has inputs and we haven't visited it yet
        if (targetStage?.input_templates?.length > 0 && !alreadyVisited) {
            setPendingStageUpdate({ loteId, newStageId, targetStage, lote });
            setShowStageConfirmation(true);
        } else {
            executeStageUpdate(loteId, newStageId);
        }
    };

    const executeStageUpdate = (loteId, newStageId) => {
        router.put(route('operations.lotes.update-stage', { proyecto: proyecto.id, lote: loteId }), {
            stage_id: newStageId,
        }, {
            preserveScroll: true,
            onError: (errors) => {
                console.error("Failed to update stage", errors);
            }
        });
    };

    const handleConfirmStageUpdate = () => {
        if (pendingStageUpdate) {
            executeStageUpdate(pendingStageUpdate.loteId, pendingStageUpdate.newStageId);
            setShowStageConfirmation(false);
            setPendingStageUpdate(null);
        }
    };

    const currentProcess = processes.find(p => p.id == processIds);

    return (
        <AuthenticatedLayout
            user={auth.user}
            project={proyecto}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('mis-proyectos.show', { mis_proyecto: proyecto.id })}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        {proyecto.nombre}
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">/</span>
                    <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight flex items-center gap-2">
                        <FactoryIcon className="h-6 w-6" />
                        {t('operations.title', 'Operaciones')}
                    </h2>
                </div>
            }
        >
            <Head title={`Operaciones - ${proyecto.nombre}`} />

            <div className="h-[calc(100vh-65px)] flex flex-col"> {/* Full height minus header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="flex-1 md:w-64 flex gap-2">
                                <SelectInput
                                    value={currentProcess?.id || ''}
                                    onChange={handleProcessChange}
                                    className="w-full"
                                >
                                    {processes.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                    {processes.length === 0 && <option value="">{t('operations.no_processes', 'Sin procesos')}</option>}
                                </SelectInput>

                                <SecondaryButton onClick={() => setShowProcessModal(true)} title={t('operations.create_new_process', 'Nuevo Proceso')}>
                                    <PlusIcon className="w-5 h-5 text-gray-500" />
                                </SecondaryButton>

                                {currentProcess && (
                                    <SecondaryButton onClick={() => setShowManageProcessModal(true)} title={t('operations.manage_recipe', 'Gestionar Receta')}>
                                        <CogIcon className="w-5 h-5 text-gray-500" />
                                    </SecondaryButton>
                                )}
                            </div>

                            <PrimaryButton onClick={() => setShowCreateLote(true)} disabled={!currentProcess}>
                                <PlusIcon className="w-5 h-5 mr-2" />
                                {t('operations.create_lote_btn', 'Crear Lote')}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>

                {/* Filters & Kanban */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {/* ... (Filters if needed later) ... */}

                    <div className="flex-1 overflow-x-auto overflow-y-hidden">
                        {processes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <FactoryIcon className="h-16 w-16 mb-4 opacity-50" />
                                <p className="mb-4">{t('operations.no_processes_config', 'No hay procesos productivos configurados.')}</p>
                                <PrimaryButton onClick={() => setShowProcessModal(true)}>
                                    {t('operations.create_first_process', 'Crear Primer Proceso')}
                                </PrimaryButton>
                            </div>
                        ) : stages.length > 0 ? (
                            <KanbanBoard
                                stages={stages}
                                lotes={lotes}
                                onLoteClick={setSelectedLote}
                                onDragEnd={onDragEnd}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p>{t('operations.no_stages_defined', 'Este proceso no tiene etapas definidas.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreateLoteModal
                show={showCreateLote}
                onClose={() => setShowCreateLote(false)}
                proyecto={proyecto}
                processes={processes}
                members={members}
                defaultProcessId={processIds}
            />

            <CreateProcessModal
                show={showProcessModal}
                onClose={() => setShowProcessModal(false)}
                proyecto={proyecto}
                inventoryItems={inventoryItems}
            />

            {currentProcess && (
                <ManageProcessModal
                    show={showManageProcessModal}
                    onClose={() => setShowManageProcessModal(false)}
                    process={currentProcess}
                    stages={stages}
                    inventoryItems={inventoryItems}
                    proyecto={proyecto}
                />
            )}

            {selectedLote && (
                <LoteDetailsModal
                    show={!!selectedLote}
                    onClose={() => setSelectedLote(null)}
                    lote={selectedLote}
                    proyecto={proyecto}
                    inventoryItems={inventoryItems}
                />
            )}

            <StageConfirmationModal
                show={showStageConfirmation}
                onClose={() => setShowStageConfirmation(false)}
                onConfirm={handleConfirmStageUpdate}
                stage={pendingStageUpdate?.targetStage}
                lote={pendingStageUpdate?.lote}
            />
        </AuthenticatedLayout>
    );
}
