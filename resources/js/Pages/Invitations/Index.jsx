import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { CheckCircleIcon, XCircleIcon, EnvelopeIcon } from '@/Components/Icons';

export default function Index({ auth, invitations }) {
    const { t } = useTranslate();
    const { post, processing } = useForm();

    const handleAccept = (uuid) => {
        post(route('invitations.accept', uuid));
    };

    const handleReject = (uuid) => {
        post(route('invitations.reject', uuid));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-primary-800 dark:text-primary-200 leading-tight">{t('invitations.title', 'Invitaciones Pendientes')}</h2>}
        >
            <Head title={t('invitations.title', 'Invitaciones')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {invitations.length === 0 ? (
                                <div className="text-center py-12">
                                    <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{t('invitations.empty_title', 'No tienes invitaciones')}</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('invitations.empty_desc', 'Cuando te inviten a un proyecto, aparecerá aquí.')}</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {invitations.map((invitation) => (
                                        <div key={invitation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col transition-all hover:shadow-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                                                    {invitation.rol === 'admin' ? t('members.role_admin', 'Administrador') : t('members.role_member', 'Miembro')}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(invitation.created_at).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                {invitation.proyecto?.nombre || t('common.project_unnamed', 'Proyecto sin nombre')}
                                            </h3>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                                {t('invitations.invited_by', 'Invitado por')} <span className="font-medium">{invitation.invitador?.name || t('common.user_unknown', 'Usuario desconocido')}</span>
                                            </p>

                                            <div className="mt-auto flex flex-col sm:flex-row gap-3">
                                                <PrimaryButton
                                                    onClick={() => handleAccept(invitation.uuid)}
                                                    disabled={processing}
                                                    className="flex-1 justify-center gap-2"
                                                >
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                    {t('common.accept', 'Aceptar')}
                                                </PrimaryButton>

                                                <SecondaryButton
                                                    onClick={() => handleReject(invitation.uuid)}
                                                    disabled={processing}
                                                    className="flex-1 justify-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <XCircleIcon className="w-5 h-5" />
                                                    {t('common.reject', 'Rechazar')}
                                                </SecondaryButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
