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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[100] pointer-events-none print:hidden">
            <div className="pointer-events-auto flex items-center gap-2 bg-amber-600/90 backdrop-blur-sm text-white px-3 py-0.5 rounded-b-lg shadow-sm border-x border-b border-white/20 transition-all duration-200">
                <div className="flex flex-col leading-none">
                    <span className="text-[9px] font-bold tracking-widest uppercase opacity-90">
                        {t('ptr.banner.environment', 'TEST ENV')}
                    </span>
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className="ml-1 p-0.5 hover:bg-black/20 rounded-full transition-colors group"
                    title={t('ptr.banner.dismiss', 'Cerrar')}
                >
                    <XMarkIcon className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
                </button>
            </div>
        </div>
    );
}
