import React, { useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { PaperAirplaneIcon, ChatIcon, ArrowLeftIcon } from '@/Components/Icons';

export default function ChatWindow({ project, user, activeChannel, messages, loading, onSendMessage, onMobileMenuClick }) {
    const { t } = useTranslate();
    const messagesEndRef = useRef(null);
    const { data, setData, reset, processing } = useForm({
        content: '',
        type: 'text',
    });

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.content.trim()) return;

        onSendMessage(data.content);
        reset();
    };

    const activeMember = project.miembros?.find(m => m.id === activeChannel);
    const channelName = activeChannel === 'general'
        ? t('chat.general', 'General')
        : activeMember?.name || t('common.user_unknown', 'Usuario');

    return (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 shadow-sm z-10 h-16 shrink-0">
                <button onClick={onMobileMenuClick} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 mr-2 flex items-center gap-1">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">{t('chat.back', 'Chats')}</span>
                </button>
                <div className="flex items-center gap-3">
                    {activeChannel === 'general' ? (
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                            #
                        </div>
                    ) : (
                        <div className="relative">
                            {activeMember?.profile_photo_url ? (
                                <img src={activeMember.profile_photo_url} alt={channelName} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-500">
                                    {channelName.charAt(0)}
                                </div>
                            )}
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${activeMember?.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                            {channelName}
                        </h3>
                        {activeChannel !== 'general' && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {activeMember?.is_online ? t('chat.online', 'En línea') : t('chat.offline', 'Desconectado')}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50 custom-scrollbar">
                {loading && messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                        {t('common.loading', 'Cargando...')}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <ChatIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p>{t('chat.empty', 'No hay mensajes aún. ¡Inicia la conversación!')}</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.user_id === user.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                                <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${isMe
                                    ? 'bg-primary-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-600'
                                    }`}>
                                    {!isMe && (
                                        <div className="text-xs font-bold mb-1 opacity-75 text-primary-600 dark:text-primary-400">
                                            {msg.user?.name}
                                        </div>
                                    )}
                                    <p className="text-sm break-words leading-relaxed">{msg.content}</p>
                                    <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && (
                                            <span>
                                                {msg.read_at ? (
                                                    // Read: Double Blue Check
                                                    <div className="flex -space-x-1">
                                                        <svg className="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                        <svg className="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                    </div>
                                                ) : (
                                                    // Sent: Single Gray Check
                                                    <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                    <TextInput
                        id="content"
                        type="text"
                        className="flex-1 block w-full"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder={t('chat.placeholder', 'Escribe un mensaje...')}
                        autoComplete="off"
                    />
                    <PrimaryButton type="submit" disabled={!data.content.trim() || processing} className="h-10 px-4 flex items-center justify-center">
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}
