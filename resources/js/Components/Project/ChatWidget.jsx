import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

export default function ChatWidget({ project, user }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChannel, setActiveChannel] = useState('general');
    const [unreadCounts, setUnreadCounts] = useState({ general: 0, dms: {} });
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    // Refs for stable values
    const activeChannelRef = useRef(activeChannel);
    const lastMessageCountRef = useRef(0);

    useEffect(() => {
        activeChannelRef.current = activeChannel;
    }, [activeChannel]);

    // Fetch messages
    const fetchMessages = useCallback(async () => {
        try {
            const channel = activeChannelRef.current;
            const params = channel === 'general' ? {} : { recipient_id: channel };
            const response = await axios.get(route('project.messages.index', project.id), { params });
            const newMessages = response.data.data.reverse();

            // If new messages arrived while viewing this channel, mark as read
            if (newMessages.length > lastMessageCountRef.current && lastMessageCountRef.current > 0) {
                markAsRead();
            }
            lastMessageCountRef.current = newMessages.length;

            setMessages(newMessages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setLoading(false);
        }
    }, [project.id]);

    // Fetch unread counts
    const fetchUnreadCounts = useCallback(async () => {
        try {
            const response = await axios.get(route('project.messages.unread', project.id));
            setUnreadCounts(response.data);
        } catch (error) {
            console.error("Error fetching unread counts:", error);
        }
    }, [project.id]);

    // Mark as read - calls API and updates local state only (no page reload)
    const markAsRead = useCallback(async () => {
        try {
            const channel = activeChannelRef.current;
            const payload = channel === 'general' ? {} : { recipient_id: channel };

            await axios.post(route('project.messages.read', project.id), payload);

            setUnreadCounts(prev => {
                if (channel === 'general') {
                    return { ...prev, general: 0 };
                }
                return { ...prev, dms: { ...prev.dms, [channel]: 0 } };
            });
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    }, [project.id]);

    // On channel change: load messages and mark as read
    useEffect(() => {
        setLoading(true);
        lastMessageCountRef.current = 0;
        fetchMessages();
        markAsRead();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChannel]);

    // Polling every 3 seconds
    useEffect(() => {
        fetchUnreadCounts();

        if (import.meta.env.MODE === 'test') return;

        const interval = setInterval(() => {
            fetchMessages();
            fetchUnreadCounts();
        }, 3000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project.id]);

    const handleSendMessage = async (content) => {
        try {
            const channel = activeChannelRef.current;
            const payload = {
                content,
                type: 'text',
                recipient_id: channel === 'general' ? null : channel
            };

            const response = await axios.post(route('project.messages.store', project.id), payload);
            setMessages(prev => [...prev, response.data]);
            lastMessageCountRef.current += 1;
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

            {showMobileSidebar && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setShowMobileSidebar(false)}
                ></div>
            )}
        </div>
    );
}
