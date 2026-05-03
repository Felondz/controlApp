import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { FactoryIcon, PlusIcon, CogIcon, BeakerIcon, ClockIcon } from '@/Components/Icons';
import KanbanBoard from '@/Components/Operations/Lotes/KanbanBoard';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState, useEffect } from 'react';
import { useOnboarding } from '@/Hooks/useOnboarding';
import CreateLoteModal from '@/Components/Operations/Lotes/CreateLoteModal';
import CreateProcessModal from '@/Components/Operations/Lotes/CreateProcessModal';
import LoteDetailsModal from '@/Components/Operations/Lotes/LoteDetailsModal';
import ManageProcessModal from '@/Components/Operations/Lotes/ManageProcessModal';
import StageConfirmationModal from '@/Components/Operations/Lotes/StageConfirmationModal';

export default function Index({ auth, proyecto, processes, selectedProcessId, stages, lotes, members, inventoryItems }) {
    const { t } = useTranslate();
    useOnboarding('operations');
    const [processIds, setProcessId] = useState(selectedProcessId);
    const [showCreateLote, setShowCreateLote] = useState(false);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showManageProcessModal, setShowManageProcessModal] = useState(false);
    const [selectedLote, setSelectedLote] = useState(null);
    const [showStageConfirmation, setShowStageConfirmation] = useState(false);
    const [pendingStageUpdate, setPendingStageUpdate] = useState(null);
    const [initialIsFinishing, setInitialIsFinishing] = useState(false); // To open modal in finish mode directly

    // Calculate last stage ID for the current process
    const lastStageId = stages.length > 0
        ? stages.reduce((prev, current) => (prev.order > current.order) ? prev : current).id
        : null;

    const handleProcessChange = (e) => {
        router.get(route('operations.lotes.index', {
            proyecto: proyecto.uuid,
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

        const hasInputs = (targetStage?.input_templates?.length > 0 || targetStage?.inputTemplates?.length > 0);

        if (hasInputs) {
            setPendingStageUpdate({ loteId, newStageId, targetStage, lote });
            setShowStageConfirmation(true);
        } else {
            executeStageUpdate(loteId, newStageId);
        }
    };

    const executeStageUpdate = (loteId, newStageId, options = {}) => {
        router.put(route('operations.lotes.update-stage', { proyecto: proyecto.uuid, lote: loteId }), {
            stage_id: newStageId,
            consume_inputs: options.consume_inputs || false,
        }, {
            preserveScroll: true,
            onError: (errors) => {
                console.error("Failed to update stage", errors);
            }
        });
    };

    const handleConfirmStageUpdate = () => {
        if (pendingStageUpdate) {
            executeStageUpdate(
                pendingStageUpdate.loteId,
                pendingStageUpdate.newStageId,
                { consume_inputs: true }
            );
            setShowStageConfirmation(false);
            setPendingStageUpdate(null);
        }
    };

    const currentProcess = processes.find(p => p.id == processIds);

    const handleCloseProcessModal = () => {
        setShowManageProcessModal(false);
        const url = new URL(window.location.href);
        if (url.searchParams.has('open_modal')) {
            url.searchParams.delete('open_modal');
            window.history.replaceState({}, '', url);
        }
    };

    const handleFinishLote = (lote) => {
        setSelectedLote(lote);
        setInitialIsFinishing(true);
    };

    const handleCloseLoteModal = () => {
        setSelectedLote(null);
        setInitialIsFinishing(false);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            project={proyecto}
            header={
                <div className="flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm rounded-lg p-2 -my-2">
                    <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight flex items-center gap-2">
                        <FactoryIcon className="h-6 w-6" />
                        {t('operations.title', 'Operaciones')}
                    </h2>
                </div>
            }
        >
            <Head title={`Operaciones - ${proyecto.nombre}`} />

            <div className={"h-[calc(100vh-65px)] flex flex-col"}>
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 m-4 rounded-xl shadow-sm shrink-0">
                    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2 w-full md:w-auto items-center">
                            <div id="tour-operations-process" className="flex-1 md:w-96 flex gap-2">
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

                                <SecondaryButton
                                    onClick={() => setShowProcessModal(true)}
                                    title={t('operations.create_new_process', 'Nuevo Proceso')}
                                    className="hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </SecondaryButton>

                                {currentProcess && (
                                    <SecondaryButton
                                        onClick={() => setShowManageProcessModal(true)}
                                        title={t('operations.manage_recipe', 'Gestionar Receta')}
                                        className="hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                                    >
                                        <BeakerIcon className="w-5 h-5" />
                                    </SecondaryButton>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex justify-end gap-2">
                            <Link
                                href={route('operations.lotes.history', { proyecto: proyecto.uuid })}
                                className="inline-flex items-center rounded-lg border border-transparent bg-primary-50 px-4 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-100 hover:text-primary-800 focus:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:bg-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-300 dark:focus:bg-primary-900/30 dark:active:bg-primary-900/40 transition ease-in-out duration-150"
                            >
                                <ClockIcon className="w-5 h-5 md:mr-2" />
                                <span className="hidden md:inline">{t('operations.history_button', 'Historial')}</span>
                            </Link>
                            <PrimaryButton id="tour-operations-create" onClick={() => setShowCreateLote(true)} disabled={!currentProcess}>
                                <PlusIcon className="w-5 h-5 md:mr-2" />
                                <span className="hidden md:inline">{t('operations.create_lote_btn', 'Crear Lote')}</span>
                            </PrimaryButton>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <div id="tour-operations-kanban" className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin">
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
                                onLoteClick={(lote) => {
                                    setSelectedLote(lote);
                                    setInitialIsFinishing(false);
                                }}
                                onDragEnd={onDragEnd}
                                lastStageId={lastStageId}
                                onFinishLote={handleFinishLote}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p>{t('operations.no_stages_defined', 'Este proceso no tiene etapas definidas.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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

            {
                currentProcess && (
                    <ManageProcessModal
                        show={showManageProcessModal}
                        onClose={handleCloseProcessModal}
                        process={currentProcess}
                        stages={stages}
                        inventoryItems={inventoryItems}
                        proyecto={proyecto}
                    />
                )
            }

            {
                selectedLote && (
                    <LoteDetailsModal
                        show={!!selectedLote}
                        onClose={handleCloseLoteModal}
                        initialIsFinishing={initialIsFinishing}
                        lote={selectedLote}
                        proyecto={proyecto}
                        stages={stages}
                        inventoryItems={inventoryItems}
                        members={members}
                    />
                )
            }

            <StageConfirmationModal
                show={showStageConfirmation}
                onClose={() => setShowStageConfirmation(false)}
                onConfirm={handleConfirmStageUpdate}
                stage={pendingStageUpdate?.targetStage}
                lote={pendingStageUpdate?.lote}
            />
        </AuthenticatedLayout >
    );
}
