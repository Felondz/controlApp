import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import ChatSidebar from '@/Components/Project/ChatSidebar';
import ChatWindow from '@/Components/Project/ChatWindow';

export default function ChatWidget({ project, user }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChannel, setActiveChannel] = useState('general');
    const [unreadCounts, setUnreadCounts] = useState({ general: 0, dms: {} });
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [lastReadAt, setLastReadAt] = useState(null);

    // Refs for stable values
    const activeChannelRef = useRef(activeChannel);
    const lastMessageCountRef = useRef(0);

    useEffect(() => {
        activeChannelRef.current = activeChannel;
    }, [activeChannel]);

    // Fetch unread counts and timestamps
    const fetchUnreadCounts = useCallback(async () => {
        try {
            const response = await axios.get(route('project.messages.unread', project.id));
            setUnreadCounts(response.data);
            
            // Update lastReadAt based on active channel
            const channel = activeChannelRef.current;
            if (channel === 'general') {
                setLastReadAt(response.data.general_last_read_at);
            } else {
                setLastReadAt(response.data.dms_last_read_at?.[channel]);
            }
        } catch (error) {
            console.error("Error fetching unread counts:", error);
        }
    }, [project.id]);

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

    // Mark as read
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
        setSearchResults(null);
        
        // Load counts first to get the separator date
        fetchUnreadCounts().then(() => {
            fetchMessages();
            markAsRead();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChannel]);

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState({});

    // WebSocket setup with Laravel Echo
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.join(`project.${project.id}.chat`);

        channel
            .here((users) => {
                setOnlineUsers(users);
            })
            .joining((user) => {
                setOnlineUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
            })
            .leaving((user) => {
                setOnlineUsers(prev => prev.filter(u => u.id !== user.id));
            })
            .listenForWhisper('typing', (e) => {
                setTypingUsers(prev => ({
                    ...prev,
                    [e.user_id]: {
                        name: e.user_name,
                        channel: e.channel
                    }
                }));
                
                // Clear typing indicator after 3 seconds
                setTimeout(() => {
                    setTypingUsers(prev => {
                        const newState = { ...prev };
                        delete newState[e.user_id];
                        return newState;
                    });
                }, 3000);
            })
            .listen('.MessageSent', (data) => {
                const newMessage = data.message;
                const currentChannel = activeChannelRef.current;

                // Check if message belongs to current view
                const isGeneral = !newMessage.recipient_id && currentChannel === 'general';
                const isDMWithMe = (newMessage.user_id === parseInt(currentChannel) || newMessage.recipient_id === parseInt(currentChannel)) && currentChannel !== 'general';

                if (isGeneral || isDMWithMe) {
                    setMessages(prev => {
                        // Avoid duplicates just in case (though we use toOthers())
                        if (prev.some(m => m.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });
                    lastMessageCountRef.current += 1;
                    markAsRead();
                } else {
                    // Update unread counts for other channels
                    setUnreadCounts(prev => {
                        if (!newMessage.recipient_id) {
                            return { ...prev, general: prev.general + 1 };
                        }
                        const senderId = newMessage.user_id;
                        return {
                            ...prev,
                            dms: { ...prev.dms, [senderId]: (prev.dms[senderId] || 0) + 1 }
                        };
                    });
                }
            })
            .listen('.MessageUpdated', (data) => {
                const updatedMessage = data.message;
                setMessages(prev => prev.map(m => m.id === updatedMessage.id ? updatedMessage : m));
            })
            .listen('.MessageDeleted', (data) => {
                setMessages(prev => prev.filter(m => m.id !== data.message_id));
            });

        return () => {
            window.Echo.leave(`project.${project.id}.chat`);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project.id]);

    const handleSendMessage = async (content, file = null, parentId = null) => {
        try {
            const channel = activeChannelRef.current;
            
            const formData = new FormData();
            if (content) formData.append('content', content);
            if (channel !== 'general') formData.append('recipient_id', channel);
            if (parentId) formData.append('parent_id', parentId);
            if (file) formData.append('file', file);

            const response = await axios.post(route('project.messages.store', project.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setMessages(prev => [...prev, response.data]);
            lastMessageCountRef.current += 1;
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleUpdateMessage = async (messageId, newContent) => {
        try {
            const response = await axios.put(route('project.messages.update', [project.id, messageId]), {
                content: newContent
            });
            setMessages(prev => prev.map(m => m.id === messageId ? response.data : m));
        } catch (error) {
            console.error("Error updating message:", error);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await axios.delete(route('project.messages.destroy', [project.id, messageId]));
            setMessages(prev => prev.filter(m => m.id !== messageId));
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const handleToggleReaction = async (messageId, emoji) => {
        try {
            const response = await axios.post(route('project.messages.react', [project.id, messageId]), {
                emoji
            });
            setMessages(prev => prev.map(m => m.id === messageId ? response.data : m));
        } catch (error) {
            console.error("Error toggling reaction:", error);
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults(null);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await axios.get(route('project.messages.search', project.id), {
                params: { query }
            });
            setSearchResults(response.data.data);
        } catch (error) {
            console.error("Error searching messages:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleTyping = () => {
        if (!window.Echo) return;
        
        window.Echo.join(`project.${project.id}.chat`)
            .whisper('typing', {
                user_id: user.id,
                user_name: user.name,
                channel: activeChannelRef.current
            });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex h-[600px] overflow-hidden">
            <ChatSidebar
                project={project}
                user={user}
                activeChannel={activeChannel}
                onChannelSelect={setActiveChannel}
                unreadCounts={unreadCounts}
                onlineUsers={onlineUsers}
                showMobile={showMobileSidebar}
                onCloseMobile={() => setShowMobileSidebar(false)}
            />

            <ChatWindow
                project={project}
                user={user}
                activeChannel={activeChannel}
                messages={messages}
                loading={loading}
                searchResults={searchResults}
                isSearching={isSearching}
                lastReadAt={lastReadAt}
                onlineUsers={onlineUsers}
                typingUsers={typingUsers}
                onSendMessage={handleSendMessage}
                onUpdateMessage={handleUpdateMessage}
                onDeleteMessage={handleDeleteMessage}
                onToggleReaction={handleToggleReaction}
                onSearch={handleSearch}
                onTyping={handleTyping}
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