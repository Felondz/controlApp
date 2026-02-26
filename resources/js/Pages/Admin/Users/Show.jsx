import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import {
    ArrowLeftIcon, UsersIcon, ShieldCheckIcon, FolderIcon,
    CheckListIcon, CalculatorIcon, ChatBubbleLeftRightIcon,
    SparklesAiIcon, UserCircleIcon, CheckCircleIcon, XCircleIcon
} from '@/Components/Icons';
import Modal from '@/Components/Modal';
import { useState } from 'react';

export default function Show({ targetUser, stats, projects_list }) {
    const { t } = useTranslate();
    const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
    const [confirmingAdmin, setConfirmingAdmin] = useState(false);

    const toggleStatus = () => {
        router.patch(route('admin.users.toggleStatus', targetUser.id), {}, {
            preserveScroll: true,
            onSuccess: () => setConfirmingDeactivate(false),
        });
    };

    const toggleAdmin = () => {
        router.patch(route('admin.users.toggleAdmin', targetUser.id), {}, {
            preserveScroll: true,
            onSuccess: () => setConfirmingAdmin(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight">
                    {t('admin.profile_title', 'Perfil de Usuario')}
                </h2>
            }
        >
            <Head title={`Perfil - ${targetUser.name}`} />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <div className="flex-shrink-0 h-20 w-20">
                            {targetUser.profile_photo_url ? (
                                <img className="h-20 w-20 rounded-full object-cover border-4 border-gray-50 dark:border-gray-700" src={targetUser.profile_photo_url} alt="" />
                            ) : (
                                <div className="h-20 w-20 shrink-0 bg-primary-50 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                                    <UserCircleIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{targetUser.name}</h3>
                                {targetUser.is_super_admin && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                                        {t('admin.role_super_admin', 'Super Admin')}
                                    </span>
                                )}
                                {!targetUser.is_active && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                        {t('admin.status_inactive', 'Inactivo')}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">{targetUser.email}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                {t('admin.member_since', 'Miembro desde:')} {new Date(targetUser.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <SecondaryButton onClick={() => setConfirmingAdmin(true)} className="justify-center">
                            {targetUser.is_super_admin ? t('admin.btn_revoke_admin', 'Revocar Admin') : t('admin.btn_promote_admin', 'Promover a Admin')}
                        </SecondaryButton>
                        <DangerButton onClick={() => setConfirmingDeactivate(true)} className="justify-center">
                            {targetUser.is_active ? t('admin.btn_deactivate', 'Desactivar Cuenta') : t('admin.btn_activate', 'Activar Cuenta')}
                        </DangerButton>
                    </div>
                </div>

                {/* Stats Grid */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-1 mt-8 mb-4">{t('admin.stats_title', 'Estadísticas del Usuario')}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.stat_projects', 'Proyectos Totales')}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.projects_count}</p>
                        </div>
                        <FolderIcon className="w-16 h-16 text-primary-500 opacity-5 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.stat_tasks', 'Tareas Asignadas')}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.tasks_count}</p>
                        </div>
                        <CheckListIcon className="w-16 h-16 text-green-500 opacity-5 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.stat_accounts', 'Cuentas Financieras')}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.accounts_count}</p>
                        </div>
                        <CalculatorIcon className="w-16 h-16 text-yellow-500 opacity-5 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.stat_messages', 'Mensajes Enviados')}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.messages_count}</p>
                        </div>
                        <ChatBubbleLeftRightIcon className="w-16 h-16 text-blue-500 opacity-5 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                    {/* Projects List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-1">{t('admin.active_projects', 'Proyectos Activos')} ({projects_list.length})</h3>
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {projects_list.length === 0 ? (
                                    <li className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">{t('admin.no_projects', 'El usuario no pertenece a ningún proyecto.')}</li>
                                ) : (
                                    projects_list.map((project, idx) => (
                                        <li key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${project.type === 'personal' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400'}`}>
                                                    <FolderIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</p>
                                                    <p className="text-xs text-gray-500">{project.type === 'personal' ? t('admin.project_type_personal', 'Personal') : t('admin.project_type_shared', 'Compartido')} · {t('admin.last_read', 'Última lectura:')} {project.last_read_at ? new Date(project.last_read_at).toLocaleString() : t('admin.not_applicable', 'N/A')}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                                                    ${project.role === 'owner' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                        project.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`
                                                }>
                                                    {project.role}
                                                </span>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Preferences & AI Status */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-1">{t('admin.settings_title', 'Configuración y Preferencias')}</h3>
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">

                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('admin.setting_ai_integration', 'Integración de Inteligencia Artificial')}</p>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${targetUser.is_ai_enabled ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                        <SparklesAiIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{t('admin.setting_ai_status', 'Estado del Chat AI')}</p>
                                        <p className="text-xs text-gray-500">{targetUser.is_ai_enabled ? t('admin.status_enabled', 'Activado') : t('admin.status_disabled', 'Desactivado')}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100 dark:border-gray-700" />

                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('admin.setting_theme', 'Tema Global')}</p>
                                <p className="text-sm text-gray-900 dark:text-white capitalize">{targetUser.global_theme || t('admin.theme_default', 'Por defecto')}</p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('admin.setting_language', 'Idioma')}</p>
                                <p className="text-sm text-gray-900 dark:text-white capitalize">{targetUser.locale || 'en'}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modals for actions */}
            <Modal show={confirmingDeactivate} onClose={() => setConfirmingDeactivate(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {targetUser.is_active ? <XCircleIcon className="w-5 h-5 text-red-500" /> : <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                        {targetUser.is_active ? t('admin.modal_deactivate_title', '¿Desactivar esta cuenta?') : t('admin.modal_activate_title', '¿Activar esta cuenta?')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {targetUser.is_active
                            ? t('admin.modal_deactivate_desc', 'El usuario ya no podrá iniciar sesión en la aplicación, pero sus datos y proyectos seguirán intactos para evitar roturas.')
                            : t('admin.modal_activate_desc', 'El usuario volverá a tener acceso normal a la aplicación.')}
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingDeactivate(false)}>{t('admin.btn_cancel', 'Cancelar')}</SecondaryButton>
                        <DangerButton onClick={toggleStatus}>
                            {targetUser.is_active ? t('admin.btn_confirm_deactivate', 'Sí, Desactivar') : t('admin.btn_confirm_activate', 'Sí, Activar')}
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            <Modal show={confirmingAdmin} onClose={() => setConfirmingAdmin(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5 text-purple-500" />
                        {targetUser.is_super_admin ? t('admin.modal_revoke_admin_title', '¿Revocar acceso Admin?') : t('admin.modal_promote_admin_title', '¿Promover a Super Admin?')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {targetUser.is_super_admin
                            ? t('admin.modal_revoke_admin_desc', 'Este usuario perderá acceso al panel de control de reportes de bugs y gestión de usuarios.')
                            : t('admin.modal_promote_admin_desc', 'Este usuario podrá ver todos los reportes de bugs y gestionar (incluyendo desactivar) otras cuentas.')}
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingAdmin(false)}>{t('admin.btn_cancel', 'Cancelar')}</SecondaryButton>
                        <PrimaryButton onClick={toggleAdmin}>
                            {targetUser.is_super_admin ? t('admin.btn_confirm_revoke', 'Revocar Permisos') : t('admin.btn_confirm_promote', 'Promover')}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
