import { useForm, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { TrashIcon, InformationCircleIcon } from '@/Components/Icons';
import { useEffect } from 'react';

export default function TaskModal({ show, onClose, task, project, categories = [], onSuccess }) {
    const { t } = useTranslate();

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        assignees: [], // Changed from assigned_to to array
    });

    useEffect(() => {
        if (task) {
            setData({
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority,
                due_date: task.due_date || '',
                assignees: task.users ? task.users.map(u => u.id) : (task.assigned_to ? [task.assigned_to] : []),
            });
        } else {
            setData({
                title: '',
                description: '',
                status: 'todo',
                priority: 'medium',
                due_date: '',
                assignees: [], // Changed from assigned_to to array
            });
        }
    }, [task, show]);

    const submit = (e) => {
        e.preventDefault();

        // Transform empty strings to null for nullable fields
        const formData = {
            ...data,
            assignees: data.assignees,
            due_date: data.due_date || null,
        };

        const options = {
            onSuccess: () => {
                reset();
                onSuccess();
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    alert(Object.values(errors)[0]);
                }
            }
        };

        if (task) {
            put(route('mis-proyectos.tasks.update', { proyecto: project.id, task: task.id }), { ...options, data: formData });
        } else {
            post(route('mis-proyectos.tasks.store', { proyecto: project.id }), { ...options, data: formData });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex-none">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        {task ? t('tasks.edit', 'Editar Tarea') : t('tasks.create', 'Nueva Tarea')}
                    </h2>
                </div>

                <form onSubmit={submit} className="flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin space-y-6 pb-6">
                        {/* Title */}
                        <div>
                            <InputLabel htmlFor="title" value={t('tasks.title', 'Título')} />
                            <TextInput
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 block w-full"
                                required
                                autoFocus
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
                                />
                                {errors.due_date && <p className="text-sm text-red-600 mt-1">{errors.due_date}</p>}
                            </div>

                            {/* Assignees (Multi-Select) */}
                            <div className="sm:col-span-2">
                                <InputLabel value={t('tasks.assignees', 'Asignados')} />
                                <div className="flex items-center gap-2 mb-2 mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-xs border border-blue-100 dark:border-blue-800">
                                    <InformationCircleIcon className="w-4 h-4 flex-shrink-0" />
                                    <span>{t('tasks.assign_hint')}</span>
                                </div>
                                <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 max-h-32 overflow-y-auto overflow-x-hidden scrollbar-thin">
                                    {project.miembros?.map((member) => {
                                        const isSelected = data.assignees.includes(member.id);
                                        return (
                                            <button
                                                key={member.id}
                                                type="button"
                                                onClick={() => {
                                                    const newAssignees = isSelected
                                                        ? data.assignees.filter(id => id !== member.id)
                                                        : [...data.assignees, member.id];
                                                    setData('assignees', newAssignees);
                                                }}
                                                className={`
                                                    flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border
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
                                    {project.miembros?.length === 0 && (
                                        <span className="text-sm text-gray-500 italic px-2">{t('tasks.no_members', 'No hay miembros')}</span>
                                    )}
                                </div>
                                {errors.assignees && <p className="text-sm text-red-600 mt-1">{errors.assignees}</p>}
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
                                        router.delete(route('mis-proyectos.tasks.destroy', { proyecto: project.id, task: task.id }), {
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
                            <PrimaryButton disabled={processing} type="submit">
                                {task ? t('common.update', 'Actualizar') : t('common.create', 'Crear')}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </div>
        </Modal >
    );
}
