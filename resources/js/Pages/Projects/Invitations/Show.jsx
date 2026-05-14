import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';

export default function InvitationShow({ invitation, project, inviter, isCorrectUser, currentUser }) {
    const { t } = useTranslate();
    const { post, processing } = useForm();

    const handleAccept = (e) => {
        e.preventDefault();
        post(route('invitation.process', { token: invitation.token }));
    };

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'));
    };

    return (
        <GuestLayout>
            <Head title={t('members.invite_title', 'Invitación a Proyecto')} />

            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {t('members.invite_title', 'Invitación a Proyecto')}
                </h2>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {t('members.invited_by', 'Has sido invitado por')} <span className="font-semibold text-gray-900 dark:text-gray-100">{inviter.name}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {t('members.to_join', 'para unirte al proyecto')}
                    </p>
                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                        {project.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('members.role', 'Rol')}: <span className="font-medium">{t(`members.roles.${invitation.rol}`, invitation.rol)}</span>
                    </p>
                </div>

                {isCorrectUser ? (
                    <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                            <p className="text-green-700 dark:text-green-300 text-sm">
                                {t('members.logged_in_as', 'Estás conectado como')} <strong>{currentUser.email}</strong>.
                                <br />
                                {t('members.email_matches', 'Este correo coincide con la invitación.')}
                            </p>
                        </div>

                        <form onSubmit={handleAccept}>
                            <PrimaryButton className="w-full justify-center" disabled={processing}>
                                {t('members.accept_invitation', 'Aceptar Invitación')}
                            </PrimaryButton>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md text-left">
                            <p className="text-amber-800 dark:text-amber-200 font-medium mb-2">
                                {t('members.wrong_account_title', 'Cuenta Incorrecta')}
                            </p>
                            <p className="text-amber-700 dark:text-amber-300 text-sm mb-2">
                                {t('members.invitation_for', 'Esta invitación fue enviada a')}: <strong>{invitation.email}</strong>
                            </p>
                            <p className="text-amber-700 dark:text-amber-300 text-sm">
                                {t('members.logged_in_as', 'Estás conectado como')}: <strong>{currentUser.email}</strong>
                            </p>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('members.logout_instruction', 'Para aceptar esta invitación, debes cerrar sesión e ingresar con la cuenta correcta.')}
                        </p>

                        <form onSubmit={handleLogout}>
                            <DangerButton className="w-full justify-center">
                                {t('auth.logout', 'Cerrar Sesión')}
                            </DangerButton>
                        </form>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
