import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import axios from 'axios';
import { useTranslate } from '@/hooks/useTranslate';

export default function InviteUserToProjectModal({ show, onClose, userToInvite, myProjects }) {
    const t = useTranslate();
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [role, setRole] = useState('miembro');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        if (!selectedProjectId) {
            setErrors({ project: t('members.select_project_error', 'Selecciona un proyecto') });
            return;
        }
        setProcessing(true);
        setErrors({});
        setSuccess(null);

        axios.post(`/api/proyectos/${selectedProjectId}/invitaciones`, {
            email: userToInvite.email,
            rol: role
        })
            .then(() => {
                setProcessing(false);
                setSuccess(t('members.invite_sent_success', 'Invitación enviada'));
                setTimeout(() => {
                    setSuccess(null);
                    onClose();
                }, 2000);
            })
            .catch(error => {
                setProcessing(false);
                if (error.response?.data?.message) {
                    setErrors({ general: error.response.data.message });
                } else {
                    setErrors({ general: 'Error al enviar invitación' });
                }
            });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t('members.invite_user_title', 'Invitar a')} {userToInvite.name}
                </h2>

                {success && (
                    <div className="mb-4 text-sm text-green-600 dark:text-green-400">
                        {success}
                    </div>
                )}

                {errors.general && (
                    <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                        {errors.general}
                    </div>
                )}

                <div className="mt-6">
                    <InputLabel htmlFor="project" value={t('members.select_project', 'Selecciona un Proyecto')} />
                    <select
                        id="project"
                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        required
                    >
                        <option value="">{t('common.select', 'Seleccionar...')}</option>
                        {myProjects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.nombre}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.project} className="mt-2" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="role" value={t('members.role', 'Rol')} />
                    <select
                        id="role"
                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="miembro">{t('members.role_member', 'Miembro')}</option>
                        <option value="admin">{t('members.role_admin', 'Administrador')}</option>
                    </select>
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        {t('common.cancel', 'Cancelar')}
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        {t('members.send_invitation', 'Enviar Invitación')}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
