import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { useState } from 'react';
import { PlusIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@/Components/Icons';
import PrimaryButton from '@/Components/PrimaryButton';
import TaskModal from '@/Components/Tasks/TaskModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';

export default function Index({ auth, proyecto, tasks, categories }) {
    const { t } = useTranslate();
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Group tasks by status
    const [columns, setColumns] = useState({
        todo: {
            id: 'todo',
            title: t('tasks.todo', 'Por Hacer'),
            items: tasks.filter(t => t.status === 'todo')
        },
        in_progress: {
            id: 'in_progress',
            title: t('tasks.in_progress', 'En Progreso'),
            items: tasks.filter(t => t.status === 'in_progress')
        },
        done: {
            id: 'done',
            title: t('tasks.done', 'Hecho'),
            items: tasks.filter(t => t.status === 'done')
        }
    });

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);

            // Optimistic update
            const newStatus = destination.droppableId;
            const updatedTask = { ...removed, status: newStatus };
            destItems.splice(destination.index, 0, updatedTask);

            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems }
            });

            // API Call
            try {
                await axios.put(route('tasks.update', [proyecto.id, removed.id]), {
                    ...removed,
                    status: newStatus
                });
            } catch (error) {
                console.error('Error updating task status:', error);
                // Revert on error (could be improved)
                router.reload();
            }
        } else {
            // Reordering within same column (not implemented in backend yet, just UI)
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: { ...column, items: copiedItems }
            });
        }
    };

    const handleCreateTask = () => {
        setSelectedTask(null);
        setShowTaskModal(true);
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setShowTaskModal(true);
    };

    const handleTaskSuccess = () => {
        setShowTaskModal(false);
        router.reload();
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
            case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
            case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('modules.tasks')}</h2>}
            project={proyecto}
        >
            <Head title={`${t('modules.tasks')} | ${proyecto.nombre}`} />

            <div className="py-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('tasks.board', 'Tablero de Tareas')}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Quick Filters */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const filtered = tasks.filter(t => t.assigned_to === auth.user.id);
                                        setColumns({
                                            todo: { ...columns.todo, items: filtered.filter(t => t.status === 'todo') },
                                            in_progress: { ...columns.in_progress, items: filtered.filter(t => t.status === 'in_progress') },
                                            done: { ...columns.done, items: filtered.filter(t => t.status === 'done') }
                                        });
                                    }}
                                    className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {t('tasks.my_tasks', 'Mis Tareas')}
                                </button>
                                <button
                                    onClick={() => {
                                        const filtered = tasks.filter(t => t.priority === 'high');
                                        setColumns({
                                            todo: { ...columns.todo, items: filtered.filter(t => t.status === 'todo') },
                                            in_progress: { ...columns.in_progress, items: filtered.filter(t => t.status === 'in_progress') },
                                            done: { ...columns.done, items: filtered.filter(t => t.status === 'done') }
                                        });
                                    }}
                                    className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                >
                                    {t('tasks.high_priority', 'Alta Prioridad')}
                                </button>
                                <button
                                    onClick={() => {
                                        setColumns({
                                            todo: { ...columns.todo, items: tasks.filter(t => t.status === 'todo') },
                                            in_progress: { ...columns.in_progress, items: tasks.filter(t => t.status === 'in_progress') },
                                            done: { ...columns.done, items: tasks.filter(t => t.status === 'done') }
                                        });
                                    }}
                                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {t('common.clear', 'Limpiar')}
                                </button>
                            </div>

                            <PrimaryButton onClick={handleCreateTask} className="flex items-center gap-2">
                                <PlusIcon className="w-5 h-5" />
                                {t('tasks.create', 'Nueva Tarea')}
                            </PrimaryButton>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
                            {Object.entries(columns).map(([columnId, column]) => (
                                <div key={columnId} className="flex flex-col bg-gray-100 dark:bg-gray-900 rounded-xl p-4 h-full min-w-[300px]">
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-between">
                                        {column.title}
                                        <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                                            {column.items.length}
                                        </span>
                                    </h4>
                                    <Droppable droppableId={columnId}>
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="flex-1 space-y-3 overflow-y-auto min-h-[100px]"
                                            >
                                                {column.items.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                onClick={() => handleEditTask(task)}
                                                                className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border transition-shadow cursor-pointer group ${task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
                                                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/10 hover:shadow-red-200 dark:hover:shadow-red-900/50'
                                                                    : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
                                                                    }`}
                                                            >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                                                                        {t(`tasks.priority.${task.priority}`, task.priority)}
                                                                    </span>
                                                                    {task.due_date && (
                                                                        <span className={`text-xs flex items-center gap-1 font-medium ${new Date(task.due_date) < new Date() && task.status !== 'done'
                                                                            ? 'text-red-600 dark:text-red-400'
                                                                            : 'text-gray-500 dark:text-gray-400'
                                                                            }`}>
                                                                            <ClockIcon className="w-3 h-3" />
                                                                            {new Date(task.due_date).toLocaleDateString()}
                                                                            {new Date(task.due_date) < new Date() && task.status !== 'done' && (
                                                                                <span className="ml-1">({t('tasks.overdue', 'Vencida')})</span>
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <h5 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                                    {task.title}
                                                                </h5>

                                                                {/* Financial Indicator */}
                                                                {task.is_financial && (
                                                                    <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                                                                        <CurrencyDollarIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                                        <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                                                                            {new Intl.NumberFormat('es-CO', {
                                                                                style: 'currency',
                                                                                currency: proyecto.moneda_default || 'COP'
                                                                            }).format(task.amount)}
                                                                        </span>
                                                                        {task.category && (
                                                                            <span className="text-xs text-green-600 dark:text-green-400">
                                                                                • {task.category.nombre}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {task.assignee && (
                                                                    <div className="mt-3 flex items-center gap-2">
                                                                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                                                                            {task.assignee.name.charAt(0)}
                                                                        </div>
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                            {task.assignee.name}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </div>
            </div>

            <TaskModal
                show={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                task={selectedTask}
                project={proyecto}
                categories={categories}
                onSuccess={handleTaskSuccess}
            />
        </AuthenticatedLayout>
    );
}
