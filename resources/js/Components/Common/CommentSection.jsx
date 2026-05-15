import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import TextArea from '@/Components/TextArea';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);

/**
 * CommentSection with @mention support.
 *
 * @param {Object[]} comments - Array of comment objects
 * @param {Function} onAddComment - Callback: (content, mentionedUserIds, clearFn) => void
 * @param {boolean} isSubmitting
 * @param {string} className
 * @param {Object[]} projectMembers - Array of { id, name, profile_photo_url } for mention suggestions
 */
export default function CommentSection({ comments = [], onAddComment, isSubmitting = false, className = '', projectMembers = [] }) {
    const { t } = useTranslate();
    const [newComment, setNewComment] = useState('');
    const [mentionedUsers, setMentionedUsers] = useState([]);

    // Mention dropdown state
    const [showMentionDropdown, setShowMentionDropdown] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionStartIndex, setMentionStartIndex] = useState(-1);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
    const textAreaRef = useRef(null);
    const dropdownRef = useRef(null);

    const filteredMembers = projectMembers.filter(
        (m) =>
            m.name.toLowerCase().includes(mentionQuery.toLowerCase()) &&
            !mentionedUsers.find((mu) => mu.id === m.id)
    );

    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setNewComment(value);

        // Detect @ trigger
        const cursorPos = e.target.selectionStart;
        const textBeforeCursor = value.substring(0, cursorPos);
        const atMatch = textBeforeCursor.match(/@(\w*)$/);

        if (atMatch && projectMembers.length > 0) {
            setShowMentionDropdown(true);
            setMentionQuery(atMatch[1]);
            setMentionStartIndex(cursorPos - atMatch[0].length);
            setSelectedSuggestionIndex(0);
        } else {
            setShowMentionDropdown(false);
            setMentionQuery('');
            setMentionStartIndex(-1);
        }
    }, [projectMembers]);

    const insertMention = useCallback((member) => {
        if (mentionStartIndex < 0) return;

        const before = newComment.substring(0, mentionStartIndex);
        const cursorPos = textAreaRef.current?.selectionStart || newComment.length;
        const after = newComment.substring(cursorPos);
        const mentionText = `@${member.name.replace(/\s+/g, '')} `;

        setNewComment(before + mentionText + after);
        setMentionedUsers((prev) => [...prev.filter((u) => u.id !== member.id), member]);
        setShowMentionDropdown(false);
        setMentionQuery('');
        setMentionStartIndex(-1);

        // Focus back to textarea
        setTimeout(() => {
            const ta = textAreaRef.current;
            if (ta) {
                const newPos = (before + mentionText).length;
                ta.focus();
                ta.setSelectionRange(newPos, newPos);
            }
        }, 0);
    }, [mentionStartIndex, newComment]);

    const handleKeyDown = useCallback((e) => {
        if (!showMentionDropdown || filteredMembers.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedSuggestionIndex((prev) => Math.min(prev + 1, filteredMembers.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedSuggestionIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            insertMention(filteredMembers[selectedSuggestionIndex]);
        } else if (e.key === 'Escape') {
            setShowMentionDropdown(false);
        }
    }, [showMentionDropdown, filteredMembers, selectedSuggestionIndex, insertMention]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowMentionDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const removeMention = (userId) => {
        setMentionedUsers((prev) => prev.filter((u) => u.id !== userId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        const ids = mentionedUsers.map((u) => u.id);
        onAddComment(newComment, ids, () => {
            setNewComment('');
            setMentionedUsers([]);
        });
    };

    // Render comment content with highlighted mentions
    const renderCommentContent = (content) => {
        if (!content) return null;
        // Simple @mention highlighting
        const parts = content.split(/(@\w+)/g);
        return parts.map((part, i) =>
            part.startsWith('@') ? (
                <span key={i} className="text-primary-600 dark:text-primary-400 font-medium">{part}</span>
            ) : (
                <span key={i}>{part}</span>
            )
        );
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {t('common.comments', 'Comentarios y Actividad')}
            </h4>

            {/* List of comments */}
            <div className="space-y-4 max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                {comments.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        {t('common.no_comments', 'No hay comentarios aún.')}
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.uuid} className="flex gap-3 items-start">
                            <div className="flex-shrink-0">
                                {comment.user?.profile_photo_url ? (
                                    <img 
                                        src={comment.user.profile_photo_url} 
                                        alt={comment.user.name} 
                                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-xs">
                                        {comment.user?.name?.substring(0, 2).toUpperCase() || '??'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                        {comment.user?.name || t('common.unknown_user', 'Usuario desconocido')}
                                    </span>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                        {dayjs(comment.created_at).fromNow()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {renderCommentContent(comment.content)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add comment form */}
            <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                <div className="relative">
                    <TextArea
                        ref={textAreaRef}
                        value={newComment}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            projectMembers.length > 0
                                ? t('common.add_comment_mention_placeholder', 'Escribe un comentario... usa @ para mencionar')
                                : t('common.add_comment_placeholder', 'Escribe un comentario o actualización...')
                        }
                        rows={3}
                        className="text-sm w-full"
                        disabled={isSubmitting}
                    />

                    {/* Mention autocomplete dropdown */}
                    {showMentionDropdown && filteredMembers.length > 0 && (
                        <div
                            ref={dropdownRef}
                            className="absolute bottom-full left-0 mb-1 w-full sm:w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                        >
                            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider border-b border-gray-100 dark:border-gray-700">
                                {t('common.mention_member', 'Mencionar miembro')}
                            </div>
                            {filteredMembers.map((member, index) => (
                                <button
                                    key={member.id}
                                    type="button"
                                    onClick={() => insertMention(member)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                                        index === selectedSuggestionIndex
                                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    {member.profile_photo_url ? (
                                        <img src={member.profile_photo_url} alt="" className="w-6 h-6 rounded-full" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-[10px]">
                                            {member.name?.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="font-medium truncate">{member.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mentioned users chips */}
                {mentionedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {mentionedUsers.map((u) => (
                            <span
                                key={u.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                            >
                                @{u.name}
                                <button
                                    type="button"
                                    onClick={() => removeMention(u.id)}
                                    className="ml-0.5 text-primary-500 hover:text-primary-700 dark:hover:text-primary-200 focus:outline-none"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex justify-end">
                    <PrimaryButton 
                        type="submit" 
                        disabled={isSubmitting || !newComment.trim()}
                        className="py-1.5 px-4 text-xs sm:text-sm w-full sm:w-auto justify-center"
                    >
                        {isSubmitting ? t('common.sending', 'Enviando...') : t('common.post_comment', 'Publicar')}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
