import { useState } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import Modal from '@/Components/Modal';

export default function MediaGallery({ images = [], className = '' }) {
    const { t } = useTranslate();
    const [selectedImage, setSelectedImage] = useState(null);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('common.media_gallery', 'Galería Multimedia')}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {images.map((image, index) => (
                    <div 
                        key={image.uuid || index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer group hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(image)}
                    >
                        <img 
                            src={image.image_url} 
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="2xl">
                <div className="p-4 relative bg-white dark:bg-gray-900 rounded-lg">
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    {selectedImage && (
                        <div className="flex flex-col items-center">
                            <img 
                                src={selectedImage.image_url} 
                                alt="Selected Media"
                                className="max-w-full max-h-[60vh] sm:max-h-[75vh] lg:max-h-[85vh] rounded-lg shadow-xl object-contain"
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
