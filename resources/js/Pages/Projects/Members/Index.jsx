import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InviteMemberModal from '@/Components/Members/InviteMemberModal';
import DangerButton from '@/Components/DangerButton';
import { UserPlusIcon, TrashIcon, ShieldCheckIcon, UserCircleIcon } from '@/Components/Icons';
import Alert from '@/Components/Alert';
import TransferOwnershipModal from '@/Components/Members/TransferOwnershipModal';

export default function MembersIndex({ auth, proyecto, members, invitations, isAdmin, isOwner }) {
    const { t } = useTranslate();
    const { flash = {}, errors } = usePage().props;
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState(flash.success);

    // Update success message when flash prop changes
    if (flash.success && flash.success !== successMessage) {
        setSuccessMessage(flash.success);
    }

    const handleRemoveMember = (memberUuid) => {
        if (!confirm(t('members.confirm_remove', '¿Estás seguro de eliminar este miembro?'))) return;

        router.delete(route('project.members.destroy', { proyecto: proyecto.uuid, user: memberUuid }), {
            preserveScroll: true,
            onSuccess: () => setSuccessMessage(t('members.member_removed', 'Miembro eliminado.')),
        });
    };

    const handleChangeRole = (memberUuid, newRole) => {
        router.put(route('project.members.update', { proyecto: proyecto.uuid, user: memberUuid }), {
            rol: newRole
        }, {
            preserveScroll: true,
            onSuccess: () => setSuccessMessage(t('members.role_updated', 'Rol actualizado.')),
        });
    };

    const handleCancelInvitation = (invitationUuid) => {
        if (!confirm(t('members.confirm_cancel_invite', '¿Cancelar invitación?'))) return;

        router.delete(route('project.invitations.destroy', { proyecto: proyecto.uuid, invitation: invitationUuid }), {
            preserveScroll: true,
            onSuccess: () => setSuccessMessage(t('members.invite_cancelled', 'Invitación cancelada.')),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">{t('members.title', 'Gestión de Miembros')} - {proyecto.nombre}</h2>}
            project={proyecto}
        >
            <Head title={`${t('members.title', 'Miembros')} | ${proyecto.nombre}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {successMessage && (
                        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
                    )}

                    {Object.keys(errors).length > 0 && (
                        <Alert type="error" message={Object.values(errors).join(', ')} />
                    )}

                    {/* Header Actions */}
                    <div className="flex justify-between items-center px-4 sm:px-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {t('members.team_list', 'Lista del Equipo')}
                        </h3>
                        {isAdmin && (
                            <PrimaryButton onClick={() => setShowInviteModal(true)}>
                                <UserPlusIcon className="w-5 h-5 mr-2" />
                                {t('members.invite_button', 'Invitar Miembro')}
                            </PrimaryButton>
                        )}
                    </div>

                    {/* Members List */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-x-auto scrollbar-thin">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('common.name', 'Nombre')}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('common.email', 'Email')}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('members.role', 'Rol')}</th>
                                            {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('common.actions', 'Acciones')}</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {members.map((member) => (
                                            <tr key={member.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 relative">
                                                            {member.profile_photo_path ? (
                                                                <img className="h-10 w-10 rounded-full object-cover" src={member.profile_photo_url} alt={member.name} />
                                                            ) : (
                                                                <UserCircleIcon className="h-10 w-10 text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full p-1" />
                                                            )}
                                                            {member.id === proyecto.user_id && (
                                                                <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-0.5" title={t('members.owner', 'Dueño')}>
                                                                    <ShieldCheckIcon className="w-3 h-3 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {member.name}
                                                                {member.id === auth.user.id && <span className="ml-2 text-xs text-gray-500">({t('common.you', 'Tú')})</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {member.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.pivot.rol === 'admin'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                        }`}>
                                                        {member.pivot.rol === 'admin' ? t('members.role_admin', 'Admin') : t('members.role_member', 'Miembro')}
                                                    </span>
                                                </td>
                                                {isAdmin && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        {/* Cannot edit/remove yourself or the Owner */}
                                                        {auth.user.id !== member.id && member.id !== proyecto.user_id && (
                                                            <div className="flex justify-end space-x-2">
                                                                <select
                                                                    value={member.pivot.rol}
                                                                    onChange={(e) => handleChangeRole(member.uuid, e.target.value)}
                                                                    className="text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                                >
                                                                    <option value="miembro">{t('members.role_member', 'Miembro')}</option>
                                                                    <option value="admin">{t('members.role_admin', 'Admin')}</option>
                                                                </select>
                                                                <button
                                                                    onClick={() => handleRemoveMember(member.uuid)}
                                                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                                    title={t('common.remove', 'Eliminar')}
                                                                >
                                                                    <TrashIcon className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                        {member.id === proyecto.user_id && (
                                                            <span className="text-xs text-gray-400 italic">{t('members.owner_label', 'Dueño')}</span>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Invitations List */}
                    {invitations.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-8">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {t('members.pending_invitations', 'Invitaciones Pendientes')}
                                </h3>
                            </div>
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {invitations.map((invitation) => (
                                        <li key={invitation.id} className="py-4 flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{invitation.email}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {t('members.invited_as', 'Invitado como')}: {invitation.rol} • {new Date(invitation.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {isAdmin && (
                                                <DangerButton onClick={() => handleCancelInvitation(invitation.uuid)} className="ml-4 text-xs">
                                                    {t('common.cancel', 'Cancelar')}
                                                </DangerButton>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Danger Zone: Transfer Ownership */}
                    {isOwner && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-8 border border-red-200 dark:border-red-900">
                            <div className="px-6 py-4 border-b border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
                                <h3 className="text-lg font-medium text-red-800 dark:text-red-400">
                                    {t('members.danger_zone', 'Zona de Peligro')}
                                </h3>
                            </div>
                            <div className="p-6 text-gray-900 dark:text-gray-100 flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium">{t('members.transfer_ownership', 'Transferir Propiedad del Proyecto')}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
                                        {t('members.transfer_desc', 'Transfiere los derechos de propiedad a otro administrador. Esta acción es irreversible y perderás el control total del proyecto.')}
                                    </p>
                                </div>
                                <DangerButton onClick={() => setShowTransferModal(true)}>
                                    {t('members.transfer_button', 'Transferir Propiedad')}
                                </DangerButton>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <InviteMemberModal
                show={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                project={proyecto}
            />

            {isOwner && (
                <TransferOwnershipModal
                    show={showTransferModal}
                    onClose={() => setShowTransferModal(false)}
                    project={proyecto}
                    members={members}
                />
            )}
        </AuthenticatedLayout>
    );
}
