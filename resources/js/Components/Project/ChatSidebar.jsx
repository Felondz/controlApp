import React from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { ChatIcon, XMarkIcon } from '@/Components/Icons';

export default function ChatSidebar({ project, user, activeChannel, onChannelSelect, unreadCounts, onlineUsers, showMobile, onCloseMobile }) {
    const { t } = useTranslate();

    const members = project.miembros?.filter(m => m.id !== user.id) || [];

    const isUserOnline = (userId) => {
        return onlineUsers?.some(u => u.id === userId);
    };

    return (
        <div className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out shadow-lg
            md:relative md:translate-x-0 md:shadow-none
            ${showMobile ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0 h-16">
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-[9px] font-bold text-primary-500 uppercase tracking-wider mb-0.5">{t('chat.project', 'Proyecto')}</span>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                            {project.nombre}
                        </h3>
                    </div>
                    <button onClick={onCloseMobile} className="md:hidden p-1.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 transition-colors">
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-6 scrollbar-thin">
                    {/* Channels Section */}
                    <div>
                        <div className="flex items-center px-2 mb-2">
                            <h4 className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                {t('chat.channels', 'Canales')}
                            </h4>
                            <div className="h-px flex-1 bg-gray-50 dark:bg-gray-800 ml-3"></div>
                        </div>
                        
                        <button
                            onClick={() => { onChannelSelect('general'); onCloseMobile(); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs transition-all duration-200 group ${activeChannel === 'general'
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded flex items-center justify-center font-bold transition-colors ${activeChannel === 'general' ? 'bg-primary-500 text-white' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'}`}>
                                    #
                                </div>
                                <span className="font-bold">{t('chat.general', 'General')}</span>
                            </div>
                            {unreadCounts.general > 0 && (
                                <span className={`${activeChannel === 'general' ? 'bg-white text-primary-600' : 'bg-red-500 text-white'} text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm`}>
                                    {unreadCounts.general}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Direct Messages Section */}
                    <div>
                        <div className="flex items-center px-2 mb-2">
                            <h4 className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                {t('chat.direct_messages', 'Mensajes')}
                            </h4>
                            <div className="h-px flex-1 bg-gray-50 dark:bg-gray-800 ml-3"></div>
                        </div>
                        
                        <div className="space-y-0.5">
                            {members.length === 0 ? (
                                <p className="px-3 py-4 text-center text-[10px] text-gray-400 italic bg-gray-50/50 dark:bg-gray-800/20 rounded border border-dashed border-gray-200 dark:border-gray-700">
                                    {t('chat.no_members', 'Sin miembros')}
                                </p>
                            ) : (
                                members.map(member => (
                                    <button
                                        key={member.id}
                                        onClick={() => { onChannelSelect(member.id); onCloseMobile(); }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs transition-all duration-200 group ${activeChannel === member.id
                                            ? 'bg-primary-600 text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="relative shrink-0">
                                                {member.profile_photo_url ? (
                                                    <img src={member.profile_photo_url} alt={member.name} className={`w-6 h-6 rounded object-cover border transition-all ${activeChannel === member.id ? 'border-primary-400' : 'border-gray-200 dark:border-gray-700'}`} />
                                                ) : (
                                                    <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${activeChannel === member.id ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                                        {member.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border transition-colors ${activeChannel === member.id ? 'border-primary-600' : 'border-white dark:border-gray-900'} ${isUserOnline(member.id) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            </div>
                                            <span className="truncate font-bold">{member.name}</span>
                                        </div>
                                        {unreadCounts.dms && unreadCounts.dms[member.id] > 0 && (
                                            <span className={`${activeChannel === member.id ? 'bg-white text-primary-600' : 'bg-red-500 text-white'} text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm`}>
                                                {unreadCounts.dms[member.id]}
                                            </span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                
                {/* User Status Card */}
                <div className="p-3 mt-auto">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-2.5 border border-gray-100 dark:border-gray-800 flex items-center gap-2.5">
                        <div className="relative">
                            {user.profile_photo_url ? (
                                <img src={user.profile_photo_url} alt={user.name} className="w-8 h-8 rounded object-cover border border-gray-200 dark:border-gray-700 shadow-sm" />
                            ) : (
                                <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center text-xs font-bold text-white shadow">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-800"></div>
                        </div>
                        <div className="flex flex-col overflow-hidden text-left">
                            <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</span>
                            <span className="text-[8px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight">{t('chat.online_status', 'En línea')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
