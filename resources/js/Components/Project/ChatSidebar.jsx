import React from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { ChatIcon } from '@/Components/Icons';

export default function ChatSidebar({ project, user, activeChannel, onChannelSelect, unreadCounts, showMobile, onCloseMobile }) {
    const { t } = useTranslate();

    const members = project.miembros?.filter(m => m.id !== user.id) || [];

    return (
        <div className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0
            ${showMobile ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0 h-16">
                    <h3 className="font-bold text-lg text-primary-600 dark:text-primary-400 truncate">
                        {project.nombre}
                    </h3>
                    <button onClick={onCloseMobile} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
                    {/* Channels Section */}
                    <div>
                        <h4 className="px-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            {t('chat.channels', 'Canales')}
                        </h4>
                        <button
                            onClick={() => { onChannelSelect('general'); onCloseMobile(); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${activeChannel === 'general'
                                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 font-medium shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg opacity-70">#</span>
                                <span>{t('chat.general', 'General')}</span>
                            </div>
                            {unreadCounts.general > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    {unreadCounts.general}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Direct Messages Section */}
                    <div>
                        <h4 className="px-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            {t('chat.direct_messages', 'Mensajes Directos')}
                        </h4>
                        <div className="space-y-1">
                            {members.map(member => (
                                <button
                                    key={member.id}
                                    onClick={() => { onChannelSelect(member.id); onCloseMobile(); }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${activeChannel === member.id
                                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 font-medium shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="relative shrink-0">
                                            {member.profile_photo_url ? (
                                                <img src={member.profile_photo_url} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 ${member.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        </div>
                                        <span className="truncate">{member.name}</span>
                                    </div>
                                    {unreadCounts.dms && unreadCounts.dms[member.id] > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                            {unreadCounts.dms[member.id]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
