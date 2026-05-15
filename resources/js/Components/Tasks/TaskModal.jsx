import { useForm, router, usePage } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { TrashIcon, InformationCircleIcon } from '@/Components/Icons';
import { useEffect, useState, useMemo } from 'react';
import MediaGallery from '@/Components/Common/MediaGallery';
import CommentSection from '@/Components/Common/CommentSection';
import MultiImageUploader from '@/Components/Common/MultiImageUploader';

export default function TaskModal({ show, onClose, task, project, categories = [], onSuccess }) {
    const { t } = useTranslate();
    const { auth } = usePage().props;
    const [isCommenting, setIsCommenting] = useState(false);

    // Permission check: only admin or creator can edit full task
    const canEditFullTask = useMemo(() => {
        if (!task) return true; // Creating new task is always allowed if you can see the modal
        
        const isAdmin = project.user_id === auth.user.id || 
                        auth.user.is_super_admin || 
                        (project.miembros && project.miembros.find(m => m.id === auth.user.id)?.pivot?.role === 'admin');
        const isCreator = Number(task.user_id) === Number(auth.user.id);
        
        return isAdmin || isCreator;
    }, [task, project, auth.user]);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        assignees: [],
        image: null,
        images: [],
        _method: 'POST',
    });

    useEffect(() => {
        if (show) {
            clearErrors();
            if (task) {
                setData({
                    title: task.title,
                    description: task.description || '',
                    status: task.status,
                    priority: task.priority,
                    due_date: task.due_date || '',
                    assignees: task.users ? task.users.map(u => u.id) : (task.assigned_to ? [task.assigned_to] : []),
                    image: null,
                    images: [],
                    _method: 'PUT',
                });
            } else {
                setData({
                    title: '',
                    description: '',
                    status: 'todo',
                    priority: 'medium',
                    due_date: '',
                    assignees: [],
                    image: null,
                    images: [],
                    _method: 'POST',
                });
            }
        }
    }, [task, show]);

    const submit = (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                reset();
                onSuccess();
            },
            onError: (errs) => {
                if (Object.keys(errs).length > 0) {
                    // Let the inline error messages handle it
                }
            },
            forceFormData: true,
        };

        if (task) {
            post(route('mis-proyectos.tasks.update', { proyecto: project.uuid, task: task.uuid }), options);
        } else {
            post(route('mis-proyectos.tasks.store', { proyecto: project.uuid }), options);
        }
    };

    const handleAddComment = (content, mentionedUserIds, callback) => {
        setIsCommenting(true);
        router.post(route('mis-proyectos.tasks.comments.store', { proyecto: project.uuid, task: task.uuid }), 
        { content, mentioned_user_ids: mentionedUserIds }, 
        {
            onSuccess: () => {
                setIsCommenting(false);
                callback();
                // We don't need to manually update task.comments because Inertia reloads the page/props
            },
            onError: () => setIsCommenting(false),
            preserveScroll: true
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex-none flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        {task?.task_id_string && (
                            <span className="text-primary-600 dark:text-primary-400 font-mono text-sm bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">
                                {task.task_id_string}
                            </span>
                        )}
                        {task ? t('tasks.edit', 'Editar Tarea') : t('tasks.create', 'Nueva Tarea')}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Form */}
                        <form onSubmit={submit} id="task-form" className="space-y-6">
                            {/* Gallery - Show existing images */}
                            {task?.images && task.images.length > 0 && (
                                <MediaGallery images={task.images} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700" />
                            )}

                            {/* MultiImage Uploader */}
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <MultiImageUploader
                                    label={t('tasks.add_images', 'Añadir Imágenes / Evidencia')}
                                    images={data.images}
                                    onChange={(files) => setData('images', files)}
                                    error={errors.images}
                                    className="w-full"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <InputLabel htmlFor="title" value={t('tasks.title', 'Título')} />
                                <TextInput
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                    disabled={!canEditFullTask}
                                />
                                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value={t('tasks.description', 'Descripción')} />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                    rows="3"
                                    disabled={!canEditFullTask}
                                />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Status */}
                                <div>
                                    <InputLabel htmlFor="status" value={t('tasks.status', 'Estado')} />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm py-2"
                                    >
                                        <option value="todo">{t('tasks.todo', 'Por Hacer')}</option>
                                        <option value="in_progress">{t('tasks.in_progress', 'En Progreso')}</option>
                                        <option value="done">{t('tasks.done', 'Hecho')}</option>
                                    </select>
                                    {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
                                </div>

                                {/* Priority */}
                                <div>
                                    <InputLabel htmlFor="priority" value={t('tasks.priority_label', 'Prioridad')} />
                                    <select
                                        id="priority"
                                        value={data.priority}
                                        onChange={(e) => setData('priority', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm py-2"
                                        disabled={!canEditFullTask}
                                    >
                                        <option value="low">{t('tasks.priority.low', 'Baja')}</option>
                                        <option value="medium">{t('tasks.priority.medium', 'Media')}</option>
                                        <option value="high">{t('tasks.priority.high', 'Alta')}</option>
                                    </select>
                                    {errors.priority && <p className="text-sm text-red-600 mt-1">{errors.priority}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Due Date */}
                                <div>
                                    <InputLabel htmlFor="due_date" value={t('tasks.due_date', 'Fecha Límite')} />
                                    <TextInput
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="mt-1 block w-full"
                                        disabled={!canEditFullTask}
                                    />
                                    {errors.due_date && <p className="text-sm text-red-600 mt-1">{errors.due_date}</p>}
                                </div>

                                {/* Assignees (Multi-Select) */}
                                <div className="sm:col-span-2">
                                    <InputLabel value={t('tasks.assignees', 'Asignados')} />
                                    <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 max-h-32 overflow-y-auto overflow-x-hidden scrollbar-thin">
                                        {project.miembros?.map((member) => {
                                            const isSelected = data.assignees.includes(member.id);
                                            return (
                                                <button
                                                    key={member.id}
                                                    type="button"
                                                    onClick={() => {
                                                        if (!canEditFullTask) return;
                                                        const newAssignees = isSelected
                                                            ? data.assignees.filter(id => id !== member.id)
                                                            : [...data.assignees, member.id];
                                                        setData('assignees', newAssignees);
                                                    }}
                                                    className={`
                                                        flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border
                                                        ${!canEditFullTask ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
                                                        ${isSelected
                                                            ? 'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-900/40 dark:text-primary-300 dark:border-primary-700'
                                                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                                                        }
                                                    `}
                                                >
                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${isSelected ? 'bg-primary-200 text-primary-800' : 'bg-gray-200 text-gray-600'}`}>
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    {member.name.split(' ')[0]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Right Column: Comments Section - Only show when editing */}
                        <div className="border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-700 pt-8 lg:pt-0 lg:pl-8 h-full flex flex-col">
                            {task ? (
                                <CommentSection 
                                    comments={task.comments || []} 
                                    onAddComment={handleAddComment}
                                    isSubmitting={isCommenting}
                                    className="flex-1 flex flex-col"
                                    projectMembers={project.miembros || []}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 space-y-4">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-sm text-center px-4">
                                        {t('tasks.comments_available_after_creation', 'La sección de comentarios estará disponible una vez que crees la tarea.')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between gap-3 flex-none">
                    {task && (
                        <DangerButton
                            type="button"
                            onClick={() => {
                                if (confirm(t('tasks.confirm_delete', '¿Estás seguro de eliminar esta tarea?'))) {
                                    router.delete(route('mis-proyectos.tasks.destroy', { proyecto: project.uuid, task: task.uuid }), {
                                        onSuccess: () => {
                                            onClose();
                                            onSuccess();
                                        }
                                    });
                                }
                            }}
                            className="flex items-center gap-2"
                        >
                            <TrashIcon className="w-4 h-4" />
                            {t('common.delete', 'Eliminar')}
                        </DangerButton>
                    )}
                    <div className="flex gap-3 ml-auto">
                        <SecondaryButton onClick={onClose} disabled={processing} type="button">
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>
                        <PrimaryButton form="task-form" disabled={processing} type="submit">
                            {task ? t('common.update', 'Actualizar') : t('common.create', 'Crear')}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

