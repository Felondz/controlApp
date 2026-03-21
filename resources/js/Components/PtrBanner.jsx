import { useTranslate } from '@/Hooks/useTranslate';
import { XMarkIcon } from '@/Components/Icons';
import { useState } from 'react';

export default function PtrBanner() {
    const { t } = useTranslate();
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 relative z-[60]">
            <div className="container mx-auto flex items-center justify-center gap-3">
                {/* Warning Icon */}
                <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* Text */}
                <div className="flex items-center gap-2 text-sm font-medium text-center">
                    <span className="hidden sm:inline">
                        <span className="opacity-80">{t('ptr.banner.environment', 'ENTORNO DE PRUEBA')}</span>
                        {' - '}
                    </span>
                    <span className="font-semibold">
                        {t('ptr.banner.warning', 'Los datos son de prueba y pueden ser eliminados en cualquier momento')}
                    </span>
                </div>

                {/* Dismiss Button */}
                <button
                    onClick={() => setDismissed(true)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-orange-400/50 rounded transition-colors"
                    title={t('ptr.banner.dismiss', 'Cerrar')}
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
