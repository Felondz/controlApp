import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Dropdown from '@/Components/Dropdown';
import SearchInput from '@/Components/SearchInput';
import { PaperAirplaneIcon, ChatIcon, ArrowLeftIcon, PlusIcon, DocumentIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, XMarkIcon, SearchIcon } from '@/Components/Icons';

export default function ChatWindow({ project, user, activeChannel, messages, loading, onSendMessage, onUpdateMessage, onDeleteMessage, onToggleReaction, onMobileMenuClick }) {
    const { t } = useTranslate();
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, reset, processing } = useForm({
        content: '',
    });

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
    const channelName = activeChannel === 'general'
        ? t('chat.general', 'General')
        : activeMember?.name || t('common.user_unknown', 'Usuario');

    const renderMessage = (msg, index) => {
        const isMe = msg.user_id === user.id;
        const prevMsg = index > 0 ? filteredMessages[index - 1] : null;
        
        // Clustering logic: same user and less than 2 minutes apart
        const isClustered = prevMsg && 
                           prevMsg.user_id === msg.user_id && 
                           (new Date(msg.created_at) - new Date(prevMsg.created_at)) < 120000;

        // Unread separator logic (only if not searching)
        const showUnreadSeparator = !searchQuery && lastReadAt && 
                                   new Date(msg.created_at) > new Date(lastReadAt) && 
                                   (!prevMsg || new Date(prevMsg.created_at) <= new Date(lastReadAt)) &&
                                   !isMe;

        return (
            <React.Fragment key={msg.id}>
                {showUnreadSeparator && (
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-red-300 dark:border-red-900/50"></div>
                        <span className="px-4 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {t('chat.new_messages', 'Nuevos Mensajes')}
                        </span>
                        <div className="flex-1 border-t border-red-300 dark:border-red-900/50"></div>
                    </div>
                )}
                
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} group ${isClustered ? 'mt-1' : 'mt-4'}`}>
                    <div className={`relative max-w-[85%] md:max-w-[70%] shadow-sm transition-all duration-200
                        ${isMe ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-600'}
                        ${isClustered && isMe ? 'rounded-2xl rounded-tr-sm' : ''}
                        ${!isClustered && isMe ? 'rounded-2xl rounded-br-sm' : ''}
                        ${isClustered && !isMe ? 'rounded-2xl rounded-tl-sm' : ''}
                        ${!isClustered && !isMe ? 'rounded-2xl rounded-bl-sm' : ''}
                        px-4 py-2`}>
                        
                        {msg.parent && (
                            <div className={`text-xs mb-2 p-2 rounded-lg opacity-80 ${isMe ? 'bg-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                <span className="font-bold">{msg.parent.user?.name}: </span>
                                <span className="truncate block max-w-xs">{msg.parent.content || t('chat.attachment', 'Archivo adjunto')}</span>
                            </div>
                        )}

                        {!isMe && !isClustered && (
                            <div className="text-xs font-bold mb-1 opacity-75 text-primary-600 dark:text-primary-400">
                                {msg.user?.name}
                            </div>
                        )}

                        {msg.type === 'image' && msg.file_url && (
                            <img src={msg.file_url} alt="Attachment" className="rounded-lg mb-2 max-w-full h-auto max-h-64 object-cover" onLoad={scrollToBottom} />
                        )}

                        {msg.type === 'file' && msg.file_url && (
                            <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2 rounded-lg mb-2 text-sm ${isMe ? 'bg-primary-700 hover:bg-primary-800' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-900'} transition-colors`}>
                                <DocumentIcon className="w-5 h-5 shrink-0" />
                                <span className="truncate font-medium">{msg.content || t('chat.attachment', 'Archivo adjunto')}</span>
                            </a>
                        )}

                        {(msg.type === 'text' || (msg.type !== 'text' && msg.content && msg.content !== (msg.file_url?.split('/').pop() || ''))) && (
                            <p className="text-sm break-words leading-relaxed whitespace-pre-wrap">
                                {searchQuery ? (
                                    // Highlight search results
                                    msg.content.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                                        part.toLowerCase() === searchQuery.toLowerCase() 
                                            ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-current rounded-sm px-0.5">{part}</mark> 
                                            : part
                                    )
                                ) : msg.content}
                            </p>
                        )}

                        <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                            {msg.is_edited && <span className="italic opacity-75">({t('common.edited', 'editado')})</span>}
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && (
                                <span>
                                    {msg.read_at ? (
                                        <div className="flex -space-x-1">
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
                            <div className={`absolute -bottom-3 ${isMe ? 'right-2' : 'left-2'} flex gap-1 z-10`}>
                                {Object.entries(msg.reactions).map(([emoji, users]) => (
                                    <button key={emoji} onClick={() => onToggleReaction(msg.id, emoji)} className={`text-[10px] px-1.5 py-0.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${users.includes(user.id.toString()) ? 'ring-1 ring-primary-500' : ''}`}>
                                        <span>{emoji}</span>
                                        <span className="text-gray-500 font-medium">{users.length}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className={`absolute top-2 ${isMe ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            <Dropdown width="48">
                                <Dropdown.Trigger>
                                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                                        <EllipsisVerticalIcon className="w-4 h-4" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align={isMe ? 'right' : 'left'}>
                                    <button onClick={() => setReplyingTo(msg)} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        {t('chat.reply', 'Responder')}
                                    </button>
                                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                    <div className="px-4 py-1 text-xs text-gray-500 font-medium">{t('chat.react', 'Reaccionar')}</div>
                                    <div className="flex justify-around px-4 py-2">
                                        {['👍', '❤️', '😂', '😮'].map(emoji => (
                                            <button key={emoji} onClick={() => onToggleReaction(msg.id, emoji)} className="hover:scale-125 transition-transform text-lg">{emoji}</button>
                                        ))}
                                    </div>
                                    {isMe && msg.type === 'text' && (
                                        <>
                                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                            <button onClick={() => { setEditingMessage(msg); setEditContent(msg.content); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
                                                <PencilIcon className="w-4 h-4" /> {t('common.edit', 'Editar')}
                                            </button>
                                        </>
                                    )}
                                    {(isMe || user.is_super_admin) && (
                                        <button onClick={() => onDeleteMessage(msg.id)} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                            <TrashIcon className="w-4 h-4" /> {t('common.delete', 'Eliminar')}
                                        </button>
                                    )}
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-800 overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm z-10 h-16 shrink-0 bg-white dark:bg-gray-800">
                {!showSearch ? (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button onClick={onMobileMenuClick} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 mr-2 flex items-center gap-1">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 overflow-hidden">
                            {activeChannel === 'general' ? (
                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold shrink-0">
                                    #
                                </div>
                            ) : (
                                <div className="relative shrink-0">
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
                            <div className="overflow-hidden">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-none truncate">
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
                ) : (
                    <div className="flex-1 flex items-center gap-2">
                        <SearchInput
                            placeholder={t('chat.search_placeholder', 'Buscar en este chat...')}
                            className="flex-1 h-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                )}

                <div className="flex items-center gap-2 shrink-0 ml-2">
                    <button 
                        onClick={() => { setShowSearch(!showSearch); if(showSearch) { setSearchQuery(''); } }}
                        className={`p-2 rounded-full transition-colors ${showSearch ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        {showSearch ? <XMarkIcon className="w-5 h-5" /> : <SearchIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-900/50 custom-scrollbar relative">
                {loading && messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10 flex flex-col items-center justify-center h-full">
                        <svg className="animate-spin h-8 w-8 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('common.loading', 'Cargando...')}
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10 flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <ChatIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p>{searchQuery ? t('chat.no_results', 'No se encontraron coincidencias.') : t('chat.empty', 'No hay mensajes aún. ¡Inicia la conversación!')}</p>
                    </div>
                ) : (
                    <div className="pb-4">
                        {filteredMessages.map((msg, idx) => renderMessage(msg, idx))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {replyingTo && (
                    <div className="mb-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between items-center text-sm border-l-4 border-primary-500">
                        <div className="truncate text-gray-600 dark:text-gray-300">
                            <span className="font-bold text-primary-600 dark:text-primary-400">{t('chat.replying_to', 'Respondiendo a')} {replyingTo.user?.name}: </span>
                            {replyingTo.content || t('chat.attachment', 'Archivo adjunto')}
                        </div>
                        <button type="button" onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            &times;
                        </button>
                    </div>
                )}
                
                {editingMessage && (
                    <div className="mb-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex justify-between items-center text-sm border-l-4 border-amber-500">
                        <div className="text-amber-700 dark:text-amber-400 flex items-center gap-2">
                            <PencilIcon className="w-4 h-4" /> {t('chat.editing', 'Editando mensaje')}
                        </div>
                        <button type="button" onClick={() => { setEditingMessage(null); setEditContent(''); }} className="text-amber-500 hover:text-amber-700">
                            &times; {t('chat.cancel_edit', 'Cancelar edición')}
                        </button>
                    </div>
                )}

                {selectedFile && (
                    <div className="mb-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex justify-between items-center text-sm border border-primary-100 dark:border-primary-800">
                        <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300 truncate">
                            <DocumentIcon className="w-5 h-5 shrink-0" />
                            <span className="truncate font-medium">{selectedFile.name}</span>
                            <span className="text-xs opacity-70">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button type="button" onClick={removeFile} className="text-primary-500 hover:text-primary-700 p-1">
                            &times;
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-2 items-end">
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
                                className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 shrink-0 h-[42px] flex items-center justify-center"
                                title={t('chat.attach_file', 'Adjuntar archivo')}
                            >
                                <PlusIcon className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {editingMessage ? (
                        <TextInput
                            id="editContent"
                            type="text"
                            className="flex-1 block w-full h-[42px]"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder={t('chat.editing', 'Editar mensaje...')}
                            autoComplete="off"
                            autoFocus
                        />
                    ) : (
                        <TextInput
                            id="content"
                            type="text"
                            className="flex-1 block w-full h-[42px]"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder={t('chat.placeholder', 'Escribe un mensaje...')}
                            autoComplete="off"
                        />
                    )}

                    <PrimaryButton 
                        type="submit" 
                        disabled={(editingMessage ? !editContent.trim() : (!data.content.trim() && !selectedFile)) || processing} 
                        className="h-[42px] px-4 flex items-center justify-center shrink-0 shadow-md"
                    >
                        {editingMessage ? (
                            <span className="font-bold">{t('chat.save_edit', 'Guardar')}</span>
                        ) : (
                            <PaperAirplaneIcon className="w-5 h-5" />
                        )}
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}