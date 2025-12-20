import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';
import { ChatBubbleLeftRightIcon } from '@/Components/Icons';
import axios from 'axios';

export default function ChatRecentWidget({ project, widget, onHide, isDragging, dragHandleProps }) {
    const { t } = useTranslate();
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use named API routes
                const [messagesRes, unreadRes] = await Promise.all([
                    axios.get(route('api.proyectos.messages.index', { proyecto: project.id })),
                    axios.get(route('api.proyectos.messages.unread', { proyecto: project.id }))
                ]);

                setMessages(messagesRes.data.data || []);
                setUnreadCount(unreadRes.data.count || 0);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching chat data:', error);
                setLoading(false);
            }
        };

        if (project?.id) {
            fetchData();
        }
    }, [project]);

    if (loading) {
        return (
            <WidgetCard
                widget={widget}
                title={t('widgets.chat_recent', 'Mensajes Recientes')}
                icon={ChatBubbleLeftRightIcon}
                onHide={onHide}
                isDragging={isDragging}
                dragHandleProps={dragHandleProps}
            >
                <div className="animate-pulse h-24 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            </WidgetCard>
        );
    }

    return (
        <WidgetCard
            widget={widget}
            title={t('widgets.chat_recent', 'Mensajes Recientes')}
            icon={ChatBubbleLeftRightIcon}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
            action={
                project ? (
                    <Link
                        href={route('mis-proyectos.chat', { mis_proyecto: project.id })}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                        {t('common.go_to_chat', 'Ir al chat')}
                    </Link>
                ) : null
            }
        >
            <div className="space-y-3">
                {messages.length > 0 ? (
                    messages.slice(0, 3).map((msg) => (
                        <div key={msg.id} className="flex items-start gap-3 text-sm">
                            <img
                                src={msg.user?.profile_photo_url}
                                alt={msg.user?.name}
                                className="w-6 h-6 rounded-full mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                    {msg.user?.name}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 truncate">
                                    {msg.content}
                                </p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                        {t('chat.no_recent_messages', 'No hay mensajes recientes')}
                    </p>
                )}

                {unreadCount > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium text-center">
                            {t('chat.unread_count', { count: unreadCount }, `${unreadCount} mensajes nuevos`)}
                        </p>
                    </div>
                )}
            </div>
        </WidgetCard>
    );
}
