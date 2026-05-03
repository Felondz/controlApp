import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@/Components/Icons';

export default function Toast({ message, type = 'success', duration = 5000, onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    const bgClass = type === 'success' 
        ? 'bg-green-500 border-green-600' 
        : type === 'error' 
            ? 'bg-red-500 border-red-600' 
            : 'bg-primary-500 border-primary-600';

    return (
        <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg border shadow-2xl text-white transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-4 ${bgClass}`}>
            {type === 'success' ? (
                <CheckCircleIcon className="w-5 h-5 shrink-0" />
            ) : (
                <XCircleIcon className="w-5 h-5 shrink-0" />
            )}
            <p className="text-sm font-medium mr-2">{message}</p>
            <button 
                onClick={() => { setVisible(false); onClose(); }}
                className="ml-auto p-0.5 hover:bg-white/20 rounded transition"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
