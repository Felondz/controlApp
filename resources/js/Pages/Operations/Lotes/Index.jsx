import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { FactoryIcon, PlusIcon } from '@/Components/Icons';
import KanbanBoard from '@/Components/Operations/Lotes/KanbanBoard';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';
import CreateLoteModal from '@/Components/Operations/Lotes/CreateLoteModal';
import CreateProcessModal from '@/Components/Operations/Lotes/CreateProcessModal';

export default function Index({ auth, proyecto, processes, selectedProcessId, stages, lotes, members }) {
    const { t } = useTranslate();
    const [processIds, setProcessId] = useState(selectedProcessId);
    const [showCreateLote, setShowCreateLote] = useState(false);
    const [showCreateProcess, setShowCreateProcess] = useState(false);

    const handleProcessChange = (e) => {
        const newProcessId = e.target.value;
        setProcessId(newProcessId);
        router.get(route('operations.lotes.index', { proyecto: proyecto.id }), { process_id: newProcessId }, { preserveState: true });
    };

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

        router.put(route('operations.lotes.update-stage', { proyecto: proyecto.id, lote: loteId }), {
            stage_id: newStageId,
        }, {
            preserveScroll: true,
            onError: (errors) => {
                console.error("Failed to update stage", errors);
            }
        });
    };

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
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <SelectInput
                                value={processIds}
                                onChange={handleProcessChange}
                                className="w-full sm:w-64"
                            >
                                {processes.length === 0 && <option value="">Sin procesos</option>}
                                {processes.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </SelectInput>

                            <SecondaryButton
                                onClick={() => setShowCreateProcess(true)}
                                title="Nuevo Proceso"
                                className="!px-3"
                            >
                                <PlusIcon className="h-4 w-4" />
                            </SecondaryButton>
                        </div>

                        <PrimaryButton
                            onClick={() => setShowCreateLote(true)}
                            disabled={processes.length === 0}
                        >
                            + Nuevo Lote
                        </PrimaryButton>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 p-6">
                    <div className="h-full max-w-7xl mx-auto">
                        {processes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <FactoryIcon className="h-16 w-16 mb-4 opacity-50" />
                                <p className="mb-4">No hay procesos productivos configurados.</p>
                                <PrimaryButton onClick={() => setShowCreateProcess(true)}>
                                    Crear Primer Proceso
                                </PrimaryButton>
                            </div>
                        ) : stages.length > 0 ? (
                            <KanbanBoard
                                stages={stages}
                                lotes={lotes}
                                onDragEnd={onDragEnd}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p>Este proceso no tiene etapas definidas.</p>
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
            />

            <CreateProcessModal
                show={showCreateProcess}
                onClose={() => setShowCreateProcess(false)}
                proyecto={proyecto}
            />
        </AuthenticatedLayout>
    );
}
