import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslate } from '@/hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import { UserPlusIcon } from '@/Components/Icons';
import { useState } from 'react';
import InviteUserToProjectModal from '@/Components/Members/InviteUserToProjectModal';

export default function UserShow({ auth, userProfile, myProjects }) {
    const t = useTranslate();
    const [showInviteModal, setShowInviteModal] = useState(false);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">{t('users.profile_title', 'Perfil de Usuario')}</h2>}
        >
            <Head title={`${userProfile.name} | ${t('users.profile_title', 'Perfil')}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 flex flex-col items-center">

                            {/* Profile Photo */}
                            <div className="mb-6">
                                <img
                                    className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                                    src={userProfile.profile_photo_url}
                                    alt={userProfile.name}
                                />
                            </div>

                            {/* User Info */}
                            <h3 className="text-2xl font-bold mb-2">{userProfile.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">{userProfile.email}</p>

                            {/* Actions */}
                            {auth.user.id !== userProfile.id && (
                                <PrimaryButton onClick={() => setShowInviteModal(true)}>
                                    <UserPlusIcon className="w-5 h-5 mr-2" />
                                    {t('members.invite_to_project', 'Invitar a un Proyecto')}
                                </PrimaryButton>
                            )}

                            {auth.user.id === userProfile.id && (
                                <p className="text-sm text-gray-400 italic">
                                    {t('users.this_is_you', 'Este es tu perfil público.')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <InviteUserToProjectModal
                show={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                userToInvite={userProfile}
                myProjects={myProjects}
            />
        </AuthenticatedLayout>
    );
}
