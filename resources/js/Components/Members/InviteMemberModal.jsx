import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTranslate } from '@/Hooks/useTranslate';
import { useForm } from '@inertiajs/react';
import UserSearchCombobox from './UserSearchCombobox';

export default function InviteMemberModal({ show, onClose, project }) {
    const { t } = useTranslate();
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        rol: 'miembro'
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('project.members.store', project.uuid), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleUserSelect = (user) => {
        setData('email', user ? user.email : '');
        if (user) clearErrors('email');
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex-none">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t('members.invite_title', 'Invitar Miembro')}
                    </h2>
                </div>

                {/* Content */}
                <form onSubmit={submit} className="flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin space-y-6">
                        <div>
                            <UserSearchCombobox
                                project={project}
                                onSelect={handleUserSelect}
                                selectedEmail={data.email}
                                error={errors.email}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="rol" value={t('members.role', 'Rol')} />
                            <select
                                id="rol"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                value={data.rol}
                                onChange={(e) => setData('rol', e.target.value)}
                            >
                                <option value="miembro">{t('members.role_member', 'Miembro')}</option>
                                <option value="admin">{t('members.role_admin', 'Administrador')}</option>
                            </select>
                            <InputError message={errors.rol} className="mt-2" />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {data.rol === 'admin'
                                    ? t('members.admin_desc', 'Acceso total al proyecto, incluyendo configuración y gestión de miembros.')
                                    : t('members.member_desc', 'Puede ver y crear contenido, pero no gestionar el proyecto.')}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end flex-none">
                        <SecondaryButton onClick={onClose} disabled={processing} type="button">
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>

                        <PrimaryButton className="ms-3" disabled={processing} type="submit">
                            {t('members.send_invitation', 'Enviar Invitación')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
