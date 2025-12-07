import { useTranslate } from '@/Hooks/useTranslate';

export default function InputLabel({
    value,
    className = '',
    children,
    optional = false,
    ...props
}) {
    const { t } = useTranslate();

    return (
        <label
            {...props}
            className={
                `block mb-1 text-sm font-semibold text-primary-800 dark:text-primary-300 ` +
                className
            }
        >
            {value ? value : children}
            {optional && <span className="text-gray-500 dark:text-gray-400 font-normal ms-1">{t('common.optional', '(Opcional)')}</span>}
        </label>
    );
}
