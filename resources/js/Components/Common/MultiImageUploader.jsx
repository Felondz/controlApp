import { useRef } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import InputLabel from '@/Components/InputLabel';

export default function MultiImageUploader({ 
    images = [], 
    onChange, 
    label, 
    error = null,
    className = '' 
}) {
    const { t } = useTranslate();
    const fileInputRef = useRef(null);
    const displayLabel = label !== undefined ? label : t('common.images', 'Imágenes');

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            onChange([...images, ...files]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {displayLabel && <InputLabel value={displayLabel} />}
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
                {images.map((image, index) => {
                    const preview = image instanceof File 
                        ? URL.createObjectURL(image) 
                        : image.image_url;
                        
                    return (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img 
                                src={preview} 
                                alt={`Preview ${index}`} 
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    );
                })}
                
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-gray-50 dark:bg-gray-900/50 p-2"
                >
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-gray-500 dark:text-gray-400 font-medium text-center">
                        {t('common.add', 'Añadir')}
                    </span>
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}
