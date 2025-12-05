import { AppIcon } from '@/Components/Icons';
import { useTranslate } from '@/Hooks/useTranslate';

export default function ApplicationLogo({ className = '', onlyIcon = false, ...props }) {
    const { t } = useTranslate();

    return (
        <div className={`flex items-center ${onlyIcon ? 'justify-center' : 'space-x-2'} ${className}`} {...props}>
            <AppIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 shrink-0" />
            {!onlyIcon && (
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent truncate">
                    {t('app.name', 'ControlApp')}
                </span>
            )}
        </div>
    );
}
