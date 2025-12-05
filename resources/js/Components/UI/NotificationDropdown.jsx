import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { useTranslate } from '@/Hooks/useTranslate';
import Dropdown from '@/Components/Dropdown';
import { BellIcon, CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon } from '@/Components/Icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);

export default function NotificationDropdown() {
    const { t, locale } = useTranslate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const pollingInterval = useRef(null);

    useEffect(() => {
        dayjs.locale(locale);
        fetchNotifications();
        startPolling();

        return () => stopPolling();
    }, [locale]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route('api.notifications.index'));
            setNotifications(response.data.data);
            setUnreadCount(response.data.meta.unread_count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const startPolling = () => {
        stopPolling();
        pollingInterval.current = setInterval(fetchNotifications, 20000); // 20 seconds
    };

    const stopPolling = () => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(route('api.notifications.read', id));
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(route('api.notifications.mark-all-read'));
            setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            case 'warning': return <WarningIcon className="w-5 h-5 text-amber-500" />;
            case 'error': return <XCircleIcon className="w-5 h-5 text-red-500" />;
            default: return <InfoIcon className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="relative flex items-center">
            <Dropdown width="80" contentClasses="py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Dropdown.Trigger>
                    <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <span className="sr-only">{t('modules.notifications.title', 'Notificaciones')}</span>
                        <BellIcon className="h-6 w-6 transition-colors duration-200 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
                        )}
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content>
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t('modules.notifications.title', 'Notificaciones')}
                        </span>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                {t('modules.notifications.mark_all_read', 'Marcar todas como leídas')}
                            </button>
                        )}
                    </div>

                    {notifications.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 ${!notification.read_at ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                >
                                    <div className="shrink-0 mr-3 mt-0.5">
                                        {getIcon(notification.data.type || 'info')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {notification.data.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {notification.data.message}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {dayjs(notification.created_at).fromNow()}
                                        </p>
                                    </div>
                                    {!notification.read_at && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="ml-2 w-2 h-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                                            title={t('modules.notifications.mark_read', 'Marcar como leída')}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            <BellIcon className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                            {t('modules.notifications.empty', 'No tienes notificaciones.')}
                        </div>
                    )}

                    <div className="border-t border-gray-100 dark:border-gray-700">
                        <Link href={route('profile.edit')} className="block px-4 py-2 text-center text-primary-600 dark:text-primary-400 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            {t('modules.notifications.settings', 'Configuración de Notificaciones')}
                        </Link>
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}
