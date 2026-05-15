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
import { useOnboarding } from '@/Hooks/useOnboarding';

export default function Index({ auth, proyecto, tasks, categories }) {
    const { t } = useTranslate();
    useOnboarding('tasks');
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
            // Check if ANY of the task users matches the filter
            const matchesAssignee = filters.assignee === 'all' || (task.users && task.users.some(u => u.uuid === filters.assignee));
            const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

            // Hide completed tasks if they were completed before today (using updated_at as proxy)
            let isVisible = true;
            if (task.status === 'done') {
                const updatedDate = new Date(task.updated_at);
                const today = new Date();
                // Check if it's NOT the same day (and previous)
                const isSameDay = updatedDate.getDate() === today.getDate() &&
                    updatedDate.getMonth() === today.getMonth() &&
                    updatedDate.getFullYear() === today.getFullYear();

                if (!isSameDay) {
                    isVisible = false;
                }
            }

            return matchesSearch && matchesAssignee && matchesPriority && isVisible;
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

    const isFullTaskAdmin = (task) => {
        if (!task) return true;
        const isAdmin = proyecto.user_id === auth.user.id || 
                        auth.user.is_super_admin || 
                        (proyecto.miembros && proyecto.miembros.find(m => m.id === auth.user.id)?.pivot?.role === 'admin');
        const isCreator = Number(task.user_id) === Number(auth.user.id);
        return isAdmin || isCreator;
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const taskUuid = result.draggableId;
            const newStatus = destination.droppableId;
            const task = localTasks.find(t => t.uuid === taskUuid);

            if (!task) return;

            // 1. Optimistic Update
            const now = new Date().toISOString();
            const updatedTasks = localTasks.map(t =>
                t.uuid === taskUuid ? { ...t, status: newStatus, updated_at: now } : t
            );
            setLocalTasks(updatedTasks);

            // 2. API Call
            try {
                await axios.put(route('mis-proyectos.tasks.update', { proyecto: proyecto.uuid, task: task.uuid }), {
                    title: task.title,
                    status: newStatus,
                    priority: task.priority,
                    description: task.description,
                    due_date: task.due_date,
                    related_type: task.related_type,
                    related_id: task.related_id
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
            router.delete(route('mis-proyectos.tasks.destroy', { proyecto: proyecto.uuid, task: task.uuid }), {
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
            header={<h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">{t('modules.tasks')}</h2>}
            project={proyecto}
        >
            <Head title={`${t('modules.tasks')} | ${proyecto.nombre}`} />

            <div className="py-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
                        <h3 id="tour-task-board" className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {t('tasks.board', 'Tablero de Tareas')}
                        </h3>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                            {/* Filters */}
                            <div id="tour-task-filters" className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all group">
                                <div className="relative flex-1 sm:flex-none">
                                    <SearchIcon className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder={t('common.search', 'Buscar...')}
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        className="pl-8 pr-2 py-1.5 text-sm border-none focus:ring-0 bg-transparent w-full sm:w-32 md:w-48 dark:text-white placeholder-gray-400"
                                    />
                                </div>

                                <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                                <div className="block sm:hidden h-px w-full bg-gray-200 dark:bg-gray-700"></div>

                                <div className="flex gap-2">
                                    <select
                                        value={filters.priority}
                                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                                        className="flex-1 text-sm border-none focus:ring-0 bg-transparent py-1.5 pr-8 dark:text-gray-300 cursor-pointer hover:text-primary-600 transition-colors"
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
                                        className="flex-1 text-sm border-none focus:ring-0 bg-transparent py-1.5 pr-8 dark:text-gray-300 cursor-pointer hover:text-primary-600 transition-colors"
                                    >
                                        <option value="all">{t('tasks.all_assignees', 'Todos')}</option>
                                        {proyecto.miembros.map(member => (
                                            <option key={member.uuid} value={member.uuid}>{member.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                id="tour-task-create"
                                onClick={handleCreateTask}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all text-sm font-medium whitespace-nowrap w-full md:w-auto"
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span className="inline">{t('tasks.create', 'Nueva Tarea')}</span>
                            </button>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex-1 grid grid-cols-3 gap-1.5 md:gap-6 pb-4 -mx-2 px-2 md:mx-0 md:px-0">
                            {Object.entries(columns).map(([columnId, column]) => (
                                <div key={columnId} className="flex flex-col bg-gray-100 dark:bg-gray-900 rounded-lg md:rounded-xl p-1.5 md:p-4 h-full min-w-0">
                                    <h4 className="font-semibold text-xs md:text-base text-gray-700 dark:text-gray-300 mb-2 md:mb-3 flex flex-col md:flex-row items-start md:items-center justify-between sticky top-0 bg-gray-100 dark:bg-gray-900 z-10 py-1 gap-1">
                                        <span className="truncate w-full">{column.title}</span>
                                        <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full self-start md:self-auto">
                                            {column.items.length}
                                        </span>
                                    </h4>
                                    <Droppable droppableId={columnId}>
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="flex-1 space-y-1.5 md:space-y-3 overflow-y-auto overflow-x-hidden min-h-[100px] pr-0.5 md:pr-1 scrollbar-thin"
                                            >
                                                {column.items.map((task, index) => (
                                                    <Draggable key={task.uuid} draggableId={task.uuid} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                onClick={() => handleEditTask(task)}
                                                                className={`p-2 md:p-3 rounded-md md:rounded-lg shadow-sm border transition-all cursor-pointer group relative flex flex-col xl:flex-row xl:items-center xl:gap-3 ${getStatusColor(task.status)} hover:shadow-md active:scale-95 touch-manipulation min-h-[80px] xl:min-h-[48px]`}
                                                            >
                                                                {/* Absolute Delete Button */}
                                                                {isFullTaskAdmin(task) && (
                                                                    <button
                                                                        onClick={(e) => handleDeleteTask(e, task)}
                                                                        className="absolute top-1 right-1 xl:top-1/2 xl:-translate-y-1/2 xl:right-2 text-gray-400 hover:text-red-500 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 p-1 z-10"
                                                                        title={t('common.delete', 'Eliminar')}
                                                                    >
                                                                        <TrashIcon className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}

                                                                {/* Left: Priority & Title */}
                                                                <div className="flex flex-col xl:flex-row xl:items-center gap-1.5 xl:gap-3 flex-1 min-w-0 pr-6 xl:pr-8">
                                                                    <div className="flex items-center justify-between xl:justify-start">
                                                                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${getPriorityBadge(task.priority)}`}>
                                                                            {t(`tasks.priority.${task.priority}`, task.priority).substring(0, 3)}
                                                                        </span>
                                                                    </div>

                                                                    <h5 className="font-medium text-xs md:text-sm text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 xl:line-clamp-1 leading-tight">
                                                                        {task.title}
                                                                    </h5>
                                                                </div>

                                                                {/* Right: Meta Info */}
                                                                <div className="flex items-center gap-2 mt-1 xl:mt-0 xl:flex-shrink-0 pr-4 xl:pr-6">
                                                                    {/* Due Date */}
                                                                    {task.due_date && (
                                                                        <div className={`text-[10px] flex items-center gap-1 ${new Date(task.due_date) < new Date() && task.status !== 'done'
                                                                            ? 'text-red-600 dark:text-red-400 font-medium'
                                                                            : 'text-gray-500 dark:text-gray-400'
                                                                            }`}>
                                                                            <ClockIcon className="w-3 h-3" />
                                                                            <span className="truncate hidden xl:inline">
                                                                                {new Date(task.due_date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
                                                                            </span>
                                                                            <span className="truncate xl:hidden">
                                                                                {new Date(task.due_date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {/* Financial Indicator */}
                                                                    {task.is_financial && (
                                                                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/50 dark:bg-black/20 rounded border border-gray-100 dark:border-gray-700">
                                                                            <CurrencyDollarIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                                            <span className="text-[10px] font-semibold text-green-700 dark:text-green-300">
                                                                                {new Intl.NumberFormat('es-CO', {
                                                                                    style: 'currency',
                                                                                    currency: proyecto.moneda_default || 'COP',
                                                                                    maximumFractionDigits: 0,
                                                                                    notation: "compact"
                                                                                }).format(task.amount)}
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {/* Users */}
                                                                    {task.users && task.users.length > 0 && (
                                                                        <div className="flex items-center -space-x-1.5 overflow-hidden">
                                                                            {task.users.slice(0, 3).map((user) => (
                                                                                <div key={user.uuid} className="inline-flex h-5 w-5 rounded-full ring-1 ring-white dark:ring-gray-800 bg-primary-100 items-center justify-center text-[8px] font-bold text-primary-700 overflow-hidden" title={user.name}>
                                                                                    {user.profile_photo_url ? (
                                                                                        <img src={user.profile_photo_url} alt={user.name} className="h-full w-full object-cover" />
                                                                                    ) : (
                                                                                        user.name.charAt(0)
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                            {task.users.length > 3 && (
                                                                                <div className="inline-flex h-5 w-5 rounded-full ring-1 ring-white dark:ring-gray-800 bg-gray-100 items-center justify-center text-[8px] font-bold text-gray-600">
                                                                                    +{task.users.length - 3}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {/* Image Indicator */}
                                                                    {task.image_url && (
                                                                        <div className="flex items-center justify-center h-5 w-5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" title={t('tasks.has_image', 'Tiene imagen')}>
                                                                            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
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
