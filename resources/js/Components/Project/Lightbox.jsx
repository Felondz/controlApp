import React, { useEffect } from 'react';
import { XMarkIcon } from '@/Components/Icons';

export default function Lightbox({ src, alt, onClose }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
        >
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            >
                <XMarkIcon className="w-8 h-8" />
            </button>
            
            <div 
                className="relative max-w-[95vw] max-h-[90vh] flex flex-col items-center"
                onClick={e => e.stopPropagation()}
            >
                <img 
                    src={src} 
                    alt={alt || 'Full screen preview'} 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-300" 
                />
                {alt && (
                    <div className="mt-4 px-4 py-2 bg-black/50 text-white text-sm rounded-full backdrop-blur-md border border-white/10">
                        {alt}
                    </div>
                )}
            </div>
        </div>
    );
}
