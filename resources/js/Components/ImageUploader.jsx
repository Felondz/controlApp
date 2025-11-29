import { useRef } from 'react';
import InputLabel from '@/Components/InputLabel';

/**
 * ImageUploader Component
 * 
 * Componente reutilizable para selección y preview de imágenes
 * Soporta formas cuadradas y circulares, validación de tamaño, y más.
 * 
 * @param {File|null} value - Archivo seleccionado
 * @param {string|null} preview - URL del preview actual
 * @param {Function} onChange - Callback cuando cambia (file) => void
 * @param {Function} onDelete - Callback opcional para eliminar () => void
 * @param {'square'|'circle'} shape - Forma del preview
 * @param {'sm'|'md'|'lg'} size - Tamaño del preview
 * @param {number} maxSizeMB - Límite máximo en MB
 * @param {boolean} showDeleteButton - Mostrar botón eliminar
 * @param {string} label - Label del campo
 * @param {string} hint - Texto de ayuda
 * @param {string} error - Mensaje de error
 * @param {string} className - Clases CSS adicionales
 */
export default function ImageUploader({
    value = null,
    preview = null,
    onChange,
    onDelete = null,
    shape = 'square',
    size = 'md',
    maxSizeMB = 4,
    showDeleteButton = false,
    label = 'Imagen',
    hint = null,
    error = null,
    className = '',
}) {
    const fileInputRef = useRef(null);

    // Tamaños predefinidos
    const sizeClasses = {
        sm: shape === 'circle' ? 'h-16 w-16' : 'h-16 w-16',
        md: shape === 'circle' ? 'h-20 w-20' : 'h-24 w-24',
        lg: shape === 'circle' ? 'h-24 w-24' : 'h-32 w-32',
    };

    const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-xl';
    const sizeClass = sizeClasses[size] || sizeClasses.md;

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onChange(file);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`flex flex-col ${className}`}>
            {label && <InputLabel value={label} />}

            <div className={`mt-2 flex items-center gap-4 ${shape === 'circle' ? 'flex-row' : 'flex-col'}`}>
                {/* Preview */}
                <div
                    className={`${sizeClass} ${shapeClasses} overflow-hidden border-2 border-dashed ${error
                            ? 'border-red-500 dark:border-red-400'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400'
                        } transition-colors cursor-pointer group bg-gray-50 dark:bg-gray-900 ${shape === 'square' ? 'relative' : ''}`}
                    onClick={handleClick}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs text-center px-2">Subir</span>
                        </div>
                    )}
                    {shape === 'square' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-medium">
                                {preview ? 'Cambiar' : 'Subir'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Delete button for circle shape (profile style) */}
                {shape === 'circle' && showDeleteButton && preview && onDelete && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                    >
                        Quitar
                    </button>
                )}

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {/* Hint text */}
            {hint && !error && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {hint}
                </p>
            )}

            {/* Error message */}
            {error && (
                <div className="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
}
