import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { useState, useMemo } from 'react';
import { PlusIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, TrashIcon, CurrencyDollarIcon, SearchIcon, FunnelIcon } from '@/Components/Icons';
import PrimaryButton from '@/Components/PrimaryButton';
import TaskModal from '@/Components/Tasks/TaskModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import Dropdown from '@/Components/Dropdown';
import TextInput from '@/Components/TextInput';

export default function Index({ auth, proyecto, tasks, categories }) {
    const { t } = useTranslate();
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Filters State
    const [filters, setFilters] = useState({
        search: '',
        assignee: 'all',
        priority: 'all'
    });

    const [localTasks, setLocalTasks] = useState(tasks);

    // Sync local state with props
    useMemo(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    // Derived state for filtered tasks
    const filteredTasks = useMemo(() => {
        return localTasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase());
            const matchesAssignee = filters.assignee === 'all' || task.assigned_to === parseInt(filters.assignee);
            const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
            return matchesSearch && matchesAssignee && matchesPriority;
        });
    }, [localTasks, filters]);

    // Group tasks by status
    const columns = {
        todo: {
            id: 'todo',
            title: t('tasks.todo', 'Por Hacer'),
            items: filteredTasks.filter(t => t.status === 'todo')
        },
        in_progress: {
            id: 'in_progress',
            title: t('tasks.in_progress', 'En Progreso'),
            items: filteredTasks.filter(t => t.status === 'in_progress')
        },
        done: {
            id: 'done',
            title: t('tasks.done', 'Hecho'),
            items: filteredTasks.filter(t => t.status === 'done')
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const taskId = parseInt(result.draggableId);
            const newStatus = destination.droppableId;

            // 1. Optimistic Update
            const updatedTasks = localTasks.map(t =>
                t.id === taskId ? { ...t, status: newStatus } : t
            );
            setLocalTasks(updatedTasks);

            // 2. API Call
            try {
                await axios.put(route('mis-proyectos.tasks.update', { proyecto: proyecto.id, task: taskId }), {
                    ...localTasks.find(t => t.id === taskId),
                    status: newStatus
                });

                // 3. Silent Reload (optional, but good for consistency)
                router.reload({ only: ['tasks'], preserveScroll: true, preserveState: true });
            } catch (error) {
                console.error('Error updating task status:', error);
                // Revert on error
                setLocalTasks(localTasks);
                alert(t('tasks.update_error', 'Error al actualizar la tarea'));
            }
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

    const handleDeleteTask = (e, task) => {
        e.stopPropagation();
        if (confirm(t('tasks.confirm_delete', '¿Estás seguro de eliminar esta tarea?'))) {
            router.delete(route('mis-proyectos.tasks.destroy', { proyecto: proyecto.id, task: task.id }), {
                onSuccess: () => router.reload()
            });
        }
    };

    const handleTaskSuccess = () => {
        setShowTaskModal(false);
        router.reload();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'done': return 'border-green-500 bg-green-50 dark:bg-green-900/10';
            case 'in_progress': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/10';
            case 'todo': default: return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
            case 'medium': return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'low': return 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
            default: return 'text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                            {t('tasks.board', 'Tablero de Tareas')}
                        </h3>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="relative flex-1 sm:flex-none">
                                    <SearchIcon className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={t('common.search', 'Buscar...')}
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        className="pl-8 pr-2 py-1.5 text-sm border-none focus:ring-0 bg-transparent w-full sm:w-32 md:w-48 dark:text-white"
                                    />
                                </div>

                                <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                                <div className="block sm:hidden h-px w-full bg-gray-200 dark:bg-gray-700"></div>

                                <div className="flex gap-2">
                                    <select
                                        value={filters.priority}
                                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                                        className="flex-1 text-sm border-none focus:ring-0 bg-transparent py-1.5 pr-8 dark:text-gray-300 cursor-pointer"
                                    >
                                        <option value="all">{t('tasks.all_priorities', 'Todas')}</option>
                                        <option value="high">{t('tasks.priority.high', 'Alta')}</option>
                                        <option value="medium">{t('tasks.priority.medium', 'Media')}</option>
                                        <option value="low">{t('tasks.priority.low', 'Baja')}</option>
                                    </select>

                                    <div className="w-px bg-gray-200 dark:bg-gray-700"></div>

                                    <select
                                        value={filters.assignee}
                                        onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                                        className="flex-1 text-sm border-none focus:ring-0 bg-transparent py-1.5 pr-8 dark:text-gray-300 cursor-pointer"
                                    >
                                        <option value="all">{t('tasks.all_assignees', 'Todos')}</option>
                                        {proyecto.miembros.map(member => (
                                            <option key={member.id} value={member.id}>{member.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <PrimaryButton onClick={handleCreateTask} className="flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto">
                                <PlusIcon className="w-5 h-5" />
                                <span className="inline">{t('tasks.create', 'Nueva Tarea')}</span>
                            </PrimaryButton>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex-1 flex md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-pl-4 -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide">
                            {Object.entries(columns).map(([columnId, column]) => (
                                <div key={columnId} className="flex flex-col bg-gray-100 dark:bg-gray-900 rounded-xl p-3 md:p-4 h-full min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center shrink-0 md:shrink first:ml-4 md:first:ml-0 last:mr-4 md:last:mr-0">
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between sticky top-0 bg-gray-100 dark:bg-gray-900 z-10 py-1">
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
                                                className="flex-1 space-y-2 md:space-y-3 overflow-y-auto min-h-[100px] pr-1 scrollbar-thin"
                                            >
                                                {column.items.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                onClick={() => handleEditTask(task)}
                                                                className={`p-3 md:p-4 rounded-lg shadow-sm border transition-all cursor-pointer group relative ${getStatusColor(task.status)} hover:shadow-md active:scale-95 touch-manipulation`}
                                                            >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getPriorityBadge(task.priority)}`}>
                                                                        {t(`tasks.priority.${task.priority}`, task.priority)}
                                                                    </span>

                                                                    <button
                                                                        onClick={(e) => handleDeleteTask(e, task)}
                                                                        className="text-gray-400 hover:text-red-500 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 p-1"
                                                                        title={t('common.delete', 'Eliminar')}
                                                                    >
                                                                        <TrashIcon className="w-4 h-4" />
                                                                    </button>
                                                                </div>

                                                                <h5 className="font-medium text-sm md:text-base text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                                                    {task.title}
                                                                </h5>

                                                                {task.due_date && (
                                                                    <div className={`text-[10px] md:text-xs flex items-center gap-1 mt-2 ${new Date(task.due_date) < new Date() && task.status !== 'done'
                                                                        ? 'text-red-600 dark:text-red-400 font-medium'
                                                                        : 'text-gray-500 dark:text-gray-400'
                                                                        }`}>
                                                                        <ClockIcon className="w-3 h-3" />
                                                                        {new Date(task.due_date).toLocaleDateString()}
                                                                        {new Date(task.due_date) < new Date() && task.status !== 'done' && (
                                                                            <span className="ml-1">({t('tasks.overdue', 'Vencida')})</span>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* Financial Indicator */}
                                                                {task.is_financial && (
                                                                    <div className="flex items-center gap-2 mt-2 p-1.5 bg-white/50 dark:bg-black/20 rounded border border-gray-100 dark:border-gray-700">
                                                                        <CurrencyDollarIcon className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                                                        <span className="text-[10px] md:text-xs font-semibold text-green-700 dark:text-green-300">
                                                                            {new Intl.NumberFormat('es-CO', {
                                                                                style: 'currency',
                                                                                currency: proyecto.moneda_default || 'COP'
                                                                            }).format(task.amount)}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {task.assignee && (
                                                                    <div className="mt-2 md:mt-3 flex items-center gap-2">
                                                                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold">
                                                                            {task.assignee.name.charAt(0)}
                                                                        </div>
                                                                        <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
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
