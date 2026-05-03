import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import {
    ArrowLeftIcon, UsersIcon, ShieldCheckIcon, FolderIcon,
    CheckListIcon, CalculatorIcon, ChatBubbleLeftRightIcon,
    SparklesAiIcon, UserCircleIcon, CheckCircleIcon, XCircleIcon,
    LockClosedIcon, TrashIcon, GlobeAltIcon
} from '@/Components/Icons';
import Modal from '@/Components/Modal';
import { useState } from 'react';

export default function Show({ targetUser, stats, projects_list }) {
    const { t } = useTranslate();
    const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
    const [confirmingAdmin, setConfirmingAdmin] = useState(false);
    const [confirmingResetPassword, setConfirmingResetPassword] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [tempPassword, setTempPassword] = useState(null);

    const toggleStatus = () => {
        router.patch(route('admin.users.toggleStatus', targetUser.uuid), {}, {
            preserveScroll: true,
            onSuccess: () => setConfirmingDeactivate(false),
        });
    };

    const toggleAdmin = () => {
        router.patch(route('admin.users.toggleAdmin', targetUser.uuid), {}, {
            preserveScroll: true,
            onSuccess: () => setConfirmingAdmin(false),
        });
    };

    const resetPassword = () => {
        router.post(route('admin.users.resetPassword', targetUser.uuid), {}, {
            preserveScroll: true,
            onSuccess: () => setConfirmingResetPassword(false),
        });
    };

    const deleteUser = () => {
        router.delete(route('admin.users.destroy', targetUser.uuid), {
            onSuccess: () => setConfirmingDelete(false),
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
            <Head title={`${t('common.profile', 'Perfil')} - ${targetUser.name}`} />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-sm">
                    <div className="flex gap-4 items-center">
                        <div className="flex-shrink-0 h-20 w-20">
                            {targetUser.profile_photo_url ? (
                                <img className="h-20 w-20 rounded-full object-cover border-4 border-gray-50 dark:border-gray-700 shadow-inner" src={targetUser.profile_photo_url} alt="" />
                            ) : (
                                <div className="h-20 w-20 shrink-0 bg-primary-50 dark:bg-primary-900/50 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-sm">
                                    <UserCircleIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{targetUser.name}</h3>
                                {targetUser.is_super_admin && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                                        {t('admin.role_super_admin', 'Super Admin')}
                                    </span>
                                )}
                                {!targetUser.is_active && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
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

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="flex flex-col gap-2 min-w-[200px]">
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                                {t('admin.group_management', 'Gestión de Cuenta')}
                            </p>
                            <SecondaryButton onClick={() => setConfirmingAdmin(true)} className="w-full justify-start text-xs py-2 shadow-sm">
                                <ShieldCheckIcon className="w-4 h-4 mr-2 opacity-70" />
                                {targetUser.is_super_admin ? t('admin.btn_revoke_admin', 'Revocar Admin') : t('admin.btn_promote_admin', 'Promover a Admin')}
                            </SecondaryButton>
                            <SecondaryButton onClick={() => setConfirmingDeactivate(true)} className="w-full justify-start text-xs py-2 shadow-sm">
                                {targetUser.is_active ? <XCircleIcon className="w-4 h-4 mr-2 text-red-500" /> : <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />}
                                {targetUser.is_active ? t('admin.btn_deactivate', 'Desactivar Cuenta') : t('admin.btn_activate', 'Activar Cuenta')}
                            </SecondaryButton>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[200px]">
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                                {t('admin.group_security', 'Seguridad y Datos')}
                            </p>
                            <SecondaryButton onClick={() => setConfirmingResetPassword(true)} className="w-full justify-start text-xs py-2 shadow-sm">
                                <LockClosedIcon className="w-4 h-4 mr-2 text-primary-500" />
                                {t('admin.btn_reset_password', 'Restablecer Clave')}
                            </SecondaryButton>
                            <DangerButton onClick={() => setConfirmingDelete(true)} className="w-full justify-start text-xs py-2 shadow-sm">
                                <TrashIcon className="w-4 h-4 mr-2" />
                                {t('admin.btn_delete', 'Eliminar Usuario')}
                            </DangerButton>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-1 mt-8 mb-4">{t('admin.stats_title', 'Estadísticas del Usuario')}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('admin.stat_projects', 'Proyectos Totales')}</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.projects_count}</p>
                        </div>
                        <FolderIcon className="w-16 h-16 text-primary-500 opacity-5 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:border-green-300 dark:hover:border-green-700 transition-colors">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('admin.stat_tasks', 'Tareas Asignadas')}</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.tasks_count}</p>
                        </div>
                        <CheckListIcon className="w-16 h-16 text-green-500 opacity-5 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:border-yellow-300 dark:hover:border-yellow-700 transition-colors">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('admin.stat_accounts', 'Cuentas Financieras')}</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.accounts_count}</p>
                        </div>
                        <CalculatorIcon className="w-16 h-16 text-yellow-500 opacity-5 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('admin.stat_messages', 'Mensajes Enviados')}</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.messages_count}</p>
                        </div>
                        <ChatBubbleLeftRightIcon className="w-16 h-16 text-blue-500 opacity-5 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                    {/* Projects List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-1">{t('admin.active_projects', 'Proyectos Activos')} ({projects_list.length})</h3>
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {projects_list.length === 0 ? (
                                    <li className="p-10 text-center flex flex-col items-center justify-center gap-3">
                                        <FolderIcon className="w-12 h-12 text-gray-200 dark:text-gray-700" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.no_projects', 'El usuario no pertenece a ningún proyecto.')}</p>
                                    </li>
                                ) : (
                                    projects_list.map((project, idx) => (
                                        <li key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl shadow-sm ${project.type === 'personal' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400'}`}>
                                                    <FolderIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{project.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                                                        <span className="font-medium text-gray-400">{project.type === 'personal' ? t('admin.project_type_personal', 'Personal') : t('admin.project_type_shared', 'Compartido')}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                                        <span>{t('admin.last_read', 'Última lectura:')} {project.last_read_at ? new Date(project.last_read_at).toLocaleString() : t('admin.not_applicable', 'N/A')}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm
                                                    ${project.role === 'owner' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' :
                                                        project.role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                                                            'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`
                                                }>
                                                    {project.role}
                                                </span>
                                                {project.uuid && (
                                                    <Link 
                                                        href={route('proyectos.show', project.uuid)} 
                                                        className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all shadow-none hover:shadow-sm"
                                                        title={t('admin.view_project', 'Ver Proyecto')}
                                                    >
                                                        <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                                                    </Link>
                                                )}
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
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-6 shadow-sm">

                            <div>
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{t('admin.setting_ai_integration', 'AI INTEGRATION')}</p>
                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className={`p-2.5 rounded-xl shadow-sm ${targetUser.is_ai_enabled ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                                        <SparklesAiIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{t('admin.setting_ai_status', 'Estado del Chat AI')}</p>
                                        <span className={`inline-flex items-center text-[10px] font-bold uppercase ${targetUser.is_ai_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${targetUser.is_ai_enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                            {targetUser.is_ai_enabled ? t('admin.status_enabled', 'Activado') : t('admin.status_disabled', 'Desactivado')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{t('admin.setting_theme', 'THEME')}</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full bg-primary-500`}></span>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{targetUser.global_theme || t('admin.theme_default', 'Default')}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{t('admin.setting_language', 'LANGUAGE')}</p>
                                    <div className="flex items-center gap-2">
                                        <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                                        <p className="text-sm font-medium text-gray-900 dark:text-white uppercase">{targetUser.locale || 'en'}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modals for actions */}
            <Modal show={confirmingDeactivate} onClose={() => setConfirmingDeactivate(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        {targetUser.is_active ? <XCircleIcon className="w-6 h-6 text-red-500" /> : <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                        {targetUser.is_active ? t('admin.modal_deactivate_title', '¿Desactivar esta cuenta?') : t('admin.modal_activate_title', '¿Activar esta cuenta?')}
                    </h2>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {targetUser.is_active
                            ? t('admin.modal_deactivate_desc', 'El usuario ya no podrá iniciar sesión, pero sus datos y proyectos se conservarán.')
                            : t('admin.modal_activate_desc', 'El usuario volverá a tener acceso normal a la aplicación.')}
                    </p>
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingDeactivate(false)} className="px-6">{t('admin.btn_cancel', 'Cancelar')}</SecondaryButton>
                        <DangerButton onClick={toggleStatus} className="px-6">
                            {targetUser.is_active ? t('admin.btn_confirm_deactivate', 'Sí, Desactivar') : t('admin.btn_confirm_activate', 'Sí, Activar')}
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            <Modal show={confirmingAdmin} onClose={() => setConfirmingAdmin(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <ShieldCheckIcon className="w-6 h-6 text-purple-500" />
                        {targetUser.is_super_admin ? t('admin.modal_revoke_admin_title', '¿Revocar acceso Admin?') : t('admin.modal_promote_admin_title', '¿Promover a Super Admin?')}
                    </h2>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {targetUser.is_super_admin
                            ? t('admin.modal_revoke_admin_desc', 'Este usuario perderá acceso al panel de control de administración.')
                            : t('admin.modal_promote_admin_desc', 'Este usuario podrá gestionar todas las cuentas y ver reportes de bugs.')}
                    </p>
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingAdmin(false)} className="px-6">{t('admin.btn_cancel', 'Cancelar')}</SecondaryButton>
                        <PrimaryButton onClick={toggleAdmin} className="px-6">
                            {targetUser.is_super_admin ? t('admin.btn_confirm_revoke', 'Revocar') : t('admin.btn_confirm_promote', 'Promover')}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

            <Modal show={confirmingResetPassword} onClose={() => setConfirmingResetPassword(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <LockClosedIcon className="w-6 h-6 text-primary-500" />
                        {t('admin.btn_reset_password', 'Restablecer Clave')}
                    </h2>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {t('admin.pwd_reset_confirm_desc', '¿Enviar un correo electrónico al usuario con un enlace para que cree una nueva contraseña?')}
                    </p>
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingResetPassword(false)} className="px-6">{t('admin.btn_cancel', 'Cancelar')}</SecondaryButton>
                        <PrimaryButton onClick={resetPassword} className="px-6 shadow-lg shadow-primary-500/20">
                            {t('admin.btn_send_link', 'Enviar Enlace')}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

            <Modal show={confirmingDelete} onClose={() => setConfirmingDelete(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <TrashIcon className="w-6 h-6 text-red-600" />
                        {t('admin.modal_delete_user_title', '¿Eliminar permanentemente?')}
                    </h2>
                    <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                        {t('admin.modal_delete_user_desc', 'ESTA ACCIÓN NO SE PUEDE DESHACER. Se borrarán todos los proyectos y registros financieros asociados.')}
                    </p>
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingDelete(false)} className="px-6">{t('admin.btn_cancel', 'Cancelar')}</SecondaryButton>
                        <DangerButton onClick={deleteUser} className="px-6 shadow-lg shadow-red-500/20">
                            {t('admin.btn_confirm_delete', 'Sí, Eliminar Todo')}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
