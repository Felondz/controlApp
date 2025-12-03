import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

export default function ChatWidget({ project, user }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChannel, setActiveChannel] = useState('general'); // 'general' or user_id
    const [unreadCounts, setUnreadCounts] = useState({ general: 0, dms: {} });
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    // Fetch messages for the active channel
    const fetchMessages = useCallback(async () => {
        try {
            const params = activeChannel === 'general' ? {} : { recipient_id: activeChannel };
            const response = await axios.get(route('project.messages.index', project.id), { params });
            setMessages(response.data.data.reverse());
            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setLoading(false);
        }
    }, [project.id, activeChannel]);

    // Fetch unread counts
    const fetchUnreadCounts = useCallback(async () => {
        try {
            const response = await axios.get(route('project.messages.unread', project.id));
            setUnreadCounts(response.data);
        } catch (error) {
            console.error("Error fetching unread counts:", error);
        }
    }, [project.id]);

    // Mark active channel as read
    const markAsRead = useCallback(async () => {
        try {
            // Check if there are unread messages
            const hasUnread = activeChannel === 'general'
                ? unreadCounts.general > 0
                : (unreadCounts.dms && unreadCounts.dms[activeChannel] > 0);

            if (hasUnread) {
                const payload = activeChannel === 'general' ? {} : { recipient_id: activeChannel };
                await axios.post(route('project.messages.read', project.id), payload);

                // Optimistically update local state to prevent loops
                setUnreadCounts(prev => {
                    if (activeChannel === 'general') {
                        return { ...prev, general: 0 };
                    } else {
                        return {
                            ...prev,
                            dms: { ...prev.dms, [activeChannel]: 0 }
                        };
                    }
                });

                // Update global unread count (Sidebar/Navbar)
                router.reload({ only: ['auth', 'proyecto'], preserveScroll: true });

                // Fetch latest counts to be sure (in background)
                fetchUnreadCounts();
            }
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    }, [project.id, activeChannel, unreadCounts, fetchUnreadCounts]);

    // Initial load and channel change
    useEffect(() => {
        setLoading(true);
        fetchMessages();
        markAsRead();
    }, [activeChannel, markAsRead]); // Re-run when channel changes or unread counts change (via markAsRead dependency)

    // Polling for new messages and unread counts
    useEffect(() => {
        // Initial fetch for unread counts
        fetchUnreadCounts();

        const interval = setInterval(() => {
            // We use the functional update or refs if needed, but here we just want to refresh data
            // Note: We don't call markAsRead here to avoid loops. 
            // If user is active, they will trigger markAsRead via interaction or focus (future improvement)
            // For now, we just fetch data.

            // We need to fetch messages for the *current* active channel to see new ones
            // And fetch unread counts for *other* channels
            fetchMessages();
            fetchUnreadCounts();
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchMessages, fetchUnreadCounts]); // These are stable callbacks

    const handleSendMessage = async (content) => {
        try {
            const payload = {
                content,
                type: 'text',
                recipient_id: activeChannel === 'general' ? null : activeChannel
            };

            const response = await axios.post(route('project.messages.store', project.id), payload);
            setMessages(prev => [...prev, response.data]);

            // Optimistic update: ensure we stay marked as read
            markAsRead();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex h-[600px] overflow-hidden">
            <ChatSidebar
                project={project}
                user={user}
                activeChannel={activeChannel}
                onChannelSelect={setActiveChannel}
                unreadCounts={unreadCounts}
                showMobile={showMobileSidebar}
                onCloseMobile={() => setShowMobileSidebar(false)}
            />

            <ChatWindow
                project={project}
                user={user}
                activeChannel={activeChannel}
                messages={messages}
                loading={loading}
                onSendMessage={handleSendMessage}
                onMobileMenuClick={() => setShowMobileSidebar(true)}
            />

            {/* Overlay for mobile sidebar */}
            {showMobileSidebar && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setShowMobileSidebar(false)}
                ></div>
            )}
        </div>
    );
}
