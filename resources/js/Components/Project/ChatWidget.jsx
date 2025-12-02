import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { PaperAirplaneIcon, ChevronDownIcon, ChatIcon } from '@/Components/Icons';

export default function ChatWidget({ project, user }) {
    const { t } = useTranslate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [pollingInterval, setPollingInterval] = useState(null);
    const [activeChannel, setActiveChannel] = useState('general'); // 'general' or user_id
    const [showMembers, setShowMembers] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        type: 'text',
    });

    const fetchMessages = async () => {
        try {
            const response = await axios.get(route('project.messages.index', project.id));
            setMessages(response.data.data.reverse());
            setLoading(false);

            // Mark as read when fetching (simple approach)
            // Ideally should be when focusing or opening the widget
            if (messages.length > 0) {
                axios.post(route('project.messages.read', project.id));
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        setPollingInterval(interval);
        return () => clearInterval(interval);
    }, [project.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChannel]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!data.content.trim()) return;

        try {
            const payload = {
                content: data.content,
                type: 'text',
                recipient_id: activeChannel === 'general' ? null : activeChannel
            };

            const response = await axios.post(route('project.messages.store', project.id), payload);
            setMessages([...messages, response.data]);
            reset();
            scrollToBottom();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Filter messages based on active channel
    const filteredMessages = messages.filter(msg => {
        if (activeChannel === 'general') {
            return !msg.recipient_id;
        }
        return (msg.recipient_id === activeChannel && msg.user_id === user.id) ||
            (msg.recipient_id === user.id && msg.user_id === activeChannel);
    });

    const activeMember = project.miembros?.find(m => m.id === activeChannel);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[500px]">
            {/* Header with Channel Selector */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowMembers(!showMembers)}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {activeChannel === 'general' ? (
                            <>
                                <ChatIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                {t('projects.chat_general', 'General Chat')}
                            </>
                        ) : (
                            <>🔒 {activeMember?.name}</>
                        )}
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${showMembers ? 'rotate-180' : ''}`} />
                    </h3>
                </div>
            </div>

            {/* Members Dropdown/List */}
            {showMembers && (
                <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-2 max-h-40 overflow-y-auto">
                    <button
                        onClick={() => { setActiveChannel('general'); setShowMembers(false); }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 ${activeChannel === 'general' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                    >
                        <ChatIcon className="w-4 h-4" />
                        {t('projects.chat_general', 'General Chat')}
                    </button>
                    {project.miembros?.filter(m => m.id !== user.id).map(member => (
                        <button
                            key={member.id}
                            onClick={() => { setActiveChannel(member.id); setShowMembers(false); }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 ${activeChannel === member.id ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            {member.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {loading && messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                        {t('common.loading', 'Loading...')}
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                        <p>{t('projects.chat_empty', 'No messages yet. Start the conversation!')}</p>
                    </div>
                ) : (
                    filteredMessages.map((msg) => {
                        const isMe = msg.user_id === user.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 ${isMe
                                    ? 'bg-primary-600 text-white rounded-br-none'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                                    }`}>
                                    {!isMe && (
                                        <div className="text-xs font-bold mb-1 opacity-75">
                                            {msg.user?.name}
                                        </div>
                                    )}
                                    <p className="text-sm break-words">{msg.content}</p>
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {msg.read_at && isMe && <span className="ml-1">✓✓</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
                <form onSubmit={sendMessage} className="flex gap-2">
                    <TextInput
                        id="content"
                        type="text"
                        className="flex-1 block w-full"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder={activeChannel === 'general' ? t('projects.chat_placeholder', 'Type a message...') : `Message ${activeMember?.name}...`}
                        autoComplete="off"
                    />
                    <PrimaryButton type="submit" disabled={!data.content.trim() || processing} className="px-4">
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}
