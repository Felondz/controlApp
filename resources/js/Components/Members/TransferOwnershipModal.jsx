import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { useForm } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';

export default function TransferOwnershipModal({ show, onClose, project, members }) {
    const { t } = useTranslate();
    const { data, setData, post, processing, errors, reset, setError } = useForm({
        new_owner_id: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        if (!data.password) {
            setError('password', t('validation.required', 'El campo contraseña es obligatorio.'));
            if (document.getElementById('password')) {
                document.getElementById('password').focus();
            }
            return;
        }

        post(route('project.ownership.transfer', project.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: () => {
                if (document.getElementById('password')) {
                    document.getElementById('password').focus();
                }
            }
        });
    };

    // Filter potential owners: Must be Admin and not the current owner
    const potentialOwners = members.filter(m => m.id !== project.user_id && m.pivot.rol === 'admin');

    return (
        <Modal show={show} onClose={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex-none">
                    <h2 className="text-lg font-medium text-red-600 dark:text-red-400">
                        {t('members.transfer_title', 'Transferir Propiedad del Proyecto')}
                    </h2>
                </div>

                {/* Content */}
                <form onSubmit={submit} className="flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin space-y-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('members.transfer_warning', 'Estás a punto de transferir la propiedad de este proyecto. El nuevo dueño tendrá control total, incluyendo la capacidad de eliminar el proyecto. Solo puedes transferir a otros Administradores.')}
                        </p>

                        <div>
                            <InputLabel htmlFor="new_owner" value={t('members.select_new_owner', 'Seleccionar Nuevo Dueño')} />
                            <select
                                id="new_owner"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                value={data.new_owner_id}
                                onChange={(e) => setData('new_owner_id', e.target.value)}
                                required
                            >
                                <option value="">{t('common.select', 'Seleccionar...')}</option>
                                {potentialOwners.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.name} ({member.email})
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.new_owner_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value={t('common.password', 'Contraseña Actual')} />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={t('members.confirm_password', 'Confirma tu contraseña')}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end flex-none">
                        <SecondaryButton onClick={onClose} disabled={processing} type="button">
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing} type="submit">
                            {t('members.confirm_transfer', 'Transferir Propiedad')}
                        </DangerButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
