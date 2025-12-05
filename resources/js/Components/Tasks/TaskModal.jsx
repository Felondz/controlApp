import { useForm, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { TrashIcon } from '@/Components/Icons';
import { useEffect } from 'react';

export default function TaskModal({ show, onClose, task, project, categories = [], onSuccess }) {
    const { t } = useTranslate();

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        assigned_to: '',
        is_financial: false,
        amount: '',
        category_id: '',
    });

    useEffect(() => {
        if (task) {
            setData({
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority,
                due_date: task.due_date || '',
                assigned_to: task.assigned_to || '',
                is_financial: task.is_financial || false,
                amount: task.amount || '',
                category_id: task.category_id || '',
            });
        } else {
            reset();
        }
    }, [task, show]);

    const submit = (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        };

        if (task) {
            put(route('tasks.update', [project.id, task.id]), options);
        } else {
            post(route('mis-proyectos.tasks.store', project.id), options);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {task ? t('tasks.edit', 'Editar Tarea') : t('tasks.create', 'Nueva Tarea')}
                </h2>

                <div className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
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
                            <InputLabel htmlFor="priority" value={t('tasks.priority', 'Prioridad')} />
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

                    <div className="grid grid-cols-2 gap-4">
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

                        {/* Assignee */}
                        <div>
                            <InputLabel htmlFor="assigned_to" value={t('tasks.assignee', 'Asignado a')} />
                            <select
                                id="assigned_to"
                                value={data.assigned_to}
                                onChange={(e) => setData('assigned_to', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm py-2"
                            >
                                <option value="">{t('tasks.unassigned', 'Sin Asignar')}</option>
                                {project.miembros?.map((member) => (
                                    <option key={member.id} value={member.id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                            {errors.assigned_to && <p className="text-sm text-red-600 mt-1">{errors.assigned_to}</p>}
                        </div>
                    </div>

                    {/* Financial Obligation Section */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <input
                                id="is_financial"
                                type="checkbox"
                                checked={data.is_financial}
                                onChange={(e) => setData('is_financial', e.target.checked)}
                                className="rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500"
                            />
                            <InputLabel htmlFor="is_financial" value={t('tasks.is_financial', '¿Es una obligación financiera?')} className="!mb-0" />
                        </div>

                        {data.is_financial && (
                            <div className="grid grid-cols-2 gap-4 pl-7">
                                {/* Amount */}
                                <div>
                                    <InputLabel htmlFor="amount" value={t('tasks.amount', 'Monto')} />
                                    <TextInput
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="0.00"
                                    />
                                    {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
                                </div>

                                {/* Category */}
                                <div>
                                    <InputLabel htmlFor="category_id" value={t('tasks.category', 'Categoría')} />
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm py-2"
                                    >
                                        <option value="">{t('tasks.select_category', 'Seleccionar categoría...')}</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-sm text-red-600 mt-1">{errors.category_id}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-between gap-3">
                    {task && (
                        <DangerButton
                            type="button"
                            onClick={() => {
                                if (confirm(t('tasks.confirm_delete', '¿Estás seguro de eliminar esta tarea?'))) {
                                    router.delete(route('tasks.destroy', [project.id, task.id]), {
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
                        <SecondaryButton onClick={onClose} disabled={processing}>
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {task ? t('common.update', 'Actualizar') : t('common.create', 'Crear')}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
