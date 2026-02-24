import React, { useState, useRef, useEffect } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, Cog6ToothIcon } from '@/Components/Icons';
import axios from 'axios';
import { Link, usePage } from '@inertiajs/react';
import SelectInput from '@/Components/SelectInput';

export default function AiChatWidget() {
    const { t } = useTranslate();
    const { auth } = usePage().props;
    const hasActiveAi = auth?.user?.has_active_ai || false;

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputQuery, setInputQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Dynamic Dropdowns State
    const [availableProviders, setAvailableProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [loadingModels, setLoadingModels] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!hasActiveAi) {
        return null;
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            if (availableProviders.length === 0 && !loadingModels) {
                fetchAvailableModels();
            }
        }
    }, [messages, isOpen]);

    const fetchAvailableModels = async () => {
        setLoadingModels(true);
        try {
            const response = await axios.get('/api/llm/available-models');
            if (response.data.success && response.data.data.length > 0) {
                setAvailableProviders(response.data.data);
                setSelectedProvider(response.data.data[0].provider);
                if (response.data.data[0].models.length > 0) {
                    setSelectedModel(response.data.data[0].models[0].id);
                }
            }
        } catch (error) {
            console.error("Error fetching models:", error);
        } finally {
            setLoadingModels(false);
        }
    };

    useEffect(() => {
        if (selectedProvider) {
            const providerData = availableProviders.find(p => p.provider === selectedProvider);
            if (providerData && providerData.models.length > 0) {
                const modelExists = providerData.models.find(m => m.id === selectedModel);
                if (!modelExists) {
                    setSelectedModel(providerData.models[0].id);
                }
            }
        }
    }, [selectedProvider, availableProviders]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputQuery.trim() || isLoading) return;

        const userMessage = { role: 'user', content: inputQuery };
        setMessages(prev => [...prev, userMessage]);
        setInputQuery('');
        setIsLoading(true);

        try {
            // Send entire history except system errors, to save tokens and maintain clean context
            const historyToSend = messages.filter(m => m.role !== 'system');

            const response = await axios.post('/api/ai/chat', {
                prompt: userMessage.content,
                history: historyToSend,
                override_provider: selectedProvider || null,
                override_model: selectedModel || null
            });

            if (response.data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'system', content: response.data.message || 'Error occurred.' }]);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || t('ai.connection_error', 'Error de conexión con la IA.');
            setMessages(prev => [...prev, { role: 'system', content: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!hasActiveAi) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
                    {/* Header */}
                    <div className="bg-indigo-600 dark:bg-indigo-700 p-4 flex flex-col space-y-3 text-white">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                <h3 className="font-semibold">{t('ai.assistant', 'Asistente IA')}</h3>
                            </div>
                            <div className="flex space-x-2">
                                <Link href="/profile" className="text-indigo-100 hover:text-white transition" title={t('ai.configure', 'Configurar IA')}>
                                    <Cog6ToothIcon className="w-5 h-5" />
                                </Link>
                                <button onClick={() => setIsOpen(false)} className="text-indigo-100 hover:text-white transition">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Selectors */}
                        {availableProviders.length > 0 && (
                            <div className="flex space-x-2 text-xs">
                                <SelectInput
                                    className="py-1 px-2 text-xs flex-1 cursor-pointer truncate max-w-[50%]"
                                    value={selectedProvider}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                    title={t('ai.provider', 'Proveedor de IA')}
                                >
                                    {availableProviders.map(p => (
                                        <option key={p.provider} value={p.provider}>{p.name}</option>
                                    ))}
                                </SelectInput>

                                <SelectInput
                                    className="py-1 px-2 text-xs flex-1 cursor-pointer truncate max-w-[50%]"
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    title={t('ai.model', 'Modelo de IA')}
                                >
                                    {availableProviders.find(p => p.provider === selectedProvider)?.models.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </SelectInput>
                            </div>
                        )}
                        {loadingModels && (
                            <div className="text-indigo-200 text-xs text-center">{t('common.loading', 'Cargando...')}</div>
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-4 overflow-y-auto max-h-96 min-h-[16rem] bg-gray-50 dark:bg-gray-900 space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                                <p className="text-sm">{t('ai.welcome_msg', '¡Hola! ¿En qué puedo ayudarte hoy?')}</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : msg.role === 'system'
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-2 text-sm flex space-x-1 items-center">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <input
                            type="text"
                            value={inputQuery}
                            onChange={(e) => setInputQuery(e.target.value)}
                            placeholder={t('ai.type_message', 'Escribe tu mensaje...')}
                            className="flex-1 rounded-full border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm px-4 text-sm"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputQuery.trim()}
                            className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            <PaperAirplaneIcon className="w-5 h-5 -ml-0.5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-4 rounded-full shadow-lg bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}
