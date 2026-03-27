import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Dropdown from '@/Components/Dropdown';
import SearchInput from '@/Components/SearchInput';
import Lightbox from '@/Components/Project/Lightbox';
import { PaperAirplaneIcon, ChatIcon, ArrowLeftIcon, PlusIcon, DocumentIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, XMarkIcon, SearchIcon, FaceSmileIcon, CheckCircleIconV2 } from '@/Components/Icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(relativeTime);
dayjs.extend(calendar);

export default function ChatWindow({ project, user, activeChannel, messages, loading, onlineUsers, typingUsers, lastReadAt, onSendMessage, onUpdateMessage, onDeleteMessage, onToggleReaction, onMobileMenuClick, onTyping }) {
    const { t } = useTranslate();
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [lightboxImage, setLightboxImage] = useState(null);

    const { data, setData, reset, processing } = useForm({
        content: '',
    });

    // Handle typing indicator
    useEffect(() => {
        if (data.content && onTyping) {
            onTyping();
        }
    }, [data.content, onTyping]);

    // Local Search filtering
    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) return messages;
        return messages.filter(msg => 
            msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [messages, searchQuery]);

    useEffect(() => {
        if (!searchQuery) {
            scrollToBottom();
        }
    }, [messages, searchQuery]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingMessage) {
            if (!editContent.trim()) return;
            onUpdateMessage(editingMessage.id, editContent);
            setEditingMessage(null);
            setEditContent('');
            return;
        }

        if (!data.content.trim() && !selectedFile) return;

        onSendMessage(data.content, selectedFile, replyingTo?.id);
        
        reset();
        removeFile();
        setReplyingTo(null);
    };

    const activeMember = project.miembros?.find(m => m.id === activeChannel);
    const isOnline = activeChannel === 'general' 
        ? true 
        : onlineUsers?.some(u => u.id === activeChannel);

    const channelName = activeChannel === 'general'
        ? t('chat.general', 'General')
        : activeMember?.name || t('common.user_unknown', 'Usuario');

    // Filter typing users for current channel
    const typingInChannel = useMemo(() => {
        return Object.values(typingUsers || {}).filter(u => u.channel === activeChannel);
    }, [typingUsers, activeChannel]);

    // Group messages by date
    const groupedMessages = useMemo(() => {
        const groups = [];
        let currentGroup = null;

        filteredMessages.forEach((msg, index) => {
            const date = dayjs(msg.created_at).format('YYYY-MM-DD');
            if (!currentGroup || currentGroup.date !== date) {
                currentGroup = {
                    date,
                    label: dayjs(msg.created_at).calendar(null, {
                        sameDay: `[${t('common.today', 'Hoy')}]`,
                        lastDay: `[${t('common.yesterday', 'Ayer')}]`,
                        lastWeek: 'dddd',
                        sameElse: 'D MMMM YYYY'
                    }),
                    messages: []
                };
                groups.push(currentGroup);
            }
            currentGroup.messages.push({ ...msg, index });
        });

        return groups;
    }, [filteredMessages, t]);

    const renderMessage = (msg, index, groupMessages) => {
        const isMe = msg.user_id === user.id;
        const prevMsgInGroup = index > 0 ? groupMessages[index - 1] : null;
        const nextMsgInGroup = index < groupMessages.length - 1 ? groupMessages[index + 1] : null;
        
        // Clustering logic: same user and less than 5 minutes apart
        const isFirstInCluster = !prevMsgInGroup || prevMsgInGroup.user_id !== msg.user_id || (dayjs(msg.created_at).diff(dayjs(prevMsgInGroup.created_at), 'minute') > 5);
        const isLastInCluster = !nextMsgInGroup || nextMsgInGroup.user_id !== msg.user_id || (dayjs(nextMsgInGroup.created_at).diff(dayjs(msg.created_at), 'minute') > 5);
        const isMiddleInCluster = !isFirstInCluster && !isLastInCluster;

        // Unread separator logic
        const showUnreadSeparator = !searchQuery && lastReadAt && 
                                   dayjs(msg.created_at).isAfter(dayjs(lastReadAt)) && 
                                   (!prevMsgInGroup || dayjs(prevMsgInGroup.created_at).isBefore(dayjs(lastReadAt)) || dayjs(prevMsgInGroup.created_at).isSame(dayjs(lastReadAt))) &&
                                   !isMe;

        return (
            <div key={msg.id} className="w-full">
                {showUnreadSeparator && (
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-red-300 dark:border-red-900/50"></div>
                        <span className="px-3 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[9px] font-bold uppercase tracking-widest rounded mx-2">
                            {t('chat.new_messages', 'Nuevos Mensajes')}
                        </span>
                        <div className="flex-1 border-t border-red-300 dark:border-red-900/50"></div>
                    </div>
                )}
                
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} group ${isFirstInCluster ? 'mt-4' : 'mt-0.5'}`}>
                    {/* Avatar for others */}
                    {!isMe && (
                        <div className="w-7 shrink-0 mr-2 flex flex-col justify-end">
                            {isLastInCluster && (
                                <div className="relative">
                                    {msg.user?.profile_photo_url ? (
                                        <img src={msg.user.profile_photo_url} alt={msg.user.name} className="w-7 h-7 rounded object-cover border border-gray-200 dark:border-gray-700 shadow-sm" title={msg.user.name} />
                                    ) : (
                                        <div className="w-7 h-7 rounded bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-[9px] font-bold text-white shadow-sm" title={msg.user.name}>
                                            {msg.user?.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`relative max-w-[85%] md:max-w-[75%] shadow-sm transition-all duration-200
                        ${isMe ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'}
                        ${isMe 
                            ? `rounded-l-md ${isFirstInCluster ? 'rounded-tr-md' : 'rounded-tr-sm'} ${isLastInCluster ? 'rounded-br-sm' : 'rounded-br-md'}`
                            : `rounded-r-md ${isFirstInCluster ? 'rounded-tl-md' : 'rounded-tl-sm'} ${isLastInCluster ? 'rounded-bl-sm' : 'rounded-bl-md'}`
                        }
                        px-3 py-1.5 hover:shadow`}>
                        
                        {msg.parent && (
                            <div className={`text-xs mb-1.5 p-1.5 rounded-sm opacity-80 border-l-2 border-primary-400 ${isMe ? 'bg-primary-700' : 'bg-gray-50 dark:bg-gray-900'}`}>
                                <span className="font-bold">{msg.parent.user?.name}: </span>
                                <span className="truncate block max-w-xs">{msg.parent.content || t('chat.attachment', 'Archivo adjunto')}</span>
                            </div>
                        )}

                        {!isMe && isFirstInCluster && (
                            <div className="text-[10px] font-bold mb-0.5 opacity-75 text-primary-600 dark:text-primary-400 uppercase tracking-tight">
                                {msg.user?.name}
                            </div>
                        )}

                        {msg.type === 'image' && msg.file_url && (
                            <img 
                                src={msg.file_url} 
                                alt="Attachment" 
                                className="rounded mb-1 max-w-full h-auto max-h-80 object-cover cursor-zoom-in hover:brightness-105 transition-all" 
                                onLoad={scrollToBottom} 
                                onClick={() => setLightboxImage({ src: msg.file_url, alt: msg.content })}
                            />
                        )}

                        {msg.type === 'file' && msg.file_url && (
                            <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-2 rounded mb-1 text-sm ${isMe ? 'bg-primary-700 hover:bg-primary-800' : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-black'} transition-colors border ${isMe ? 'border-primary-500' : 'border-gray-200 dark:border-gray-700'}`}>
                                <div className={`p-1.5 rounded-sm ${isMe ? 'bg-primary-500' : 'bg-primary-100 dark:bg-primary-900/30'}`}>
                                    <DocumentIcon className={`w-4 h-4 ${isMe ? 'text-white' : 'text-primary-600 dark:text-primary-400'}`} />
                                </div>
                                <div className="flex flex-col overflow-hidden text-left">
                                    <span className="truncate font-bold text-xs">{msg.content || t('chat.attachment', 'Archivo')}</span>
                                    <span className="text-[9px] opacity-60 uppercase font-bold tracking-widest">{msg.file_url.split('.').pop()}</span>
                                </div>
                            </a>
                        )}

                        {(msg.type === 'text' || (msg.type !== 'text' && msg.content && msg.content !== (msg.file_url?.split('/').pop() || ''))) && (
                            <p className="text-sm break-words leading-snug whitespace-pre-wrap">
                                {searchQuery ? (
                                    // Highlight search results
                                    msg.content.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                                        part.toLowerCase() === searchQuery.toLowerCase() 
                                            ? <mark key={i} className="bg-yellow-300 dark:bg-yellow-500/50 text-black dark:text-white rounded-none px-0.5 font-bold">{part}</mark> 
                                            : part
                                    )
                                ) : msg.content}
                            </p>
                        )}

                        <div className={`text-[9px] mt-1 flex items-center justify-end gap-1 font-bold ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                            {msg.is_edited && <span className="italic opacity-75">({t('common.edited', 'editado')})</span>}
                            {dayjs(msg.created_at).format('HH:mm')}
                            {isMe && (
                                <span className="ml-1">
                                    {msg.read_at ? (
                                        <div className="flex -space-x-1.5">
                                            <svg className="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            <svg className="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        </div>
                                    ) : (
                                        <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    )}
                                </span>
                            )}
                        </div>

                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className={`absolute -bottom-2.5 ${isMe ? 'right-1' : 'left-1'} flex gap-0.5 z-10`}>
                                {Object.entries(msg.reactions).map(([emoji, users]) => (
                                    <button key={emoji} onClick={() => onToggleReaction(msg.id, emoji)} className={`text-[9px] px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-1 hover:bg-gray-50 transition-colors ${users.includes(user.id.toString()) ? 'ring-1 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                                        <span>{emoji}</span>
                                        <span className="text-gray-500 dark:text-gray-400 font-bold">{users.length}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className={`absolute top-1/2 -translate-y-1/2 ${isMe ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            <Dropdown width="40">
                                <Dropdown.Trigger>
                                    <button className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                                        <EllipsisVerticalIcon className="w-3.5 h-3.5" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align={isMe ? 'right' : 'left'}>
                                    <button onClick={() => setReplyingTo(msg)} className="w-full text-left block px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 rounded-none">
                                        <ChatIcon className="w-3.5 h-3.5 opacity-60" /> {t('chat.reply', 'Responder')}
                                    </button>
                                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                    <div className="flex justify-around px-1 py-1">
                                        {['👍', '❤️', '😂', '😮'].map(emoji => (
                                            <button key={emoji} onClick={() => onToggleReaction(msg.id, emoji)} className="hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 rounded transition-colors text-base">{emoji}</button>
                                        ))}
                                    </div>
                                    {(isMe || user.is_super_admin) && (
                                        <>
                                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                            {isMe && msg.type === 'text' && (
                                                <button onClick={() => { setEditingMessage(msg); setEditContent(msg.content); }} className="w-full text-left block px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 rounded-none">
                                                    <PencilIcon className="w-3.5 h-3.5" /> {t('common.edit', 'Editar')}
                                                </button>
                                            )}
                                            <button onClick={() => onDeleteMessage(msg.id)} className="w-full text-left block px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-none">
                                                <TrashIcon className="w-3.5 h-3.5" /> {t('common.delete', 'Eliminar')}
                                            </button>
                                        </>
                                    )}
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-800 overflow-hidden relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>

            {/* Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm z-10 h-14 shrink-0 bg-white/95 dark:bg-gray-800/95">
                {!showSearch ? (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button onClick={onMobileMenuClick} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 mr-1">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            {activeChannel === 'general' ? (
                                <div className="w-9 h-9 rounded bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold shrink-0 border border-primary-200 dark:border-primary-800/50">
                                    #
                                </div>
                            ) : (
                                <div className="relative shrink-0">
                                    {activeMember?.profile_photo_url ? (
                                        <img src={activeMember.profile_photo_url} alt={channelName} className="w-9 h-9 rounded object-cover border border-primary-100 dark:border-primary-900/30 shadow-sm" />
                                    ) : (
                                        <div className="w-9 h-9 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-base font-bold text-gray-500 border border-gray-200 dark:border-gray-600">
                                            {channelName.charAt(0)}
                                        </div>
                                    )}
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white dark:border-gray-800 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                </div>
                            )}
                            <div className="overflow-hidden">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-none truncate tracking-tight">
                                    {channelName}
                                </h3>
                                {activeChannel !== 'general' ? (
                                    <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">
                                        {isOnline ? t('chat.online', 'En línea') : t('chat.offline', 'Desconectado')}
                                    </p>
                                ) : (
                                    <p className="text-[9px] font-bold text-primary-500 dark:text-primary-400 mt-1 uppercase tracking-widest">
                                        {project.miembros?.length || 0} {t('chat.members', 'Miembros')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center gap-2">
                        <SearchInput
                            placeholder={t('chat.search_placeholder', 'Buscar...')}
                            className="flex-1 h-9 rounded-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                )}

                <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button 
                        onClick={() => { setShowSearch(!showSearch); if(showSearch) { setSearchQuery(''); } }}
                        className={`p-1.5 rounded transition-all duration-200 ${showSearch ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        {showSearch ? <XMarkIcon className="w-4 h-4" /> : <SearchIcon className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50/20 dark:bg-gray-900/20 custom-scrollbar relative">
                {loading && messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10 flex flex-col items-center justify-center h-full">
                        <div className="w-10 h-10 rounded border-2 border-primary-200 border-t-primary-600 animate-spin"></div>
                        <span className="mt-3 font-bold text-[10px] uppercase tracking-widest opacity-60">{t('common.loading', 'Cargando...')}</span>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10 flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded shadow flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700">
                            <ChatIcon className="w-8 h-8 text-primary-500 opacity-30" />
                        </div>
                        <p className="font-bold text-xs text-gray-400 dark:text-gray-500 max-w-[200px] uppercase tracking-tighter">{searchQuery ? t('chat.no_results', 'Sin resultados.') : t('chat.empty', 'Inicia la conversación.')}</p>
                    </div>
                ) : (
                    <div className="pb-2 space-y-6">
                        {groupedMessages.map((group) => (
                            <div key={group.date} className="space-y-1">
                                <div className="flex justify-center my-6 sticky top-0 z-10">
                                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400 text-[9px] font-bold uppercase tracking-[0.15em] rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                                        {group.label}
                                    </span>
                                </div>
                                
                                {group.messages.map((msg) => renderMessage(msg, group.messages.indexOf(msg), group.messages))}
                            </div>
                        ))}
                        
                        {typingInChannel.length > 0 && (
                            <div className="flex items-center gap-2 mt-2 animate-in fade-in duration-300">
                                <div className="flex gap-1 p-1.5 bg-white dark:bg-gray-800 rounded rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="w-1 h-1 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1 h-1 bg-primary-600 rounded-full animate-bounce"></div>
                                </div>
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">
                                    {typingInChannel.length === 1 
                                        ? `${typingInChannel[0].name} ${t('chat.is_typing', 'escribe...')}`
                                        : t('chat.multiple_typing', 'Varios escriben...')}
                                </span>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
                <div className="max-w-4xl mx-auto">
                    {replyingTo && (
                        <div className="mb-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/10 rounded-sm flex justify-between items-center text-[10px] border-l-2 border-primary-500 animate-in slide-in-from-bottom-1">
                            <div className="truncate text-gray-600 dark:text-gray-300">
                                <span className="font-bold text-primary-600 dark:text-primary-400 uppercase block mb-0.5">{t('chat.replying_to', 'Respuesta a')} {replyingTo.user?.name}</span>
                                <span className="truncate opacity-80">{replyingTo.content || t('chat.attachment', 'Adjunto')}</span>
                            </div>
                            <button type="button" onClick={() => setReplyingTo(null)} className="p-1 text-gray-400 hover:text-primary-500">
                                <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                    
                    {editingMessage && (
                        <div className="mb-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/10 rounded-sm flex justify-between items-center text-[10px] border-l-2 border-amber-500 animate-in slide-in-from-bottom-1">
                            <div className="text-amber-700 dark:text-amber-400 flex items-center gap-2 font-bold uppercase">
                                <PencilIcon className="w-3.5 h-3.5" /> {t('chat.editing', 'Editando')}
                            </div>
                            <button type="button" onClick={() => { setEditingMessage(null); setEditContent(''); }} className="text-amber-600 hover:text-amber-700 font-bold uppercase">
                                {t('chat.cancel_edit', 'Cancelar')}
                            </button>
                        </div>
                    )}

                    {selectedFile && (
                        <div className="mb-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-sm flex justify-between items-center text-[10px] border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-1">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 truncate">
                                <DocumentIcon className="w-3.5 h-3.5 text-primary-500" />
                                <span className="truncate font-bold">{selectedFile.name}</span>
                            </div>
                            <button type="button" onClick={removeFile} className="p-1 text-gray-500">
                                <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex gap-1.5 items-center bg-gray-50 dark:bg-gray-900 p-1 rounded border border-gray-200 dark:border-gray-700 transition-all">
                        {!editingMessage && (
                            <>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 rounded hover:bg-white dark:hover:bg-gray-800 text-gray-500 hover:text-primary-600 transition-all shrink-0"
                                    title={t('chat.attach_file', 'Adjuntar')}
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        <div className="flex-1 relative flex items-center">
                            {editingMessage ? (
                                <input
                                    id="editContent"
                                    type="text"
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm py-1.5 px-1.5 text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    placeholder={t('chat.editing', 'Editar...')}
                                    autoComplete="off"
                                    autoFocus
                                />
                            ) : (
                                <input
                                    id="content"
                                    type="text"
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm py-1.5 px-1.5 text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder={t('chat.placeholder', 'Escribe un mensaje...')}
                                    autoComplete="off"
                                />
                            )}
                            
                            <button type="button" className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors shrink-0">
                                <FaceSmileIcon className="w-4.5 h-4.5" />
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            disabled={(editingMessage ? !editContent.trim() : (!data.content.trim() && !selectedFile)) || processing} 
                            className={`p-2 rounded transition-all duration-200 shrink-0 flex items-center justify-center
                                ${ (editingMessage ? editContent.trim() : (data.content.trim() || selectedFile))
                                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {editingMessage ? (
                                <CheckCircleIconV2 className="w-5 h-5" />
                            ) : (
                                <PaperAirplaneIcon className="w-5 h-5" />
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <Lightbox 
                    src={lightboxImage.src} 
                    alt={lightboxImage.alt} 
                    onClose={() => setLightboxImage(null)} 
                />
            )}
        </div>
    );
}
